'use strict';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class VideoHandler {
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
      muted: this.muted
    };
  }
  componentDidMount() {
    this.video.srcObject = this.props.stream;
  }
  shouldComponentUpdate(props) {
    if (this.props.stream) {
      this.videoHandler.isLocal = props.stream.isLocal === true;
      this.videoHandler.isScreen = props.stream.isScreen === true;
    }
    return this.props.stream !== props.stream;
  }
  componentDidUpdate() {
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
}

export default VideoHandler;
