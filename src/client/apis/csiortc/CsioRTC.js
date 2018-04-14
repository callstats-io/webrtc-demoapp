'use strict';

import CsioSignalling from './signaling/CsioSignalling';
import CsioMediaCtrl from './rtc/CsioMediaCtrl';
import {CsioEvents, TriggerEvent} from '../../events/CsioEvents';
import CsioPeerConnection from './rtc/CsioPeerConnection';

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    // application scope variable
    this.joined = false;
    this.config = undefined;
    this.roomName = undefined;
    this.pcs = {};
    this.labels = ['chat'];

    this.signaling = new CsioSignalling();
    this.csoiMedia = new CsioMediaCtrl();

    document.addEventListener(
      CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA,
      this.onLocalUserMedia.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.SEND_CHANNEL_MESSAGE,
      this.onSendChannelMessage.bind(this), false);
    document.addEventListener(
      CsioEvents.FFScreenShare.ON_SCREEN_SHARE_OPTION_SELECTED,
      this.onStartedScreenShare.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_ICE_FAILED,
      this.onIceFailed.bind(this), false);
    window.addEventListener(
      'message',
      this.onStartedScreenShare.bind(this), this);
  }
  mayBeInitializeRTC() {
    const mediaConfig = this.config ? this.config.media : undefined;
    const roomName = this.roomName;
    if (mediaConfig && roomName) {
      console.log('may be initialize media ', mediaConfig);
      this.csoiMedia.getUserMedia(mediaConfig);
    }
  }
  onLocalUserMedia(e) {
    const roomName = this.roomName;
    if (roomName) {
      if (this.joined) {
        // already in the room
        // will need a re-negotiation
        // Add tracks
        const stream = this.csoiMedia.getStream(true);
        for (const key in this.pcs) {
          if (this.pcs.hasOwnProperty(key) && this.pcs[key]) {
            this.csoiMedia.addStream(stream, this.pcs[key]);
          }
        }
        // renegotiate
        for (const key in this.pcs) {
          if (this.pcs.hasOwnProperty(key) && this.pcs[key]) {
            this.pcs[key].createOffer();
          }
        }
      } else {
        this.signaling.start(roomName);
        this.joined = true;
      }
    }
  }
  doOffer(userId) {
    this.mayBeCreatePC(userId);
    const pc = this.pcs[userId];
    pc.createOffer();
  }
  doAnswer(userId, offer) {
    this.mayBeCreatePC(userId);
    const pc = this.pcs[userId];
    pc.setRemoteDescription(offer);
  }
  addIceCandidates(userId, iceCandidate) {
    if (this.pcs[userId]) {
      this.pcs[userId].addIceCandidate(iceCandidate);
    }
  }
  mayBeCreatePC(userId) {
    if (userId && !this.pcs[userId]) {
      const iceConfig = this.config ? this.config.peerConnection : {};
      const stream = this.csoiMedia.getStream(true);
      this.pcs[userId] = new CsioPeerConnection(userId, iceConfig, stream);
      for (const label of this.labels) {
        this.pcs[userId].createChannel(label);
      }
      this.csoiMedia.addStream(stream, this.pcs[userId]);
    }
  }
  mayBeDisposePC(userId) {
    if (userId && this.pcs[userId]) {
      this.pcs[userId].close();
      this.csoiMedia.disposeRemoteStream(userId);
      delete this.pcs[userId];
    }
  }
  mayBeStartStopScreenShare(isEnable) {
    for (const key in this.pcs) {
      if (this.pcs.hasOwnProperty(key) && this.pcs[key]) {
        this.csoiMedia.removeStream(this.pcs[key]);
      }
    }
    this.csoiMedia.disposeLocalStream();
    const isFF = !!navigator.mozGetUserMedia;
    if (isEnable) {
      if (isFF) {
        // show popup
        TriggerEvent(CsioEvents.CsioRTC.ON_FF_SCREEN_SHARE_OPTION, {});
      } else {
        window.postMessage('csioCheckAddonInstalled', '*');
      }
    } else {
      // restart with getting local audio video
      const mediaConfig = this.config ? this.config.media : undefined;
      const roomName = this.roomName;
      if (mediaConfig && roomName) {
        this.csoiMedia.getUserMedia(mediaConfig);
      }
    }
  }
  onStartedScreenShare(msg) {
    if (msg.detail && msg.detail.from === 'ffScreenShare') {
      const constraints = {
        'mediaSource': msg.detail.mediaSource,
        // 'mediaSource': 'screen', // whole screen sharing
        // 'mediaSource': 'window', // choose a window to share
        // 'mediaSource': 'application', // choose a window to share
        'width': {max: '1920'},
        'height': {max: '1080'},
        'frameRate': {max: '10'}
      };
      const roomName = this.roomName;
      console.warn(constraints);
      if (constraints && roomName) {
        this.csoiMedia.getUserMedia({video: constraints, audio: false});
      }
    } else if (msg.data && msg.data.evt === 'onCsioSourceId') {
      const constraints = {
        'mandatory': {
          'chromeMediaSource': 'desktop',
          'maxWidth': Math.min(screen.width, 1920),
          'maxHeight': Math.min(screen.height, 1080),
          'chromeMediaSourceId': msg.data.csioSourceId
        },
        'optional': [
          {googTemporalLayeredScreencast: true}
        ]
      };
      const roomName = this.roomName;
      if (constraints && roomName) {
        this.csoiMedia.getUserMedia({video: constraints, audio: false});
      }
    } else if (msg.data && msg.data === 'csioAddonInstalled') {
      const detail = {
        required: false
      };
      TriggerEvent(
        CsioEvents.CsioRTC.ON_EXTENTION_REQUIRED, detail);
      window.postMessage('csioRequestScreenSourceId', '*');
    } else if (msg.data && msg.data === 'csioCheckAddonInstalled') {
      // No extension is installed
      const detail = {
        required: true,
        downloadURL: __extension_download_url__
      };
      TriggerEvent(
        CsioEvents.CsioRTC.ON_EXTENTION_REQUIRED, detail);
    }
  }
  toggleMediaStates(isEnable, mediaType) {
    if (mediaType === 'screen') {
      // this is screen share
      this.mayBeStartStopScreenShare(isEnable);
    } else {
      this.csoiMedia.toggleMediaStates(isEnable, mediaType);
    }
    const getLog = (userId) => {
      let _type;
      let eventLog;
      if (mediaType === 'audio') {
        _type = (isEnable ? 'audioUnmuted' : 'audioMuted');
        eventLog = `Audio is ${(isEnable ? 'unmuted' : 'muted')} for ${userId}`;
      } else if (mediaType === 'video') {
        _type = (isEnable ? 'videoResumed' : 'videoPaused');
        eventLog = `Video is ${(isEnable ? 'resumed' : 'paused')} for ${userId}`;
      } else if (mediaType === 'screen') {
        _type = (isEnable ? 'screenShareEnabled' : 'screenShareDisabled');
        eventLog = `Screen share is ${(isEnable ? 'enabled' : 'disabled')} for ${userId}`;
      }
      return {_type, eventLog};
    };
    for (const key in this.pcs) {
      if (this.pcs.hasOwnProperty(key) && this.pcs[key]) {
        let {_type, eventLog} = getLog(key);
        const detail = {
          pc: this.pcs[key].pc,
          type: _type,
          eventLog: eventLog
        };
        TriggerEvent(
          CsioEvents.CsioRTC.ON_TOGGLE_MEDIA_STATE, detail);
        TriggerEvent(
          CsioEvents.CsioPeerConnection.ON_APPLICATION_LOG, detail);
      }
    }
  }
  onSendChannelMessage(e) {
    const label = e.detail.label;
    const message = e.detail.message;
    for (let i in this.pcs) {
      this.pcs[i].sendChannelMessage(label, message);
    }
  }
  onIceFailed(e) {
    console.log(`ice failed for  ${e.userId}, retying in 200 ms`);
    const pc = e.detail.pc;
    // may be try to re-negotiate
    setTimeout(function() {
      pc.createOffer();
    }, 200);
  }
  dispose() {
    // leave room
    if (this.signaling) {
      this.signaling.stop();
    }
    // stop peer connections
    for (const key in this.pcs) {
      if (this.pcs.hasOwnProperty(key) && this.pcs[key]) {
        console.warn('dispose pc ', key);
        this.mayBeDisposePC.bind(this, key);
      }
    }
  }
}

export default CsioRTC;
