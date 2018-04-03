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
    document.addEventListener(CsioEvents.CsioStats.ON_INITIALIZED,
      this.onInitializeCsio.bind(this), false);
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      this.onMeetingPageLoaded.bind(this), false);
    document.addEventListener(CsioEvents.CSIOSignaling.ON_JOIN,
      this.onNewUserJoined.bind(this), false);
    document.addEventListener(CsioEvents.CSIOSignaling.ON_MESSAGE,
      this.onUserMessage.bind(this), false);
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
  onInitializeCsio(e) {
    const config = e.detail.config;
    this.csiortc.config = config;
    this.csiortc.mayBeInitializeRTC();
  }
  // global events
  onMeetingPageLoaded(e) {
    const roomName = e.detail.roomName;
    this.csiortc.roomName = roomName;
    this.csiortc.mayBeInitializeRTC();
  }
  onNewUserJoined(e) {
    const userId = e.detail.userId;
    console.log('onUserJoined', userId);
    this.csiortc.doOffer(userId);
  }
  onUserMessage(e) {
    const userId = e.detail.userId;
    const json = JSON.parse(e.detail.message);
    if (json.ice) {
      this.csiortc.addIceCandidates(userId, json.ice);
    } else if (json.offer) {
      this.csiortc.doAnswer(userId, json.offer);
    }
  }
}

export let RTCClient = new CsioRTCClient();
