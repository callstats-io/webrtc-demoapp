'use strict';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

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
      userId: keys.length > 0 ? keys[0] : 'local'
    };
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.ON_VIDEO_FOCUS_CHANGE, detail);
  }
}

export default RemoteVideosHandler;
