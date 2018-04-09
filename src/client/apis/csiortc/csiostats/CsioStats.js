'use strict';

import CsioConfigParams from '../../utils/Common';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioStats {
  constructor(signaling) {
    this.isInitialized = false;
    this.signaling = signaling;
    this.config = {};
    this.roomName = undefined;
    this.cachedUserId = undefined;
    this.csObject = new callstats();
    this.csObject.on('defaultConfig', this.defaultConfigCallback.bind(this));
    this.csObject.on('recommendedConfig', this.recommendedConfigCallback.bind(this));
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      this.onMeetingPageLoaded.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_PEERCONNECTION_CREATED,
      this.onPeerconnectionCreated.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_PEERCONNECTION_CLOSED,
      this.onPeerconnectionClosed.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_WEBRTC_ERROR,
      this.handleWebrtcError.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_REMOTE_STREAM,
      this.onRemoteStream.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioRTC.ON_TOGGLE_MEDIA_STATE,
      this.onToggleMediaState.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_APPLICATION_LOG,
      this.onApplicationLog.bind(this), false);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_FEEDBACK_PROVIDED,
      this.onFeedbackProvided.bind(this), false);
  }
  onMeetingPageLoaded(e) {
    this.roomName = e.detail.roomName;
  }
  onPeerconnectionCreated(e) {
    const roomName = this.roomName;
    const pcObject = e.detail.pc;
    const remoteUserID = e.detail.userId;
    const usage = this.csObject.fabricUsage.multiplex;
    this.csObject.addNewFabric(pcObject, remoteUserID, usage,
      roomName, this.pcCallback);
  }
  pcCallback(err, msg) {
    console.log(`Monitoring status: '${err} msg: ${msg}`);
  }
  onPeerconnectionClosed(e) {
    const roomName = this.roomName;
    const pcObject = e.detail.pc;
    const fabricEvent = this.csObject.fabricEvent.fabricTerminated;
    console.log({pcObject, fabricEvent, roomName});
    this.csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
  }
  createTokenGeneratorTimer(userId, forcenew, callback) {
    return setTimeout(
      function() {
        console.log('calling tokenGenerator');
        this.tokenGenerator(userId, forcenew, callback).bind(this);
      }.bind(this),
      100);
  };
  tokenGenerator(userId, forcenew, callback) {
    this.signaling.generateToken(userId, function(err, token) {
      if (err) {
        console.log('Token generation failed: try again');
        return this.createTokenGeneratorTimer(forcenew, callback).bind(this);
      }
      console.log('Received Token');
      callback(null, token);
    }.bind(this));
  };
  initialize(userID) {
    if (this.isInitialized) {
      return;
    }
    this.cachedUserId = userID.aliasName;
    if (__jwtenabled__ === 'true') {
      this.csObject.initialize(
        __appid__,
        this.tokenGenerator.bind(this),
        userID,
        this.csInitCallback.bind(this),
        this.csStatsCallback.bind(this),
        CsioConfigParams);
    } else {
      this.csObject.initialize(
        __appid__,
        __appsecret__,
        userID,
        this.csInitCallback.bind(this),
        this.csStatsCallback.bind(this),
        CsioConfigParams);
    }
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
  onRemoteStream(e) {
    const roomName = this.roomName;
    const pc = e.detail.pc;
    const remoteUserId = e.detail.userId;

    // associate SSRCs
    var ssrcs = [];
    var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
    var reg = /^ssrc:(\d*) ([\w_]*):(.*)/;
    pc.remoteDescription.sdp.split(/(\r\n|\r|\n)/).filter(validLine)
      .forEach(function(l) {
        var type = l[0];
        var content = l.slice(2);
        if (type === 'a') {
          if (reg.test(content)) {
            var match = content.match(reg);
            if (!(ssrcs.includes(match[1]))) {
              ssrcs.push(match[1]);
            }
          }
        }
      });
    for (const ssrc in ssrcs) {
      this.csObject.associateMstWithUserID(pc, remoteUserId, roomName, ssrcs[ssrc],
        'camera', /* video element id */remoteUserId);
    }
  }
  onToggleMediaState(e) {
    const roomName = this.roomName;
    const pcObject = e.detail.pc;
    const type = e.detail.type;
    let fabricEvent;
    switch (type) {
      case 'audioMuted':
        fabricEvent = this.csObject.fabricEvent.audioMute;
        break;
      case 'audioUnmuted':
        fabricEvent = this.csObject.fabricEvent.audioUnmute;
        break;
      case 'videoPaused':
        fabricEvent = this.csObject.fabricEvent.videoPause;
        break;
      case 'videoResumed':
        fabricEvent = this.csObject.fabricEvent.videoResume;
        break;
      case 'screenShareEnabled':
        fabricEvent = this.csObject.fabricEvent.screenShareStart;
        break;
      case 'screenShareDisabled':
        fabricEvent = this.csObject.fabricEvent.screenShareStop;
        break;
      default:
        console.log('Error', type, 'not handled!');
        return;
    }
    this.csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
  }
  onApplicationLog(e) {
    const roomName = this.roomName;

    const pcObject = e.detail.pc;
    const applicationLog = e.detail.eventLog;
    const csioType = this.csObject.webRTCFunctions.applicationLog;
    this.csObject.reportError(pcObject, roomName, csioType, applicationLog);
  }
  onFeedbackProvided(e) {
    const roomName = this.roomName;
    const userId = this.cachedUserId;
    const userFeedback = e.detail.feedback;
    const feedback = {
      userID: userId,
      overall: userFeedback.meetingFeedback,
      audio: userFeedback.audioFeedback,
      video: userFeedback.videoFeedback,
      screen: userFeedback.screenshareFeedback,
      comment: userFeedback.commentFeedback
    };
    this.csObject.sendUserFeedback(roomName, feedback, this.pcCallback);
  }
}

export default CsioStats;
