'use strict';
import CsioRTC from './csiortc/CsioRTC';
import { CsioEvents } from '../events/CsioEvents';
import CsioStats from './csiortc/csiostats/CsioStats';

class CsioRTCClient {
  constructor() {
    // script to detect if screen share extension is installed
    this.detectScreenShareExtenstion();
    this.isInitialized = false;
    this.csiortc = new CsioRTC();
    this.csiostats = new CsioStats(this.csiortc.signaling);
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
    document.addEventListener(CsioEvents.CSIOSignaling.ON_LEAVE,
      this.onUserLeave.bind(this), false);
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE,
      this.onToggleMediaState.bind(this), false);
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_MEETING_CLOSE_CLICKED,
      this.onMeetingPageClosed.bind(this), false);
  }

  // on connect with socket io
  onConnect(e) {
    const userId = e.detail.userId;
    const userName = this.getUserName();
    const userID = {
      'userName': userName.length > 0 ? userName : userId,
      'aliasName': userId
    };
    console.log('onConnect', userID);
    this.csiostats.initialize(userID);
  }
  onInitializeCsio(e) {
    const config = e.detail.config;
    this.csiortc.config = config;
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
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
  onUserLeave(e) {
    const userId = e.detail.userId;
    this.csiortc.mayBeDisposePC(userId);
  }
  onToggleMediaState(e) {
    const isEnable = e.detail.isEnable;
    const mediaType = e.detail.mediaType;
    this.csiortc.toggleMediaStates(isEnable, mediaType);
  }
  onMeetingPageClosed(e) {
    if (this.csiortc) {
      this.csiortc.dispose();
    }
  }
  getUserName() {
    let userName = JSON.parse(localStorage.getItem('userName'));
    if (userName) {
      return userName;
    }
    return '';
  }
  detectScreenShareExtenstion() {
    const updateExtensionDetail = (isInstalled) => {
      localStorage.setItem('csioExtension', JSON.stringify(isInstalled));
    };
    const extensionURL = `chrome-extension://${__addon_id__}/logo_48_48.png`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', extensionURL, true);
    xhr.onload = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          updateExtensionDetail(true);
        } else {
          updateExtensionDetail(false);
        }
      }
    };
    xhr.onerror = function(e) {
      updateExtensionDetail(false);
    };
    xhr.send(null);
  }
}

export let RTCClient = new CsioRTCClient();
