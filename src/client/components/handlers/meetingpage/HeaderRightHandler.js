'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class HeaderRightHandler {
  getState() {
    return {};
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
  onClickCloseButton(e) {
    e.preventDefault();
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_MEETING_CLOSE_CLICKED, {});
  }
}

export default HeaderRightHandler;
