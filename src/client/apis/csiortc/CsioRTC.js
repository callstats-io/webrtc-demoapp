'use strict';

import CsioSignalling from './signaling/CsioSignalling';
import CsioPeerConnection from './rtc/CsioPeerConnection';
import CsioMedia from './rtc/CsioMedia';
const CsioEvents = require('./events/CsioEvents').CsioEvents;
const csioConfigParams = require('./utils/Common');

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    // application scope variable
    this.mediaConfig = undefined;
    this.pcConfig = undefined;
    this.roomName = undefined;
    this.pcs = {};
    this.labels = ['chat'];
    // all objects class
    this.csObject = new callstats();
    this.csObject.on('defaultConfig', this.defaultConfigCallback.bind(this));
    this.csObject.on('recommendedConfig', this.recommendedConfigCallback.bind(this));
    this.signaling = new CsioSignalling();
    this.csoiMedia = new CsioMedia();
    // ui related events
    document.addEventListener(CsioEvents.UIEvent.MEETING_PAGE_LOADED, this.onMeetingPageLoaded.bind(this), false);
    document.addEventListener(CsioEvents.UIEvent.TOGGLE_MEDIA_STATE, this.onToggleMediaState.bind(this), false);
    document.addEventListener(CsioEvents.UIEvent.CLOSE_MEETING, this.onCloseMeeting.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.SETLOCALMEDIA, this.onSetLocalMedia.bind(this), false);
    // signaling specific events
    // 1. connection with socket io success
    // 2. a new user join to room
    // 3. a existing user left room
    // 4. a user send a message in room
    document.addEventListener(CsioEvents.UserEvent.Signaling.CONNECT, this.onConnect.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERJOIN, this.onUserJoin.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERLEAVE, this.onUserLeave.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERMESSAGE, this.onUserMessage.bind(this), false);
    // webrtc events
    document.addEventListener(CsioEvents.RTCEvent.SENDMESSAGE, this.onSendDCMessage.bind(this), false);
  }
  onMeetingPageLoaded(e) {
    const roomName = e.detail.roomName;
    this.roomName = roomName;
    // initialize media
    this.mayBeInitializeMedia();
  }
  onToggleMediaState(e) {
    const mediaType = e.detail.mediaType;
    const isEnable = e.detail.isEnable;
    this.csoiMedia.toggleMediaStates(isEnable, mediaType);
  }
  onCloseMeeting(e) {
    console.log('came here');
    this.signaling.stop();
    for (let userId in Object.keys(this.pcs)) {
      this.mayBeDisposePC(userId);
    }
  }
  // when we have local media we are ready to join the room
  onSetLocalMedia(roomName) {
    this.signaling.start(roomName);
  }
  mayBeInitializeMedia() {
    const mediaConstrain = this.mediaConfig;
    const roomName = this.roomName;
    if (mediaConstrain !== undefined && roomName !== undefined) {
      this.csoiMedia.getUserMedia(mediaConstrain);
    }
  }
  onConnect(e) {
    const userId = e.detail.localname;
    const userID = {
      'userName': userId,
      'aliasName': userId
    };
    this.initializeCsio(userID);
  }
  onUserJoin(e) {
    const userId = e.detail.userId;
    console.log('new user joined.', userId);
    this.doOffer(userId);
  }
  onUserLeave(e) {
    const userId = e.detail.userId;
    this.mayBeDisposePC(userId);
  }
  onUserMessage(e) {
    const userId = e.detail.userId;
    const json = JSON.parse(e.detail.message);
    if (json.ice) {
      this.pcs[userId].addIceCandidate(json.ice);
    } else {
      this.doAnswer(userId, json.offer);
    }
  }
  onSendDCMessage(e) {
    const label = e.detail.label;
    const message = e.detail.message;
    for (let i in this.pcs) {
      this.pcs[i].sendChannelMessage(label, message);
    }
  }
  mayBeCreatePC(userId) {
    if (!this.pcs[userId]) {
      const iceConfig = this.pcConfig;
      const stream = this.csoiMedia.getStream(true);
      const pc = new CsioPeerConnection(userId, iceConfig, stream);
      for (const label of this.labels) {
        pc.createChannel(label);
      }
      this.csoiMedia.addStream(stream, pc);
      this.pcs[userId] = pc;
    }
  }
  mayBeDisposePC(userId) {
    if (this.pcs[userId]) {
      this.pcs[userId].close();
      this.csoiMedia.disposeStream(false, userId);
      delete this.pcs[userId];
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
  // csio related events, and function
  // CSIO object callback
  defaultConfigCallback(config) {
    console.log('ConfigService, default config:', config);
    if (config.media) {
      this.mediaConfig = config.media;
    }
    if (config.peerConnection) {
      this.pcConfig = config.peerConnection;
    }
    this.mayBeInitializeMedia();
  }
  recommendedConfigCallback(config) {
    console.log('ConfigService, recommended config:', config);
    if (config.media) {
      this.mediaConfig = config.media;
    }
    if (config.peerConnection) {
      this.pcConfig = config.peerConnection;
    }
  }
  initializeCsio(userID) {
    this.csObject.initialize('619077833',
      'RwAYI/480Qen:zi4TsKz/XW/AfINdX90EyCwSmlYqN0HKt0Lb6uFG1D4=',
      userID, this.csInitCallback, this.csStatsCallback, csioConfigParams);
  }
  csInitCallback(csError, csErrMsg) {
    console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
  }
  csStatsCallback(stats) {
    console.log('stats callback');
  };
}

export default CsioRTC;
