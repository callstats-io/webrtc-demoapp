'use strict';

const modCommon = require('../utils/Common');
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;

class CsioMediaCtrl {
  constructor() {
    this.remoteStreams = {};
    this.localStream = {};
    // event listeners
    document.addEventListener(
      CsioEvents.UserEvent.Media.LOCALMEDIA,
      this.onLocalStream.bind(this),
      false);
    document.addEventListener(
      CsioEvents.UserEvent.Media.ADDREMOTESTREAM,
      this.onRemoteStream.bind(this), false);
  }
  getUserMedia(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        const detail = {
          media: stream
        };
        modCommon.triggerEvent(
          CsioEvents.UserEvent.Media.LOCALMEDIA, detail);
      },
      function(e) {
        console.error(e);
      });
  }
  onLocalStream(e) {
    const stream = e.detail.media;
    this.localStream = stream;
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Signaling.SETLOCALMEDIA, {});
  }
  onRemoteStream(e) {
    const streams = e.detail.streams;
    const userId = e.detail.userId;
    this.remoteStreams[userId] = streams[0];
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Media.REMOTEMEDIA, {'media': this.remoteStreams});
  }
  addStream(stream, pc) {
    stream.getTracks().forEach(function(mediaTrack) {
      if (typeof pc.addTrack === 'function') {
        pc.addTrack(mediaTrack, stream);
      }
    });
  }
  removeStream(pc, userId) {
    pc.getSenders().forEach((sender) => {
      if (typeof pc.removeTrack === 'function') {
        pc.removeTrack(sender);
      }
    });
    modCommon.triggerEvent(
      CsioEvents.UserEvent.Media.REMOVEREMOTESTREAM,
      {'userId': userId});
  }
  getStream(isLocal, userId) {
    if (isLocal) {
      return this.localStream;
    } else {
      return this.remoteStreams[userId];
    }
  }
  disposeStream(isLocal, userId){
    if (isLocal) {
      this.localStream = null;
    } else {
      delete this.remoteStreams[userId];
    }
  }
}

export default CsioMediaCtrl;
