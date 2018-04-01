import React from 'react';
class ChatLayout extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: ''
    };
  }
  onInputChange() {}
  onSendClick() {}
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
        <textarea className="form-control" readOnly='true'
          style={slideoutTextarea}
          value={this.props.chatText}/>
        <div>
          <input id="chatInput" style={{width: '80%'}} type="text"
            value={this.state.inputText}
            onChange={this.onInputChange.bind(this)}/>
          <button id="chatButton"
            onClick={this.onSendClick.bind(this)}>Send</button>
        </div>
      </div>
    );
  }

  onInputChange(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  onSendClick() {
    var msg = this.state.inputText;
    this.props.onNewMessage(msg);
    this.setState({
      inputText: ''
    });
  }
}

export default ChatLayout;
