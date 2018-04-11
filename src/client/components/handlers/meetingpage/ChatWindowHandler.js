'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class ChatWindowHandler {
  constructor() {
    this.inputText = '';
    this.chatText = '';
    this.chatMessages = [];
  }

  maybeUpdateResizeWindow() {
    setTimeout(function() {
      const fixedHeight = this.state.windowHeight +
        (window.innerHeight - document.getElementById('principle-dom').offsetHeight);
      // console.warn('doing a resize ', this.state.windowHeight, fixedHeight);
      this.setState({
        windowHeight: fixedHeight
      });
    }.bind(this), 1 * 1000);
  }
  getState() {
    return {
      inputText: this.inputText,
      chatMessages: this.chatMessages,
      chatText: this.chatText,
      windowHeight: 360
    };
  }
  onInputChange(e) {
    const inputText = e.target.value;
    this.setState({
      inputText: inputText
    });
  }
  onKeyUp(e) {
    if (e.key === 'Enter') {
      this.onSendClick();
    }
  }
  onSendClick() {
    const message = this.state.inputText;
    this.setState({
      inputText: ''
    });
    const aliseName = this.getUserName();
    const detail = {
      label: 'chat',
      userId: 'Me',
      message: JSON.stringify({
        message: message,
        aliseName: aliseName || ''
      })
    };
    if (message && message.length > 0) {
      TriggerEvent(CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE, detail);
      TriggerEvent(CsioEvents.CsioPeerConnection.SEND_CHANNEL_MESSAGE, detail);
    }
  }
  onChannelMessage(e) {
    let userId = e.detail.userId;
    const label = e.detail.label;
    const channelMessage = JSON.parse(e.detail.message);
    const message = channelMessage.message;
    const aliseName = channelMessage.aliseName;
    if (aliseName && aliseName.length > 0) {
      userId = aliseName;
    }
    if (label === 'chat') {
      let temp = this.state.chatMessages;
      const chatText = this.state.chatText;
      temp.push({user: userId, message: message});
      const temp2 = `${chatText} \n ${userId} : ${message}`;
      this.setState({
        chatMessages: temp,
        chatText: temp2
      });
    }
    setTimeout(function() {
      if (this.messageContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    }.bind(this), 200);
  }
  getUserName() {
    let userName = JSON.parse(localStorage.getItem('userName'));
    if (userName) {
      return userName;
    }
    return '';
  }
}
export default ChatWindowHandler;
