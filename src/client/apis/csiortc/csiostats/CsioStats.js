'use strict';

import CsioConfigParams from '../../utils/Common';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioStats {
  constructor() {
    this.isInitialized = false;
    this.config = {};
    this.roomName = undefined;
    this.csObject = new callstats();
    this.csObject.on('defaultConfig', this.defaultConfigCallback.bind(this));
    this.csObject.on('recommendedConfig', this.recommendedConfigCallback.bind(this));
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      this.onMeetingPageLoaded.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_WEBRTC_ERROR,
      this.handleWebrtcError.bind(this), false);
  }
  onMeetingPageLoaded(e) {
    this.roomName = e.detail.roomName;
  }
  initialize(userID) {
    if (this.isInitialized) {
      return;
    }
    this.csObject.initialize(
      __appid__,
      __appsecret__,
      userID,
      this.csInitCallback.bind(this),
      this.csStatsCallback.bind(this),
      CsioConfigParams);
  }
  // csio related events, and function
  // CSIO object callback
  defaultConfigCallback(config) {
    console.log('ConfigService, default config:', config);
    this.config = {...this.config, ...config};
  }
  recommendedConfigCallback(config) {
    console.log('ConfigService, recommended config:', config);
    this.config = {...this.config, ...config};
    const detail = {
      config: this.config
    };
    TriggerEvent(CsioEvents.CsioStats.ON_INITIALIZED, detail);
  }
  csInitCallback(csError, csErrMsg) {
    console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
    if (csError !== 'success') {
      TriggerEvent(CsioEvents.CsioStats.ON_DISCONNECTED, {});
    }
  }
  csStatsCallback(stats) {
    console.log('stats callback');
  };
  // handle webrtc errors
  handleWebrtcError(e) {
    const roomName = this.roomName;
    const pcObject = e.detail.pc;
    const err = e.detail.error;
    const type = e.detail.type;
    let csioType;
    switch (type) {
      case 'createOffer':
        csioType = this.csObject.webRTCFunctions.createOffer;
        break;
      case 'createAnswer':
        csioType = this.csObject.webRTCFunctions.createAnswer;
        break;
      case 'setLocalDescription':
        csioType = this.csObject.webRTCFunctions.setLocalDescription;
        break;
      case 'setRemoteDescription':
        csioType = this.csObject.webRTCFunctions.setRemoteDescription;
        break;
      case 'addIceCandidate':
        csioType = this.csObject.webRTCFunctions.addIceCandidate;
        break;
      case 'getUserMedia':
        csioType = this.csObject.webRTCFunctions.getUserMedia;
        break;
      default:
        console.log('Error', type, 'not handled!');
        return;
    }
    this.csObject.reportError(pcObject, roomName, csioType, err);
  }
}

export default CsioStats;
