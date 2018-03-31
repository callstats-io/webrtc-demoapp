'use strict';

class RemoteVideosHandler {
  constructor() {
    this.currenlyFocused = undefined;
    this.remoteVideos = {};
  }
  getState() {
    return {
      currenlyFocused: this.currenlyFocused,
      remoteVideos: this.remoteVideos
    };
  }
  onRemoteVideos(e) {
    const media = e.detail.media;
    this.setState({
      remoteVideos: media
    });
  }
}

export default RemoteVideosHandler;
