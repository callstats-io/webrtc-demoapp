'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class ContentLeftHandler {
  constructor() {
    this.mediaStream = null;
  }
  getState() {
    return {
      mediaStream: this.mediaStream
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    this.setState({
      media: media
    });
  }
  onResizeWindow(e) {
    if (this.videoContainer) {
      const curWidth = this.videoContainer.clientWidth;
      const curHeight = this.videoContainer.clientHeight;
      const detail = {
        width: curWidth,
        height: curHeight,
        from: 'contentLeftHandler'
      };
      TriggerEvent(
        CsioEvents.MEETING_PAGE.RESIZE_VIDEO_VIEW,
        detail);
    }
  }
}

export default ContentLeftHandler;
