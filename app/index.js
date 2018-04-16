/*
 * Sequence of initialization:
 *  show popup for room name
 *  popup OK -> init CsioWebrtcApp
 *  CsioWebrtcApp emit localName -> init callstats
 *  callstats callback configService -> initLocalMedia
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var debug = false;

var csObject;
var lib;
window.onload = function() {
  createCsjs();
  createLib();

  render();
};

function createCsjs() {
  console.log('create callstats');
  csObject = new callstats(); // eslint-disable-line new-cap

  initLocalMedia({audio: true});
  csObject.on('defaultConfig', defaultConfigCallback);
  csObject.on('recommendedConfig', recommendedConfigCallback);
  // csObject.on('stats', csStatsCallback);
}

var chatLabel;
function createLib() {
  chatLabel = 'chat';
  var datachannels = [chatLabel];
  console.log('init webRTC app, datachannels:', datachannels);
  lib = new CsioWebrtcApp(datachannels);
}

/*
 * React
 */
// A video element
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

// Popup asking for the room name
class Popup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: props.roomName,
    };
  }

  render() {
    return (
      <div id="popup" className="modal" style={{display: this.props.show}}>
        <div className="modal-content">
          Room: <input id="roomInput" type="text"
                  value={this.state.inputText}
                  onChange={this.onUpdateInputText.bind(this)}/>
          <button id="popupCloseButton"
            onClick={this.handleCloseModal.bind(this)}>OK</button>
        </div>
      </div>
    );
  }

  onUpdateInputText(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  handleCloseModal() {
    var temp = this.state.inputText;
    if (temp !== '') {
      console.log('room:', temp);
      this.props.onRoomSet(temp);
    }
  }
}
Popup.propTypes = {
  onRoomSet: React.PropTypes.func,
  show: React.PropTypes.string,
};

// Chat window
class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: '',
    };
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
Chat.propTypes = {
  onNewMessage: React.PropTypes.func,
  show: React.PropTypes.bool,
};

// Main react object that renders everything and keeps state
class Display extends React.Component {
  constructor(props) {
    super();
    this.state = {
      roomName: props.roomName,
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

    // video
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
  } // end constructor

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
            show={this.state.showPopup} roomName={this.state.roomName}/>
        <Chat onNewMessage={this.onNewMessage.bind(this)}
            chatText={this.state.chatText}
            show={this.state.showChat}/>
      </div>
    );
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

  addChatMessage(userId, message) {
    var temp = this.state.chatMessages;
    temp.push({user: userId, message: message});
    var temp2 = this.state.chatText + '\n' + userId + ': ' + message;
    this.setState({
      chatMessages: temp,
      chatText: temp2,
    });
  }

  onRoomSet(roomName) {
    /* NOTE to be super sure that we get info from config service before
      starting a call, enableCall should only be true if both roomName and
      iceConfig are available */
    this.setState({
      showPopup: 'none',
      enableCall: true,
      roomName: roomName,
    });
    this.props.onRoomSet(roomName);
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
}
Display.propTypes = {
  onRoomSet: React.PropTypes.func,
  onClickCall: React.PropTypes.func,
  onClickHangup: React.PropTypes.func,
  onNewMessage: React.PropTypes.func,
};

// init the React rendering
// may also be called if something changes (e.g. the local video)
function render() {
  ReactDOM.render(
    <Display
        onRoomSet={onRoomSet}
        onClickCall={onClickCall}
        onClickHangup={onClickHangup}
        onNewMessage={onNewChatMessage}
        roomName={roomName}/>,
    document.getElementById('container')
  );
}

/*
 * Room name
 */
var roomName = '';
// init from URL
var urlRoom = window.location.pathname.split('/')[1];
if (urlRoom !== '') {
  roomName = decodeURIComponent(urlRoom);
}

// roomName from user input
function onRoomSet(room) {
  roomName = room;
  history.replaceState({'room': roomName} /* state object */,
                        'Room ' + roomName /* title */,
                        encodeURIComponent(roomName) /* URL */);
}

/*
 * webRTC library
 */
function onClickCall() {
  lib.call(roomName);
}

function onClickHangup() {
  lib.hangup();
  stopLocalMedia();
}

function onNewChatMessage(message) {
  lib.sendChannelMessageAll(chatLabel, message);
}

/*
 * callstats.js
 */
function csInitCallback(csError, csErrMsg) {
  console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
}
var reportType = {
  inbound: 'inbound',
  outbound: 'outbound'
};
var csStatsCallback = function(stats) {
  if (!debug) {
    console.log('stats callback');
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

// JWT authentication
var localUserId;
var createTokenGeneratorTimer = function(forcenew, callback) {
  return setTimeout(function() {
    console.log('calling tokenGenerator');
    tokenGenerator(forcenew, callback);
  },100);
};
var tokenGenerator = function(forcenew, callback) {
  lib.generateToken(localUserId, function(err, token) {
    if (err) {
      console.log('Token generation failed: try again');
      return createTokenGeneratorTimer(forcenew, callback);
    }
    console.log('Received Token');
    callback(null, token);
  });
};


// config service callback
function defaultConfigCallback(config) {
  console.log('ConfigService, default config:', config);

  console.log('Media constraints:', config.media);
  initLocalMedia(config.media);

  console.log('ICE settings:', config.peerConnection);
  lib.setIceConfig(config.peerConnection);
}

function recommendedConfigCallback(config) {
  console.log('ConfigService, recommended config:', config);
  if (config.peerConnection) {
    lib.setIceConfig(config.peerConnection);
  }
}

var configParams = {
  disableBeforeUnloadHandler: false,
  applicationVersion: 'v1.0',
};
// local userId is available
document.addEventListener('localName',
    function(e) {
      var AppID = '@@APPID';
      var AppSecret = '@@APPSECRET';
      var JWT = '@@JWT';
      localUserId = e.detail.localname;
      console.log('Initialize callstats', localUserId, JWT);
      if (JWT === 'true') {
        csObject.initialize(AppID, tokenGenerator, localUserId, csInitCallback,
            csStatsCallback, configParams);
      } else {
        csObject.initialize(AppID, AppSecret, localUserId, csInitCallback,
            csStatsCallback, configParams);
      }
    },
    false);

// new peer connection is created for an incoming user
function pcCallback(err, msg) {
  if (debug) {
    console.log('Monitoring status: '+ err + ' msg: ' + msg);
  }
}
document.addEventListener('newPeerConnection',
    function(e) {
      var pcObject = e.detail.pc;
      var remoteUserID = e.detail.userId;
      var usage = csObject.fabricUsage.multiplex;
      csObject.addNewFabric(pcObject, remoteUserID, usage,
          roomName, pcCallback);
      console.log('added new fabric');
      if (e.detail.id > 0) {
        var fabricEvent = csObject.fabricEvent.fabricHold;
        csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
      }
    },
    false);

document.addEventListener('fabricHold',
  function(e) {
    console.warn('fabricHold');
    var pcObject = e.detail.pc;
    var fabricEvent = csObject.fabricEvent.fabricHold;
    csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
  },
  false);

document.addEventListener('fabricResume',
  function(e) {
    console.warn('fabricResume');
    var pcObject = e.detail.pc;
    var fabricEvent = csObject.fabricEvent.fabricResume;
    csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
  },
false);


window.triggerFabricEvent = function(ev) {
  lib.fabricEvent(ev);
};
window.triggerCreateOffer = function() {
  lib.triggerCreateOffer();
};

// a peer connection is closed due to a user leaving
document.addEventListener('closePeerConnection',
    function(e) {
      var pcObject = e.detail.pc;
      var fabricEvent = csObject.fabricEvent.fabricTerminated;
      csObject.sendFabricEvent(pcObject, fabricEvent, roomName);
    },
    false);

// an error occurred from webRTC
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

// a new video stream is incoming, associate MST
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
        csObject.associateMstWithUserID(pc, remoteUserId, roomName, ssrcs[ssrc],
            'camera', /* video element id */remoteUserId);
      }
    },
    false);

/*
 * Local media
 */
function initLocalMedia(constraints) {
  console.log('Requesting local stream');
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    console.log('Received local stream');
    window.localStream = stream;
    lib.setLocalStream(stream);
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
  lib.setLocalStream(null);
  window.localStreamUrl = null;
  render();
}
