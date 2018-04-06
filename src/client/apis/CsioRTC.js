'use strict';

import CsioSignalling from './signaling/CsioSignalling';

class CsioRTC {
  constructor() {
    console.log('CSIORTC');
    this.signaling = new CsioSignalling();
  }
  sayHello() {
    console.log('say hello');
  }
}

export default CsioRTC;
