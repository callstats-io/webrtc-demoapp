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
    const extensionInstalled = this.isExtensionInstalled();
    const isFF = !!navigator.mozGetUserMedia;
    if (extensionInstalled === false && !isFF) {
      // No extension is installed
      const detail = {
        required: true,
        downloadURL: __extension_download_url__
      };
      TriggerEvent(
        CsioEvents.CsioRTC.ON_EXTENTION_REQUIRED, detail);
    } else {
      const screenShared = !this.state.screenShared;
      this.setState({
        screenShared: screenShared
      });
      const detail = {
        mediaType: 'screen',
        isEnable: screenShared
      };
      TriggerEvent(
        CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE, detail);
    }
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
  isExtensionInstalled() {
    const checkScreenShareDetails = _ => {
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
    };
    checkScreenShareDetails();
    const isExtensionInstalled = JSON.parse(localStorage.getItem('csioExtension'));
    return isExtensionInstalled;
  }
}

export default ContentRightHandler;
