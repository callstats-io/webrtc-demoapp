'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class FFScreenShareHandler {
  constructor() {
    this.roomName = '';
    this.showModal = 'none'; // none or block
    this.FFOption = '';
  }
  getState() {
    return {
      roomName: this.roomName,
      showModal: this.showModal,
      FFOption: this.FFOption
    };
  }
  onScreenSelected(e) {
    this.setState({
      showModal: 'none'
    });
    const detail = {
      mediaSource: 'screen',
      from: 'ffScreenShare'
    };
    TriggerEvent(
      CsioEvents.FFScreenShare.ON_SCREEN_SHARE_OPTION_SELECTED, detail);
  }
  onApplicationSelected(e) {
    this.setState({
      showModal: 'none'
    });
    const detail = {
      mediaSource: 'application',
      from: 'ffScreenShare'
    };
    TriggerEvent(
      CsioEvents.FFScreenShare.ON_SCREEN_SHARE_OPTION_SELECTED, detail);
  }
  onRequestScreenShare(e) {
    this.setState({
      showModal: 'block'
    });
  }
}

export default FFScreenShareHandler;
