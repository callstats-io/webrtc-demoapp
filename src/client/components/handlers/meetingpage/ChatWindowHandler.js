'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class ChatWindowHandler {
  constructor() {
    this.inputText = '';
    this.chatText = '';
    this.chatMessages = [];
  }

  getState() {
    return {
      inputText: this.inputText,
      chatMessages: this.chatMessages,
      chatText: this.chatText
    };
  }
  onInputChange(e) {
    const inputText = e.target.value;
    this.setState({
      inputText: inputText
    });
  }
  onSendClick() {
    const message = this.state.inputText;
    this.setState({
      inputText: ''
    });
    const detail = {
      label: 'chat',
      userId: 'Me',
      message: message
    };
    TriggerEvent(CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE, detail);
    TriggerEvent(CsioEvents.CsioPeerConnection.SEND_CHANNEL_MESSAGE, detail);
  }
  onChannelMessage(e) {
    const label = e.detail.label;
    const userId = e.detail.userId;
    const message = e.detail.message;
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
}
export default ChatWindowHandler;
