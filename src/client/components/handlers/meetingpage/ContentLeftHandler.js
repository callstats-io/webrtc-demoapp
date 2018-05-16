'use strict';

class ContentLeftHandler {
  constructor() {
    this.mediaStream = null;
    this.isScreenShare = false;
    this.hrHeight = 0;
  }
  getState() {
    return {
      mediaStream: this.mediaStream,
      isScreenShare: this.isScreenShare,
      hrHeight: this.hrHeight
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    const isScreenShare = e.detail.isScreenShare || false;
    this.setState({
      media: media,
      isScreenShare: isScreenShare
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
