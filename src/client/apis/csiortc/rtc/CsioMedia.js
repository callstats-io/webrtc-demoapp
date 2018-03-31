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
  addStream(stream, ctx) {
    stream.getTracks().forEach(function(mediaTrack) {
      if (typeof ctx.pc.addTrack === 'function') {
        ctx.pc.addTrack(mediaTrack, stream);
      }
    }, ctx);
  }
  removeStream(ctx, userId) {
    ctx.pc.getSenders().forEach(function(sender) {
      if (typeof ctx.pc.removeTrack === 'function') {
        ctx.pc.removeTrack(sender);
      }
    }, ctx);
  }
  getStream(isLocal, userId) {
    if (isLocal) {
      return this.localStream;
    } else {
      return this.remoteStreams[userId];
    }
  }
  disposeStream(isLocal, userId) {
    if (isLocal) {
      this.localStream = null;
    } else {
      delete this.remoteStreams[userId];
      modCommon.triggerEvent(
        CsioEvents.UserEvent.Media.REMOTEMEDIA, {'media': this.remoteStreams});
    }
  }
}

export default CsioMediaCtrl;
