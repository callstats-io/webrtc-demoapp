'use strict';

import CsioSignalling from './signaling/CsioSignalling';
import CsioMediaCtrl from './rtc/CsioMediaCtrl';
import {CsioEvents} from '../../events/CsioEvents';
import CsioPeerConnection from './rtc/CsioPeerConnection';

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    // application scope variable
    this.config = undefined;
    this.roomName = undefined;
    this.pcs = {};
    this.labels = ['chat'];

    this.signaling = new CsioSignalling();
    this.csoiMedia = new CsioMediaCtrl();

    document.addEventListener(
      CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA,
      this.onLocalUserMedia.bind(this), false);
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
      this.signaling.start(roomName);
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
      console.warn(userId, this.pcs[userId]);
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
  toggleMediaStates(isEnable, mediaType) {
    if (mediaType !== 'screen') {
      this.csoiMedia.toggleMediaStates(isEnable, mediaType);
    }
  }
}

export default CsioRTC;
