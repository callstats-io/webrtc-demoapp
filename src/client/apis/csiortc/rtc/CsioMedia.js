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
  }
  addStream(stream, pc) {
    stream.getTracks().forEach(function(mediaTrack) {
      if (typeof pc.addTrack === 'function') {
        pc.addTrack(mediaTrack, stream);
      }
    });
  }
  removeStream(pc) {
    pc.getSenders().forEach((sender) => {
      if (typeof pc.addTrack === 'function') {
        pc.removeTrack(sender);
      }
    });
  }
  getStream(userId, isLocal) {
    if (isLocal) {
      return this.localStream;
    } else {
      return this.remoteStreams[userId];
    }
  }
}

export default CsioMediaCtrl;
