'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class HeaderRightHandler {
  constructor() {
    this.showStat = 'none';
    this.precallStats = {};
  }
  getState() {
    return {
      showStat: this.showStat
    };
  }
  onClickShareButton(e) {
    e.preventDefault();
    const meetingRoomURL = window.location.href;
    const detail = {
      meetingRoomURL: meetingRoomURL
    };
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_SHARE_MEETING_LINK, detail);
  }
  onStatAvailable(e) {
    this.precallStats = e.detail.precallStats || {};
    setTimeout(function() {
      this.setState({
        showStat: 'block'
      });
    }.bind(this), 200);
  }
  mayBeShowStat(e) {
    e.preventDefault();
    const detail = {
      precallStats: this.precallStats
    };
    TriggerEvent(
      CsioEvents.CsioStats.SHOW_PRECALLTEST_RESULT, detail);
  }
}

export default HeaderRightHandler;
