/**
 * Main file for the library.
 * Arguments:
 *    array of datachannel labels (optional)
 * Provides functions:
 *    call(room)
 *    hangup()
 * Emits events:
 *    addRemoteVideo({'userId', 'stream'})
 *    removeRemoteVideo({'userId'})
 *    localName({'localname'})
 *    createOfferError({'userId', 'pc', 'error'})
 */

'use strict';

var modCommon = require('./common');
var modSignalling = require('./signalling');
var modPeerconnection = require('./peerconnection');

var pcs = {};
var datachannels = [];
var iceConfig = null;
var localStream = null;

// TODO events are in document. create own event domain?
var signalling;
document.addEventListener('userJoin',
    function(e) {
      handleUserJoin(e.detail.userId, localStream, 0);
      handleUserJoin(e.detail.userId, null, 1);
    },
    false);
document.addEventListener('userLeave',
    function(e) {
      handleUserLeave(e.detail.userId);
    },
    false);
document.addEventListener('userMessage',
    function(e) {
      handleUserMessage(e.detail.userId, e.detail.message);
    },
    false);

/**
 * A new user joins, establish connection
 */
function handleUserJoin(userId, _localStream, id) {
  // init webRTC
  var pc = new modPeerconnection.CsioPeerConnection(
      userId,
      iceConfig,
      _localStream,
      id);
  for (var i in datachannels) {
    pc.createChannel(datachannels[i]);
  }

  if (!pcs[userId]) {
    pcs[userId] = [];
  }
  pcs[userId].push(pc);
  pc.createOffer();
}

/**
 * A user leaves, turn down local user associated content
 */
function handleUserLeave(userId) {
  modCommon.triggerEvent('removeRemoteVideo', {'userId': userId});

  if (pcs[userId]) {
    for (var i in pcs[userId]) {
      pcs[userId][i].close();
      delete pcs[userId][i];
    }
  }
}

/**
 * Receive details from another user
 */
function handleUserMessage(userId, message) {
  var json = JSON.parse(message);

  var id = json.id;

  var pc = null;
  if (pcs[userId]) {
    for (var i in pcs[userId]) {
      if (pcs[userId][i].id === id) {
        pc = pcs[userId][i];
      }
    }
  }

  if (pc === null) {
    var _localStream = localStream;
    if (pcs[userId] && pcs[userId].length > 0) {
      _localStream = null;
    }
    pc = new modPeerconnection.CsioPeerConnection(
        userId,
        iceConfig,
        _localStream,
        id);
    if (!pcs[userId]) {
      pcs[userId] = [];
    }
    pcs[userId].push(pc);
    console.warn('PC for '+id+' not found, creating new.'+
      ' len(pcs)=='+pcs[userId].length);
  }

  if (json.ice) {
    pc.addIceCandidate(json.ice);
  }
  if (json.offer) {
    pc.setRemoteDescription(json.offer);
  }
}

/**
 * Start the webRTC context
 */
function call(room) {
  if (room === null || room === '') {
    console.error('Room name not set!');
    return;
  }
  console.log('Starting call');
  signalling.start(room);
}

function generateToken(userId, callback) {
  signalling.generateToken(userId, callback);
}

/**
 * Turn down the webRTC context
 */
function hangup() {
  console.log('Ending call');
  signalling.stop();

  // Stop all ongoing calls
  for (var userId in pcs) {
    console.log(userId, 'remove');
    handleUserLeave(userId);
  }
  console.log('PCs:', pcs);
}

function setIceConfig(_iceConfig) {
  iceConfig = _iceConfig;
}

function setLocalStream(_localStream) {
  localStream = _localStream;
}

// public functions
function CsioWebrtcApp(labels) {
  datachannels = (typeof labels === 'undefined')? [] : labels;

  signalling = new modSignalling.CsioSignalling();
}
CsioWebrtcApp.prototype.call = function(room) {
  call(room);
};
CsioWebrtcApp.prototype.hangup = function() {
  hangup();
};
CsioWebrtcApp.prototype.generateToken = function(userId, callback) {
  generateToken(userId, callback);
};
CsioWebrtcApp.prototype.sendChannelMessageAll = function(label, message) {
  for (var i in pcs) {
    if (pcs[i].length > 0) {
      pcs[i][0].sendChannelMessage(label, message);
    }
  }
};
CsioWebrtcApp.prototype.setIceConfig = setIceConfig;
CsioWebrtcApp.prototype.setLocalStream = setLocalStream;

module.exports = CsioWebrtcApp;
