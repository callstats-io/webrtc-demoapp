/**
 * Simple media constroller wrapper class to handle local, and remove media streams for
 * webrtc demo application
 */
'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';
import Hark from 'hark';
class CsioMediaCtrl {
  constructor() {
    this.TIMEDIFF = 3; // 3 seconds for now
    this.previouslySelectedUserId = undefined;
    this.remoteStreams = {};
    this.speakers = {};
    this.localStream = {};
    this.lastUpdate = new Date();
    // event listeners
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_REMOTE_STREAM,
      this.onRemoteStream.bind(this), false);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.VIDEO_FOCUS_CHANGE,
      this.onVideoFocusChanged.bind(this), false);
  }
  async isAudioOnly(constraints) {
    // if no audio, then don't need to check we need audio only
    if (!constraints.audio) {
      return false;
    }
    let audioOnly = false;
    try {
      await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      audioOnly = true;
    };
    return audioOnly;
  }
  isSpeaking(userId) {
    const current = new Date();
    const seconds = (current.getTime() - this.lastUpdate.getTime()) / 1000;
    if (seconds > this.TIMEDIFF && this.previouslySelectedUserId !== userId) {
      this.lastUpdate = new Date();
      const detail = {
        userId: userId,
        from: 'isSpeaking'
      };
      TriggerEvent(CsioEvents.MEETING_PAGE.VIDEO_FOCUS_CHANGE, detail);
    }
  }
  getUserMedia(constraints) {
    const self = this;
    let promise = this.isAudioOnly(constraints);
    promise.then(function(audioOnly) {
      let _contrain = {...constraints};
      if (audioOnly) {
        _contrain.video = false;
      }
      navigator.mediaDevices.getUserMedia(_contrain)
        .then(function(stream) {
          const detail = {
            media: stream
          };
          self.localStream = stream;
          TriggerEvent(
            CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA, detail);
        },
        function(e) {
          console.error(e);
          self.localStream = null;
          const detail = {
            type: 'getUserMedia',
            pc: null,
            error: e
          };
          TriggerEvent(
            CsioEvents.CsioPeerConnection.ON_WEBRTC_ERROR, detail);
        });
    }, (e) => {
      console.error(e);
    });
  }
  addStream(stream, pc) {
    stream.getTracks().forEach(function(mediaTrack) {
      if (typeof pc.addTrack === 'function') {
        pc.addTrack(mediaTrack, stream);
      }
    }, pc);
  }
  removeStream(pc, userId) {
    pc.getSenders().forEach(function(sender) {
      if (typeof pc.removeTrack === 'function') {
        try {
          pc.removeTrack(sender);
        } catch (e) {
          console.error(e);
        }
      }
    }, pc);
  }
  getStream(isLocal, userId) {
    if (isLocal) {
      return this.localStream;
    } else {
      return this.remoteStreams[userId];
    }
  }
  disposeLocalStream() {
    if (this.localStream) {
      for (const at in this.localStream.getTracks()) {
        this.localStream.getTracks()[at].stop();
      }
      this.localStream = null;
    }
  }
  disposeRemoteStream(userId) {
    delete this.remoteStreams[userId];
    delete this.speakers[userId];
    const detail = {
      media: this.remoteStreams,
      userId: userId
    };
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.ON_ADD_REMOVE_REMOTESTREAM, detail);
  }
  // toggle media states
  toggleMediaStates(isMuteOrPaused, mediaType) {
    if (!this.localStream) {
      return;
    }
    let mediaTracks = mediaType === 'audio'
      ? this.localStream.getAudioTracks() : this.localStream.getVideoTracks();
    if (mediaTracks.length === 0) {
      console.warn('No local ', mediaType, 'track available.');
      return;
    }
    for (const i in mediaTracks) {
      if (mediaTracks.hasOwnProperty(i) && mediaTracks[i]) {
        mediaTracks[i].enabled = isMuteOrPaused;
      }
    }
  }

  // Event based functions
  // when peer connection got remote streams
  onRemoteStream(e) {
    const streams = e.detail.streams;
    const userId = e.detail.userId;
    this.remoteStreams[userId] = streams[0];
    this.speakers[userId] = new Hark(streams[0], {});
    this.speakers[userId].on('speaking', function() {
      this.isSpeaking(userId);
    }.bind(this));
    const detail = {
      media: this.remoteStreams,
      userId: userId
    };
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.ON_ADD_REMOVE_REMOTESTREAM, detail);
  }
  // ui related stream change handler
  onVideoFocusChanged(e) {
    const userId = e.detail.userId;
    const from = e.detail.from;
    let detail = {
      media: this.localStream,
      from: 'videoFocusChanged'
    };
    // if from click handler must need a change
    if (from === 'onClickHandler') {
      detail.media = userId === 'local' ? this.localStream : this.remoteStreams[userId];
    } else {
      if (this.remoteStreams[this.previouslySelectedUserId]) {
        detail.media = this.remoteStreams[this.previouslySelectedUserId];
      } else if (this.remoteStreams[userId]) {
        detail.media = this.remoteStreams[userId];
      }
    }
    this.previouslySelectedUserId = userId;
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.VIDEO_FOCUS_CHANGE, detail);
  }
}

export default CsioMediaCtrl;
