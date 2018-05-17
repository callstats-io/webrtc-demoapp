'use strict';

class VideoMainHandler {
  constructor(name) {
    this.name = name;
    this.isLocal = false;
    this.isScreen = false;
    this.muted = false;
    if (name === 'local') {
      this.muted = true;
      this.isLocal = true;
    }
  }
  getState() {
    return {
      videoHeight: 640.0,
      muted: this.muted
    };
  }
  componentDidMount() {
    this.video.srcObject = this.props.stream;
  }
  componentDidUpdate() {
    this.video.srcObject = this.props.stream;
  }
  shouldComponentUpdate() {
    if (this.props.stream) {
      this.videoHandler.isLocal = this.props.stream.isLocal === true;
      this.videoHandler.isScreen = this.props.stream.isScreen === true;
    }
    return true;
  }
  onResizeVideoView(e) {
    setTimeout(function() {
      const height = Math.max(e.detail.height - 200, 360.0);
      const from = e.detail.from;
      if (from === 'contentRightHandler') {
        this.setState({
          videoHeight: height
        });
      }
    }.bind(this), 1 * 1000);
  }
}

export default VideoMainHandler;
