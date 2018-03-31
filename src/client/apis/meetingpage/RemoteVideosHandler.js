'use strict';
const triggerEvent = require('./../../apis/csiortc/events/CsioEvents').triggerEvent;
const CsioEvents = require('./../../apis/csiortc/events/CsioEvents').CsioEvents;
class RemoteVideosHandler {
  constructor() {
    this.remoteVideos = {};
    this.participantCount = 0;
  }
  getState() {
    return {
      remoteVideos: this.remoteVideos,
      participantCount: Object.keys(this.remoteVideos).length
    };
  }
  onRemoteVideos(e) {
    const media = e.detail.media;
    this.setState({
      remoteVideos: media,
      participantCount: Object.keys(media || {}).length
    });
    // may be we want to change video focus
    const keys = Object.keys(media || {});
    const detail = {
      userId: keys.length > 0 ? keys[0] : 'local',
      from: 'onRemoteVideos'
    };
    triggerEvent(
      CsioEvents.UIEvent.VIDEO_FOCUS_CHANGE,
      detail);
  }
}

export default RemoteVideosHandler;
