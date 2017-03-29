/*
 * Sequence of initialization:
 *  show popup for room name
 *  popup OK -> init CsioWebrtcApp
 *  CsioWebrtcApp emit localName -> init callstats
 *  callstats callback csInitCallback -> initLocalMedia
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var roomName = '';

function Video(props) {
  var muted = false;
  if (props.name === 'local') {
    muted = true;
  }

  // TODO hopefully this supports srcObject soon ..
  // https://github.com/facebook/react/pull/9146
  return (
    <video id={props.name} width="320" height="240"
        style={{transform: 'scaleX(-1)'}}
        autoPlay='true' muted={muted}
        src={props.stream}>
    </video>
  );
}
Video.propTypes = {
  name: React.PropTypes.string,
  stream: React.PropTypes.string,
};

class Popup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: roomName,
    };
  }
  updateInputText(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  closeModal() {
    var temp = this.state.inputText;
    if (temp !== '') {
      console.log('room:', temp);
      roomName = temp;
      this.props.onRoomSet();
    }
  }
  render() {
    return (
      <div id="popup" className="modal" style={{display: this.props.show}}>
        <div className="modal-content">
          Room: <input id="roomInput" type="text"
                  value={this.state.inputText}
                  onChange={this.updateInputText.bind(this)}/>
          <button id="popupCloseButton"
            onClick={this.closeModal.bind(this)}>OK</button>
        </div>
      </div>
    );
  }
}
Popup.propTypes = {
  onRoomSet: React.PropTypes.func,
  show: React.PropTypes.string,
};

class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: '',
    };
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
  render() {
    var left = '0px';
    if (this.props.show) {
      left = '-300px';
    }
    return (
      <div id="slideout"
          style={{transform: 'translateX('+left+')'}}>
        <textarea className="form-control" readOnly='true'
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
}
Chat.propTypes = {
  onNewMessage: React.PropTypes.func,
  show: React.PropTypes.bool,
};

class Display extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showChat: false,
      showPopup: 'block',
      messagesCount: 0,
      enableCall: false,
      enableHangup: false,
      enableChat: false,
      remoteVideos: {},
      chatMessages: [],
      chatText: '',
    };

    document.addEventListener('addRemoteVideo',
        function(e) {
          var stream = e.detail.stream;
          var remoteUserId = e.detail.userId;

          var temp = this.state.remoteVideos;
          temp[remoteUserId] = window.URL.createObjectURL(stream);
          this.setState({
            remoteVideos: temp,
          });
        }.bind(this), false);
    document.addEventListener('removeRemoteVideo',
        function(e) {
          var temp = this.state.remoteVideos;
          delete temp[e.detail.userId];
          this.setState({
            remoteVideos: temp,
          });
        }.bind(this), false);
    // chat
    document.addEventListener('channelMessage',
        function(e) {
          var label = e.detail.label;
          var userId = e.detail.userId;
          var message = e.detail.message;

          if (label === chatLabel) {
            this.addChatMessage(userId, message);
          }
        }.bind(this), false);
  }
  addChatMessage(userId, message) {
    var temp = this.state.chatMessages;
    temp.push({user: userId, message: message});
    var temp2 = this.state.chatText + '\n' + userId + ': ' + message;
    this.setState({
      chatMessages: temp,
      chatText: temp2,
    });
  }

  renderLocalVideo() {
    if (window.localStreamUrl) {
      return <Video key={'local'} name={'local'}
          stream={window.localStreamUrl} />;
    }
    return null;
  }
  renderRemoteVideos() {
    var ret = Object.entries(this.state.remoteVideos).map(([key,value])=>{
      return (
          <Video key={key} name={key} stream={value} />
      );
    });
    return ret;
  }
  onRoomSet() {
    this.setState({
      showPopup: 'none',
      enableCall: true,
    });
    this.props.onRoomSet();
  }
  onClickCall() {
    this.setState({
      enableCall: false,
      enableHangup: true,
      enableChat: true,
    });
    this.props.onClickCall();
  }
  onClickHangup() {
    this.setState({
      enableHangup: false,
      enableChat: false,
      showPopup: 'block',
      showChat: false,
      chatMessages: [],
    });
    this.props.onClickHangup();
  }
  onClickChat() {
    var temp = !(this.state.showChat);
    this.setState({
      showChat: temp,
    });
    if (temp) {
      this.setState({
        messagesCount: this.state.chatMessages.length,
      });
    }
  }
  onNewMessage(msg) {
    this.addChatMessage('Me', msg);
    this.props.onNewMessage(msg);
  }

  render() {
    var cbColor = 'black';
    if ((this.state.messagesCount < this.state.chatMessages.length)
        && (!this.state.showChat)) {
      cbColor = 'red';
    }
    return (
      <div>
        <div style={{padding: '5px'}}>
          <button id="callButton"
              onClick={this.onClickCall.bind(this)}
              disabled={!this.state.enableCall}>Call</button>
          <button id="hangupButton"
              onClick={this.onClickHangup.bind(this)}
              disabled={!this.state.enableHangup}>Hangup</button>
          <button id="toggleChat" style={{color: cbColor, float: 'right'}}
              onClick={this.onClickChat.bind(this)}
              disabled={!this.state.enableChat}>Chat</button>
        </div>
        <div>{this.renderLocalVideo()}</div>
        <div>{this.renderRemoteVideos()}</div>
        <Popup onRoomSet={this.onRoomSet.bind(this)}
            show={this.state.showPopup}/>
        <Chat onNewMessage={this.onNewMessage.bind(this)}
            chatText={this.state.chatText}
            show={this.state.showChat}/>
      </div>
    );
  }
}
Display.propTypes = {
  onRoomSet: React.PropTypes.func,
  onClickCall: React.PropTypes.func,
  onClickHangup: React.PropTypes.func,
  onNewMessage: React.PropTypes.func,
};

function render() {
  ReactDOM.render(
    <Display
        onRoomSet={onRoomSet}
        onClickCall={onClickCall}
        onClickHangup={onClickHangup}
        onNewMessage={sendChatMessage}/>,
    document.getElementById('container')
  );
}

function onClickCall() {
  lib.call(roomName);
}

function onClickHangup() {
  lib.hangup();
  stopLocalMedia();
}

// library
var lib;
var chatLabel = 'chat';
function onRoomSet() {
  history.replaceState({'room': roomName} /* state object */,
                        'Room ' + roomName /* title */,
                        encodeURIComponent(roomName) /* URL */);

  var datachannels = [chatLabel];
  console.log('init webRTC app, datachannels:', datachannels);
  lib = new CsioWebrtcApp(datachannels);
}

// parse URL for room name
var urlRoom = window.location.pathname.split('/')[1];
if (urlRoom !== '') {
  roomName = decodeURIComponent(urlRoom);
}

var debug = false;
// callstats
var csObject;
window.onload = init;
function init() {
  console.log('create callstats');
  csObject = new callstats(); // eslint-disable-line new-cap
  render();
}

var AppID = '@@APPID';
var AppSecret = '@@APPSECRET';
var localUserId = '';

function csInitCallback(csError, csErrMsg) {
  console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
  if (csError === 'success') {
    initLocalMedia();
  }
}
var reportType = {
  inbound: 'inbound',
  outbound: 'outbound'
};
var csStatsCallback = function(stats) {
  if (!debug) {
    return;
  }
  var ssrc;
  for (ssrc in stats.streams) {
    console.log('SSRC is: ', ssrc);
    var dataSsrc = stats.streams[ssrc];
    console.log('SSRC Type ', dataSsrc.reportType);
    if (dataSsrc.reportType === reportType.outbound) {
      console.log('RTT is: ', dataSsrc.rtt);
    } else if (dataSsrc.reportType === reportType.inbound) {
      console.log('Inbound loss rate is: ', dataSsrc.fractionLoss);
    }
  }
};
var configParams = {
  disableBeforeUnloadHandler: false,
  applicationVersion: 'v1.0'
};

// This event is triggered by CsioWebrtcApp when the name is available
// from the server
document.addEventListener('localName',
    function(e) {
      localUserId = e.detail.localname;
      console.log('Initialize callstats', localUserId);
      csObject.initialize(AppID, AppSecret, localUserId, csInitCallback,
          csStatsCallback, configParams);
    },
    false);

function pcCallback(err, msg) {
  console.log('Monitoring status: '+ err + ' msg: ' + msg);
}
document.addEventListener('newPeerConnection',
    function(e) {
      var pcObject = e.detail.pc;
      var remoteUserID = e.detail.userId;
      var usage = csObject.fabricUsage.multiplex;
      csObject.addNewFabric(pcObject, remoteUserID, usage,
          roomName, pcCallback);
    },
    false);

document.addEventListener('closePeerConnection',
    function(e) {
      var pcObject = e.detail.pc;
      var fabricEvent = csObject.fabricEvent.fabricTerminated;
      csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
    },
    false);

document.addEventListener('webrtcError', handleWebrtcError, false);
function handleWebrtcError(e) {
  var pcObject = e.detail.pc;
  var err = e.detail.error;
  var type = e.detail.type;
  var csioType;
  switch (type) {
  case 'createOffer':
    csioType = csObject.webRTCFunctions.createOffer;
    break;
  case 'createAnswer':
    csioType = csObject.webRTCFunctions.createAnswer;
    break;
  case 'setLocalDescription':
    csioType = csObject.webRTCFunctions.setLocalDescription;
    break;
  case 'setRemoteDescription':
    csioType = csObject.webRTCFunctions.setRemoteDescription;
    break;
  case 'addIceCandidate':
    csioType = csObject.webRTCFunctions.addIceCandidate;
    break;
  case 'getUserMedia':
    csioType = csObject.webRTCFunctions.getUserMedia;
    break;
  default:
    console.log('Error', type, 'not handled!');
    return;
  }
  csObject.reportError(pcObject, roomName, csioType, err);
}

// handle video add/remove provided by library
document.addEventListener('addRemoteVideo',
    function(e) {
      var pc = e.detail.pc;
      var remoteUserId = e.detail.userId;

      // associate SSRCs
      var ssrcs = [];
      var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
      var reg = /^ssrc:(\d*) ([\w_]*):(.*)/;
      pc.remoteDescription.sdp.split(/(\r\n|\r|\n)/).filter(validLine)
      .forEach(function(l) {
        var type = l[0];
        var content = l.slice(2);
        if (type === 'a') {
          if (reg.test(content)) {
            var match = content.match(reg);
            if (!(ssrcs.includes(match[1]))) {
              ssrcs.push(match[1]);
            }
          }
        }
      });
      for (var ssrc in ssrcs) {
        csObject.associateMstWithUserID(pc, remoteUserId, roomName, ssrc,
            'camera', /* video element id */remoteUserId);
      }
    },
    false);

// Initialize (local media)
function initLocalMedia() {
  console.log('Requesting local stream');
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  .then(function(stream) {
    console.log('Received local stream');
    window.localStream = stream;
    window.localStreamUrl = window.URL.createObjectURL(stream);

    render();
  },
  function(e) {
    console.log('getUserMedia() error: ', e);

    var detail = {'type': 'getUserMedia', 'pc': null, 'error': e};
    handleWebrtcError({'detail': detail});
  });
}

function stopLocalMedia() {
  console.log('Stopping local stream');
  for (var i in window.localStream.getTracks()) {
    window.localStream.getTracks()[i].stop();
  }
  window.localStream = null;
  window.localStreamUrl = null;
  render();
}

function sendChatMessage(message) {
  lib.sendChannelMessageAll(chatLabel, message);
}
