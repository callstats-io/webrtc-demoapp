'use strict';

class ContentLeftHandler {
  constructor() {
    this.mediaStream = null;
  }
  getState() {
    return {
      mediaStream: this.mediaStream
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    this.setState({
      media: media
    });
  }
}

export default ContentLeftHandler;
