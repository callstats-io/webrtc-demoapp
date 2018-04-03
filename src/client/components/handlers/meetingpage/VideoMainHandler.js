'use strict';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class VideoMainHandler {
  constructor(name) {
    this.name = name;
    this.muted = false;
    if (name === 'local') {
      this.muted = true;
    }
    this.prvWidth = 0;
    this.prvHeight = 0;
  }
  getState() {
    return {
      videoWidth: 340,
      videoHeight: 640,
      scale: parseFloat(640.0 / 320.0)
    };
  }
  componentDidMount() {
    console.log('componentDidMount', this.state.videoWidth, this.state.videoHeight);
    this.video.srcObject = this.props.stream;
  }
  shouldComponentUpdate(props) {
    return true;
  }
  componentDidUpdate() {
    console.log('componentDidUpdate', this.state.videoWidth, this.state.videoHeight);
    this.video.srcObject = this.props.stream;
  }
  onClickHandler(e) {
    e.preventDefault();
    // name is actually user's user id
    const userId = this.props.name;
    const detail = {
      userId: userId,
      from: 'onClickHandler'
    };
    TriggerEvent(
      CsioEvents.MEETING_PAGE.VIDEO_FOCUS_CHANGE,
      detail);
  }
  onResizeVideoView(e) {
    const width = e.detail.width;
    const height = e.detail.height;
    const from = e.detail.from;
    if (from === 'contentLeftHandler') {
      this.setState({
        videoWidth: width,
        videoHeight: height,
        scale: parseFloat(height) / parseFloat(width)
      });
      console.warn('-> ', width, height, from);
    }
  }
}

export default VideoMainHandler;
