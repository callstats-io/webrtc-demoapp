'use strict';

class CsioMediaCtrl {
  constructor(userId) {
    this.userId = userId;
  }
  async initLocalMedia(constraints) {
    console.log('Requesting local stream');
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  }
}

export default CsioMediaCtrl;
