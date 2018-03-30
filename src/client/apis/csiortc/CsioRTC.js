'use strict';

import CsioSignalling from './signaling/CsioSignalling';
import CsioPeerConnection from './rtc/CsioPeerConnection';
const CsioEvents = require('./events/CsioEvents').CsioEvents;
const modCommon = require('./utils/Common');

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    // application scope variable
    this.localUserId = undefined;
    this.mediaConfig = undefined;
    this.pcConfig = undefined;
    this.roomName = undefined;
    this.signaling = new CsioSignalling();
    this.localStream = undefined;
    this.remoteStreams = {};
    this.pcs = {};
    // this.csObject = new callstats();
    // this.csObject.on('defaultConfig', this.defaultConfigCallback.bind(this));
    // this.csObject.on('recommendedConfig', this.recommendedConfigCallback.bind(this));

    document.addEventListener(CsioEvents.UserEvent.Signaling.CONNECT, this.onConnect.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERJOIN, this.onUserJoin.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERLEAVE, this.onUserLeave.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Signaling.USERMESSAGE, this.onUserMessage.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Media.ADDREMOTESTREAM, this.onAddStream.bind(this), false);
    document.addEventListener(CsioEvents.UserEvent.Media.REMOVEREMOTESTREAM, this.onRemoveStream.bind(this), false);
  }
  onConnect(e) {
    const userId = e.detail.localname;
    console.log('Initialize callstats', userId);
    const userID = {
      'userName': userId,
      'aliasName': userId
    };
    const configParams = {
      disableBeforeUnloadHandler: false,
      applicationVersion: 'v1.0'
    };
    /*this.csObject.initialize('619077833', 'RwAYI/480Qen:zi4TsKz/XW/AfINdX90EyCwSmlYqN0HKt0Lb6uFG1D4=',
      userID, this.csInitCallback, this.csStatsCallback, configParams);*/
  }
  onUserJoin(e) {
    const userId = e.detail.userId;
    const iceConfig = this.pcConfig;
    console.log('new user joined.', userId, iceConfig);
    const pc = new CsioPeerConnection(
      userId,
      iceConfig,
      this.localStream);
    this.pcs[userId] = pc;
    pc.createOffer();
  }
  onUserLeave(e) {
    const userId = e.detail.userId;
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Media.REMOVEREMOTESTREAM,
      {'userId': userId});
    if (this.pcs[userId]) {
      this.pcs[userId].close();
      delete this.pcs[userId];
    }
  }
  onUserMessage(e) {
    const userId = e.detail.userId;
    const message = e.detail.message;
    console.warn('->', userId, message);
    let pc;
    if (this.pcs[userId]) {
      pc = this.pcs[userId];
    } else {
      pc = new CsioPeerConnection(
        userId,
        this.iceConfig, this.localStream);
      this.pcs[userId] = pc;
    }

    let json = JSON.parse(message);
    if (json.ice) {
      pc.addIceCandidate(json.ice);
    }
    if (json.offer) {
      pc.setRemoteDescription(json.offer);
    }
  }
  onAddStream(e) {
    const streams = e.detail.streams;
    const userId = e.detail.userId;
    this.remoteStreams[userId] = streams[0];
    console.log('->','remote streams',this.remoteStreams);
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Media.REMOTEMEDIA, {'media': this.remoteStreams});
  }
  onRemoveStream(e) {
    const userId = e.detail.userId;
    delete this.remoteStreams[userId];
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Media.REMOTEMEDIA, {'media': this.remoteStreams});
  }
  sayHello() {
    console.log('say hello');
  }
  // signaling related call
  joinRoom(roomName) {
    this.signaling.start(roomName);
  }
  // CSIO object callback
  defaultConfigCallback(config) {
    console.log('ConfigService, default config:', config);
    if (config.media) {
      this.mediaConfig = config.media;
    }
    if (config.peerConnection) {
      this.pcConfig = config.peerConnection;
    }
    const self = this;
    const roomName = this.roomName;
    if (roomName !== undefined) {
      this.initializeLocalMedia(config.media).then(
        (stream) => {
          window.csioRTC.setLocalStream(stream);
          if (roomName !== undefined) {
            self.joinRoom(roomName);
          }
        },
        (err) => {
          console.error(err);
        });
    }
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
  csInitCallback(csError, csErrMsg) {
    console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
  }
  csStatsCallback(stats) {
    console.log('stats callback');
  };
  initializeLocalMedia(constraints) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          modCommon.triggerEvent(
            CsioEvents.UserEvent.Media.LOCALMEDIA, {'media': stream});
          resolve(stream);
        },
        function(e) {
          reject(e);
        });
    });
  }
  setLocalStream(stream) {
    this.localStream = stream;
  }
  setRoomName(roomName) {
    this.roomName = roomName;
  }
  getRoomName() {
    return this.roomName;
  }
  getMediaConstrain() {
    return this.mediaConfig;
  }
  getStream() {
    return this.localStream;
  }
}

export default CsioRTC;
