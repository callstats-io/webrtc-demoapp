import React from 'react';
import ChatWindowHandler from '../../../handlers/meetingpage/ChatWindowHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.chatWindowHandler = new ChatWindowHandler();
    this.state = this.chatWindowHandler.getState();
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE,
      this.chatWindowHandler.onChannelMessage.bind(this), false);
  }

  render() {
    var left = '0px';
    if (this.props.show) {
      left = '-300px';
    }
    const slideoutTextarea = {
      display: 'block',
      minHeight: '300px',
      maxHeight: '400px',
      marginBottom: '6px'
    };
    return (
      <div className="row-fluid"
        style={{transform: 'translateX(' + left + ')'}}>
        <textarea id='chatBox' className="form-control" readOnly='true'
          style={slideoutTextarea}
          value={this.state.chatText}
          ref={(el) => { this.messagesContainer = el; } }/>
        <div>
          <input id="chatInput" style={{width: '80%'}} type="text"
            value={this.state.inputText}
            onChange={this.chatWindowHandler.onInputChange.bind(this)}/>
          <button id="chatButton"
            onClick={this.chatWindowHandler.onSendClick.bind(this)}>Send</button>
        </div>
      </div>
    );
  }
}

export default ChatLayout;
