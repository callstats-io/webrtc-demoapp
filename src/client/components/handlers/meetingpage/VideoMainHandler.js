'use strict';

class VideoMainHandler {
  constructor(name) {
    this.name = name;
    this.muted = false;
    if (name === 'local') {
      this.muted = true;
    }
  }
  getState() {
    return {
      videoHeight: 640.0
    };
  }
  componentDidMount() {
    this.video.srcObject = this.props.stream;
  }
  componentDidUpdate() {
    this.video.srcObject = this.props.stream;
  }
  onResizeVideoView(e) {
    const height = Math.max(e.detail.height - 200, 320.0);
    const from = e.detail.from;
    console.warn(height, from);
    if (from === 'contentRightHandler') {
      this.setState({
        videoHeight: height
      });
    }
  }
}

export default VideoMainHandler;
