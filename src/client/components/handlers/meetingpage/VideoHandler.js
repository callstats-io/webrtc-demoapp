'use strict';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class VideoHandler {
  constructor(name) {
    this.name = name;
    this.muted = false;
    if (name === 'local') {
      this.muted = true;
    }
  }
  getState() {
    return {};
  }
  componentDidMount() {
    this.video.srcObject = this.props.stream;
  }
  shouldComponentUpdate(props) {
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
