'use strict';
import CsioRTC from './csiortc/CsioRTC';

class CsioRTCClient {
  constructor() {
    this.csiortc = new CsioRTC();
  }
}

export let csioRTCClient = new CsioRTCClient();
