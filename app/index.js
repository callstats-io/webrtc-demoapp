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
var remoteVideos = {}; //userId: streamUrl (for now)
var chatMessages = [];

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

class Popup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: roomName,
      onroomset: props.onroomset,
    };
  }
  updateInputText(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  closeModal() {
    var temp = this.state.inputText;
    if (temp != '') {
      console.log('room:', temp);
      roomName = temp;
      this.state.onroomset();
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

class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: '',
      onnewmessage: props.onnewmessage,
    };
  }
  onInputChange(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  onSendClick() {
    var msg = this.state.inputText;
    this.state.onnewmessage(msg);
    this.setState({
      inputText: ''
    });
  }
  render() {
    var left = "0px";
    if (this.props.show) {
      left = "-300px";
    }
    var chatText = '';
    for (var i in chatMessages) {
      chatText = chatText + '\n' + chatMessages[i].user
          + ': ' + chatMessages[i].message;
    }
    return (
      <div id="slideout"
          style={{transform: 'translateX('+left+')'}}>
        <textarea className="form-control" readOnly='true' value={chatText}/>
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

class Display extends React.Component {
  constructor(props) {
    super();
    this.state = {
      onroomset: props.onroomset,
      onclickcall: props.onclickcall,
      onclickhangup: props.onclickhangup,
      onnewmessage: props.onnewmessage,
      showChat: false,
      showPopup: 'block',
      messagesCount: chatMessages.length,
      enableCall: false,
      enableHangup: false,
      enableChat: false,
    };
  }
  renderLocalVideo() {
    if (window.localStreamUrl) {
      return <Video key={'local'} name={'local'}
          stream={window.localStreamUrl} />;
    } else {
      return null;
    }
  }
  renderRemoteVideos() {
    var ret = [];
    for (var u in remoteVideos) {
      ret.push(<Video key={u} name={u} stream={remoteVideos[u]} />);
    }
    return <div>{ret}</div>;
  }
  onRoomSet() {
    this.setState({
      showPopup: 'none',
      enableCall: true,
    });
    this.state.onroomset();
  }
  onClickCall() {
    this.setState({
      enableCall: false,
      enableHangup: true,
      enableChat: true,
    });
    this.state.onclickcall();
  }
  onClickHangup() {
    this.setState({
      enableHangup: false,
      enableChat: false,
      showPopup: 'block',
      showChat: false,
    });
    this.state.onclickhangup();
  }
  onClickChat() {
    var temp = !(this.state.showChat);
    this.setState({
      showChat: temp,
    });
    if (this.state.showChat) {
      this.setState({
        messagesCount: chatMessages.length,
      });
    }
  }

  render() {
    var cbColor = 'black';
    if ((this.state.messagesCount < chatMessages.length)
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
        <Popup onroomset={this.onRoomSet.bind(this)}
            show={this.state.showPopup}/>
        <Chat onnewmessage={this.state.onnewmessage}
            show={this.state.showChat}/>
      </div>
    );
  }
}

function render() {
  ReactDOM.render(
    <Display
        onroomset={onRoomSet}
        onclickcall={onClickCall}
        onclickhangup={onClickHangup}
        onnewmessage={sendChatMessage}/>,
    document.getElementById('container')
  );
}

function onClickCall() {
  lib.call(roomName);
}

function onClickHangup() {
  lib.hangup();
  stopLocalMedia();
  chatMessages = []; //clear chat
}

var lib;
function onRoomSet() {
  history.replaceState({'room': roomName} /* state object */,
                        'Room ' + roomName /* title */,
                        roomName /* URL */);
  lib = new CsioWebrtcApp();
}

// parse URL for room name
var urlRoom = window.location.pathname.split('/')[1];
if (urlRoom !== '') {
  roomInput.value = decodeURIComponent(urlRoom);
}
// update url for easy distribution
roomInput.onchange = function() {
  var room = encodeURIComponent(roomInput.value);
  history.replaceState({'room': room} /* state object */,
                       'Room ' + room /* title */,
                       room /* URL */);
};

var debug = false;
// callstats
var csObject;
window.onload = init;
function init() {
  console.log('create callstats');
  csObject = new callstats();
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

// library

// handle video add/remove provided by library
document.addEventListener('addRemoteVideo',
    function(e) {
      var pc = e.detail.pc;
      var remoteUserId = e.detail.userId;
      addRemoteVideo(remoteUserId, e.detail.stream);

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
function addRemoteVideo(userId,stream) {
  remoteVideos[userId] = window.URL.createObjectURL(stream);
  render();
}

document.addEventListener('removeRemoteVideo',
    function(e) {
      removeRemoteVideo(e.detail.userId);
    },
    false);
function removeRemoteVideo(userId) {
  delete remoteVideos[userId];
  render();
}

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

// chat
chatButton.onclick = function() {
  var message = chatInput.value;
  lib.sendChannelMessageAll(chatLabel, message);
  addChatMessage('Me', message);
  chatInput.value = '';
};

document.addEventListener('channelMessage',
    function(e) {
      var label = e.detail.label;
      var userId = e.detail.userId;
      var message = e.detail.message;

      if (label === chatLabel) {
        addChatMessage(userId, message);
      }
    },
    false);

function addChatMessage(user, message) {
  chatMessages.push({user: user, message: message});
  render();
}

function sendChatMessage(message) {
  lib.sendChatMessageAll(message);
  addChatMessage('Me', message);
}
