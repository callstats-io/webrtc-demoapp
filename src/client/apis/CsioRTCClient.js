'use strict';
import CsioRTC from './csiortc/CsioRTC';
import {CsioEvents} from '../events/CsioEvents';
import CsioStats from './csiortc/csiostats/CsioStats';

class CsioRTCClient {
  constructor() {
    this.csiortc = new CsioRTC();
    this.csiostats = new CsioStats();
    // event listeners
    document.addEventListener(CsioEvents.CSIOSignaling.ON_CONNECT,
      this.onConnect.bind(this), false);
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      this.onMeetingPageLoaded.bind(this), false);
  }

  // on connect with socket io
  onConnect(e) {
    const userId = e.detail.userId;
    const userID = {
      'userName': userId,
      'aliasName': userId
    };
    console.log('onConnect', userID);
    this.csiostats.initialize(userID);
  }
  // global events
  onMeetingPageLoaded(e) {
    const roomName = e.detail.roomName;
    console.log('onMeetingPageLoaded', roomName);
  }
}

export let RTCClient = new CsioRTCClient();
