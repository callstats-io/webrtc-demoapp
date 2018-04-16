'use strict';

class ContentLeftHandler {
  constructor() {
    this.mediaStream = null;
    this.hrHeight = 0;
  }
  getState() {
    return {
      mediaStream: this.mediaStream,
      hrHeight: this.hrHeight
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    this.setState({
      media: media
    });
  }
  onResizeVideoView(e) {
    const height = Math.max(e.detail.height, 320.0);
    const from = e.detail.from;
    if (from === 'contentRightHandler') {
      this.setState({
        hrHeight: height
      });
    }
  }
}

export default ContentLeftHandler;
