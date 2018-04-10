'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class UserFeedbackPopupHandler {
  constructor() {
    this.showModal = 'none'; // none or block
    this.meetingFeedback = this.parseRating(5);
    this.audioFeedback = this.parseRating(5);
    this.videoFeedback = this.parseRating(5);
    this.screenshareFeedback = this.parseRating(5);
    this.comments = '';
  }
  getState() {
    return {
      showModal: this.showModal,
      meetingFeedback: this.meetingFeedback,
      audioFeedback: this.audioFeedback,
      videoFeedback: this.videoFeedback,
      screenshareFeedback: this.screenshareFeedback,
      comments: this.comments
    };
  }
  onMeetingPageClosed(e) {
    this.setState({
      showModal: 'block'
    });
  }
  handleCloseModal(e) {
    const userExperienceFeedback = {
      'meetingFeedback': this.countRating(this.state.meetingFeedback),
      'audioFeedback': this.countRating(this.state.audioFeedback),
      'videoFeedback': this.countRating(this.state.videoFeedback),
      'screenshareFeedback': this.countRating(this.state.screenshareFeedback),
      'commentFeedback': this.state.comments
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
  parseRating(val) {
    const upto = parseInt(val);
    let ratingUI = {
      1: 'glyphicon glyphicon-star-empty',
      2: 'glyphicon glyphicon-star-empty',
      3: 'glyphicon glyphicon-star-empty',
      4: 'glyphicon glyphicon-star-empty',
      5: 'glyphicon glyphicon-star-empty'};
    for (let i = 1; i <= upto; i += 1) {
      ratingUI[i] = 'glyphicon glyphicon-star';
    }
    return ratingUI;
  }
  countRating(ratings) {
    let cnt = 0;
    for (let i = 1; i <= 5; i += 1) {
      cnt += (ratings[i] === 'glyphicon glyphicon-star' ? 1 : 0);
    }
    return cnt;
  }
  onUpdateMeetingFeedback(v, e) {
    e.preventDefault();
    this.setState({
      meetingFeedback: this.parseRating(v)
    });
  }
  onUpdateAudioFeedback(v, e) {
    e.preventDefault();
    this.setState({
      audioFeedback: this.parseRating(v)
    });
  }
  onUpdateVideoFeedback(v, e) {
    e.preventDefault();
    this.setState({
      videoFeedback: this.parseRating(v)
    });
  }
  onUpdateScreenShareFeedback(v, e) {
    e.preventDefault();
    this.setState({
      screenshareFeedback: this.parseRating(v)
    });
  }
  handleInputChange(e) {
    this.setState({
      comments: e.target.value
    });
  }
}

export default UserFeedbackPopupHandler;
