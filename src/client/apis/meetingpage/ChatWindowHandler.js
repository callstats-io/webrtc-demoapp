import * as modCommon from '../csiortc/events/CsioEvents';
import ReactDOM from 'react-dom';

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
    const label = 'chat';
    const userId = 'Me';
    const message = this.state.inputText;
    this.setState({
      inputText: ''
    });
    modCommon.triggerEvent('channelMessage',
      {'label': label, 'userId': userId, 'message': message});
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
