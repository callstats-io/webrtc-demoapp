'use strict';
import nameGenerator from 'docker-names';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class ContentRightHandler {
  constructor() {
    this.mediaStream = null;
    this.userName = this.getUserName();
    this.audioMuted = false;
    this.videoMuted = false;
    this.screenShared = false;
    this.userNameInput = 'disabled';
  }
  getState() {
    return {
      mediaStream: this.mediaStream,
      userName: this.userName,
      audioMuted: this.audioMuted,
      videoMuted: this.videoMuted,
      screenShared: this.screenShared,
      userNameInput: this.userNameInput
    };
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    this.setState({
      media: media
    });
    // a hack to find right container height on runtime
    // when it first arrive
    if (this.rightContainer) {
      const curHeight = this.rightContainer.clientHeight;
      const detail = {
        height: curHeight,
        from: 'contentRightHandler'
      };
      setTimeout((e) => {
        TriggerEvent(
          CsioEvents.MEETING_PAGE.RESIZE_VIDEO_VIEW,
          detail);
      }, 200);
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
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE, detail);
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
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE, detail);
  }
  onScreenShareToggle(e) {
    e.preventDefault();
    const screenShared = !this.state.screenShared;
    const isFF = !!navigator.mozGetUserMedia;
    if (isFF) {
      // No extension is installed
      this.setState({
        screenShared: screenShared
      });
      const detail = {
        mediaType: 'screen',
        isEnable: screenShared
      };
      TriggerEvent(
        CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE, detail);
    } else {
      this.checkChromeExtInstalled().then(installed => {
        // screen share extension is installed, may be try to start screen share
        const screenShared = !this.state.screenShared;
        this.setState({
          screenShared: screenShared
        });
        // do need to enable screen share
        const detail = {
          mediaType: 'screen',
          isEnable: screenShared
        };
        TriggerEvent(
          CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE, detail);
      }, _ => {
        const detail = {
          required: true,
          downloadURL: __extension_download_url__
        };
        TriggerEvent(
          CsioEvents.CsioRTC.ON_EXTENTION_REQUIRED, detail);
      });
    }
  }
  onClickCloseButton(e) {
    e.preventDefault();
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_MEETING_CLOSE_CLICKED, {});
  }
  onResizeWindow(e) {
    if (this.rightContainer) {
      const curHeight = this.rightContainer.clientHeight;
      const detail = {
        height: curHeight,
        from: 'contentRightHandler'
      };
      TriggerEvent(
        CsioEvents.MEETING_PAGE.RESIZE_VIDEO_VIEW,
        detail);
    }
  }
  onToggleMediaState(e) {
    if (e.detail.mediaType === 'screen') {
      this.setState({
        screenShared: e.detail.isEnable
      });
    }
  }

  onClickUserName(e) {
    e.preventDefault();
    const nextUserInput = this.state.userNameInput === 'disabled' ? '' : 'disabled';
    if (nextUserInput === 'disabled') {
      this.saveUserName(this.state.userName);
    }
    this.setState({
      userNameInput: nextUserInput
    });
  }
  onKeyUp(e) {
    if (e.key === 'Enter') {
      this.setState({
        userNameInput: 'disabled'
      });
      this.saveUserName(this.state.userName);
    }
  }
  saveUserName(userName) {
    localStorage.setItem('userName', JSON.stringify(userName));
  }
  getUserName() {
    let userName = JSON.parse(localStorage.getItem('userName'));
    if (userName) {
      return userName;
    }
    userName = nameGenerator.getRandomName(); // some random name
    this.saveUserName(userName);
    return userName;
  }
  checkChromeExtInstalled() {
    const extensionid = __addon_id__; // getting from environment variable
    return new Promise((resolve, reject) => {
      if (typeof chrome === 'undefined' || !chrome || !chrome.runtime) {
        // No API, so no extension for sure
        reject(new Error('Extension not installed'));
        return;
      }
      chrome.runtime.sendMessage(
        extensionid,
        { getVersion: true },
        response => {
          if (!response || !response.version) {
            reject(new Error('Extension not installed'));
            return;
          }
          // Check installed extension version
          const extVersion = response.version;
          console.log(`Extension version is: ${extVersion}`);
          resolve(true);
        }
      );
    });
  }
}

export default ContentRightHandler;
