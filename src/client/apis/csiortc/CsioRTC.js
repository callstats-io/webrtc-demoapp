'use strict';

import CsioSignalling from './signaling/CsioSignalling';
import CsioPeerConnection from './rtc/CsioPeerConnection';
import CsioMediaCtrl from './rtc/CsioMediaCtrl';
import CsioConfigParams from './../utils/Common';

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    // application scope variable
    this.mediaConfig = undefined;
    this.pcConfig = undefined;
    this.roomName = undefined;
    this.pcs = {};
    this.labels = ['chat'];

    this.signaling = new CsioSignalling();
    this.csoiMedia = new CsioMediaCtrl();
  }
}

export default CsioRTC;
