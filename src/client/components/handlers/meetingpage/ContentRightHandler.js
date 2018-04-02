'use strict';
import {CsioEvents, triggerEvent} from '../csiortc/events/CsioEvents';

const nameGenerator = require('docker-names');
class ContentRightHandler {
  constructor() {
    this.mediaStream = null;
    this.userName = nameGenerator.getRandomName(); // some random name
    this.audioMuted = false;
    this.videoMuted = false;
    this.screenShared = false;
  }
  getState() {
    return {
      mediaStream: this.mediaStream,
      userName: this.userName,
      audioMuted: this.audioMuted,
      videoMuted: this.videoMuted,
      screenShared: this.screenShared
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    const from = e.detail.from;
    if (from === 'getUserMedia') {
      this.setState({
        media: media
      });
    }
  }
  handleInputChange(e) {
    const userName = e.target.value;
    this.setState({
      userName: userName
    });
  }
  onAudioToggle(e) {
    e.preventDefault();
    const audioMuted = !this.state.audioMuted;
    this.setState({
      audioMuted: audioMuted
    });
    const detail = {
      mediaType: 'audio',
      isEnable: !audioMuted
    };
    console.log(detail);
    triggerEvent(
      CsioEvents.UIEvent.TOGGLE_MEDIA_STATE,
      detail);
  }
  onVideoToggle(e) {
    e.preventDefault();
    const videoMuted = !this.state.videoMuted;
    this.setState({
      videoMuted: videoMuted
    });
    const detail = {
      mediaType: 'video',
      isEnable: !videoMuted
    };
    triggerEvent(
      CsioEvents.UIEvent.TOGGLE_MEDIA_STATE,
      detail);
  }
  onScreenShareToggle(e) {
    e.preventDefault();
    const screenShared = !this.state.screenShared;
    this.setState({
      screenShared: screenShared
    });
    const detail = {
      mediaType: 'screen',
      isEnable: screenShared
    };
    triggerEvent(
      CsioEvents.UIEvent.TOGGLE_MEDIA_STATE,
      detail);
  }
}

export default ContentRightHandler;
