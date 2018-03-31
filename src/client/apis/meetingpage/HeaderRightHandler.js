'use strict';

import {CsioEvents, triggerEvent} from '../csiortc/events/CsioEvents';

class HeaderRightHandler {
  getState() {
    return {};
  }
  onClickShareButton(e) {
    e.preventDefault();
    const meetingRoomURL = window.location.href;
    const detail = {
      meetingRoomURL: meetingRoomURL,
      from: 'onClickShareButton'
    };
    triggerEvent(
      CsioEvents.UIEvent.SHARE_MEETING_LINK,
      detail);
  }
  onClickCloseButton(e) {
    e.preventDefault();
    triggerEvent(
      CsioEvents.UIEvent.CLOSE_MEETING,
      {});
    window.location.href = location.origin;
  }
}

export default HeaderRightHandler;
