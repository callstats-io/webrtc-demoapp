'use strict';
import CsioRTC from './csiortc/CsioRTC';

class CsioRTCClient {
  constructor() {
    this.csiortc = new CsioRTC();
  }
  initialize() {
    console.log('CsioRTCClient initialized!');
  }
}

export let csioRTCClient = new CsioRTCClient();
