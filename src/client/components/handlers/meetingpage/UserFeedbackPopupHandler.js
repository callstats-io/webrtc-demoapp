'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class UserFeedbackPopupHandler {
  constructor() {
    this.showModal = 'none'; // none or block
    this.meetingRoomURL = ''; // none or block
    this.meetingFeedback = 5;
    this.audioFeedback = 5;
    this.videoFeedback = 5;
    this.screenshareFeedback = 5;
  }
  getState() {
    return {
      showModal: this.showModal,
      meetingFeedback: this.meetingFeedback,
      audioFeedback: this.audioFeedback,
      videoFeedback: this.videoFeedback,
      screenshareFeedback: this.screenshareFeedback
    };
  }
  onMeetingPageClosed(e) {
    this.setState({
      showModal: 'block'
    });
  }
  handleCloseModal(e) {
    const userExperienceFeedback = {
      'meetingFeedback': this.state.meetingFeedback,
      'audioFeedback': this.state.audioFeedback,
      'videoFeedback': this.state.videoFeedback,
      'screenshareFeedback': this.state.screenshareFeedback
    };
    const detail = {
      feedback: userExperienceFeedback
    };
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_FEEDBACK_PROVIDED, detail);
    setTimeout((e) => {
      window.location.href = location.origin;
    }, 1 * 1000);
    this.setState({
      showModal: 'none'
    });
  }
  onUpdateMeetingFeedback(e) {
    this.setState({
      meetingFeedback: e.target.value
    });
  }
  onUpdateAudioFeedback(e) {
    this.setState({
      audioFeedback: e.target.value
    });
  }
  onUpdateVideoFeedback(e) {
    this.setState({
      videoFeedback: e.target.value
    });
  }
  onUpdateScreenShareFeedback(e) {
    this.setState({
      screenshareFeedback: e.target.value
    });
  }
}

export default UserFeedbackPopupHandler;
