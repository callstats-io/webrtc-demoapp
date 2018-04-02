'use strict';
import CsioRTC from './csiortc/CsioRTC';
import {CsioEvents} from '../events/CsioEvents';

class CsioRTCClient {
  constructor() {
    this.csiortc = new CsioRTC();
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      this.onMeetingPageLoaded, false);
  }

  // global events
  onMeetingPageLoaded(e) {
    const roomName = e.detail.roomName;
    console.log(roomName);
  }
}

export let RTCClient = new CsioRTCClient();
