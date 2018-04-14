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
    // may be do a resize
    this.chatWindowHandler.maybeUpdateResizeWindow.apply(this);
    window.addEventListener('resize',
      this.chatWindowHandler.onResizeWindow.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE,
      this.chatWindowHandler.onChannelMessage.bind(this), false);
  }

  render() {
    var left = '0px';
    if (this.props.show) {
      left = '-300px';
    }
    const customStyle = {
      backgroundColor: '#7C54B6',
      color: '#FFFFFF',
      height: '35px',
      paddingTop: '7px',
      paddingLeft: '10px'
    };
    return (
      <div>
        <div className='row-fluid' style={customStyle}>
          <p> <strong> Group chat </strong> </p>
        </div>
        <div className="row-fluid"
          style={{transform: 'translateX(' + left + ')'}}>
          <textarea id='chatBox' className="form-control" readOnly='true'
            style={{
              display: 'block',
              minHeight: `${this.state.windowHeight}px`,
              backgroundColor: '#FFFFFF'
            }}
            value={this.state.chatText}
            ref={(el) => { this.messagesContainer = el; } }/>
          <div className="input-group">
            <input className="form-control" placeholder="Send a message"
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
      </div>
    );
  }
}

export default ChatLayout;
