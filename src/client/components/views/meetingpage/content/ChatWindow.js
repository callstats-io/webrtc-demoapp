import React from 'react';
import ChatWindowHandler from '../../../handlers/meetingpage/ChatWindowHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.chatWindowHandler = new ChatWindowHandler();
    this.onSendClick = this.chatWindowHandler.onSendClick.bind(this);
    this.getUserName = this.chatWindowHandler.getUserName.bind(this);
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
        <div className="input-group">
          <input className="form-control" placeholder="Write something..."
            type="text"
            value={this.state.inputText}
            onChange={this.chatWindowHandler.onInputChange.bind(this)}
            onKeyUp={this.chatWindowHandler.onKeyUp.bind(this)}/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button"
              onClick={this.chatWindowHandler.onSendClick.bind(this)}>
              Send
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default ChatLayout;
