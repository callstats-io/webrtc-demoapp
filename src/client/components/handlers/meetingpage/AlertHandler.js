'use strict';

import { CsioEvents, TriggerEvent } from '../../../events/CsioEvents';

class AlertHandler {
  constructor() {
    this.display = 'none';
    this.text = '';
    this.alertType = 'alert-success';
    this.fadein = 'in';
    this.alartSuccess = 'alert-success';
    this.alertInfo = 'alert-info';
    this.alertWarning = 'alert-warning';
    this.alertDanger = 'alert-danger';
    this.extensionDisplay = 'none';
    this.extensionDownloadURL = '';
  }
  getState(roomName) {
    return {
      alertType: this.alertType,
      text: this.text,
      display: this.display,
      fadein: this.fadein,
      extensionDisplay: this.extensionDisplay,
      extensionDownloadURL: this.extensionDownloadURL,
      roomName: roomName
    };
  }
  showAlart(alertType, text) {
    this.setState({
      alertType: alertType,
      text: text,
      display: 'block',
      fadein: 'in'
    });

    setTimeout(function() {
      this.setState({
        fadein: 'fade'
      });
      setTimeout(function() {
        this.setState({
          display: 'none'
        });
      }.bind(this), 500);
    }.bind(this), 1000);
  }
  onNewUserJoined(e) {
    const userId = e.detail.userId;
    const text = `${userId} joined the meeting`;
    const roomName = this.state.roomName;
    const detail = {
      label: 'chat',
      userId: 'Me',
      message: JSON.stringify({
        message: text,
        aliseName: roomName || '',
        event: 'alert'
      })
    };
    this.broadcastAlart(detail);
  }
  onUserLeave(e) {
    const userId = e.detail.userId;
    const text = `${userId} left the meeting`;
    const roomName = this.state.roomName;
    const detail = {
      label: 'chat',
      userId: 'Me',
      message: JSON.stringify({
        message: text,
        aliseName: roomName || '',
        event: 'alert'
      })
    };
    this.broadcastAlart(detail);
  }
  onToggleMediaState(e) {
    const isEnable = e.detail.isEnable;
    const mediaType = e.detail.mediaType;
    const aliseName = this.getUserName();
    const roomName = this.state.roomName;
    let text = '';
    if (mediaType === 'audio') {
      text = `${aliseName} ${isEnable ? 'unmuted' : 'muted'} ${mediaType}`;
    } else if (mediaType === 'video') {
      text = `${aliseName} ${isEnable ? 'resumed' : 'paused'} ${mediaType}`;
    } else if (mediaType === 'screen') {
      text = `${aliseName} ${isEnable ? 'started' : 'stopped'} ${mediaType}ing`;
    }
    const detail = {
      label: 'chat',
      userId: 'Me',
      message: JSON.stringify({
        message: text,
        aliseName: roomName || '',
        event: 'alert'
      })
    };
    this.broadcastAlart(detail);
  }
  onMayBeDownloadExtention(e) {
    const required = e.detail.required;
    const downloadURL = e.detail.downloadURL;
    this.setState({
      extensionDownloadURL: downloadURL,
      extensionDisplay: required ? 'block' : 'none'
    });
  }
  onClickExtensionDownloadLink(e) {
    this.setState({
      extensionDisplay: 'none'
    });
  }
  broadcastAlart(detail) {
    TriggerEvent(CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE, detail);
    TriggerEvent(CsioEvents.CsioPeerConnection.SEND_CHANNEL_MESSAGE, detail);
  }
  getUserName() {
    let userName = JSON.parse(localStorage.getItem('userName'));
    if (userName) {
      return userName;
    }
    return '';
  }
}
export default AlertHandler;
