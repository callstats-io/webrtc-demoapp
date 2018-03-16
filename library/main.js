/**
 * Main file for the library.
 * Requirement:
 *    window.localStream
 * Arguments:
 *    array of datachannel labels (optional)
 * Provides functions:
 *    call(room)
 *    hangup()
 *    toggleAVStates()
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

// TODO events are in document. create own event domain?
var signalling;
document.addEventListener('userJoin',
    function(e) {
      handleUserJoin(e.detail.userId);
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
function handleUserJoin(userId) {
  // init webRTC
  var pc = new modPeerconnection.CsioPeerConnection(
      userId,
      iceConfig);
  for (var i in datachannels) {
    pc.createChannel(datachannels[i]);
  }

  pcs[userId] = pc;
  pc.createOffer();
}

/**
 * A user leaves, turn down local user associated content
 */
function handleUserLeave(userId) {
  modCommon.triggerEvent('removeRemoteVideo', {'userId': userId});

  if (pcs[userId]) {
    pcs[userId].close();
    delete pcs[userId];
  }
}

/**
 * Receive details from another user
 */
function handleUserMessage(userId, message) {
  var pc;
  if (pcs[userId]) {
    pc = pcs[userId];
  } else {
    pc = new modPeerconnection.CsioPeerConnection(
        userId,
        iceConfig);
    pcs[userId] = pc;
  }

  var json = JSON.parse(message);
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
CsioWebrtcApp.prototype.toggleAVStates = function(isMuteOrPaused, isAudio) {
  for(const key in pcs) {
    if (pcs.hasOwnProperty(key) && pcs[key]) {
      pcs[key].toggleAVStates(isMuteOrPaused, window.localStream, isAudio);
    }
  }
};
CsioWebrtcApp.prototype.generateToken = function(userId, callback) {
  generateToken(userId, callback);
};
CsioWebrtcApp.prototype.sendChannelMessageAll = function(label, message) {
  for (var i in pcs) {
    pcs[i].sendChannelMessage(label, message);
  }
};
CsioWebrtcApp.prototype.setIceConfig = setIceConfig;
CsioWebrtcApp.prototype.notifyScreenShare = function(enableScreenShare) {
  for(const key in pcs) {
    if (pcs.hasOwnProperty(key) && pcs[key]) {
      pcs[key].notifyScreenShare(enableScreenShare);
    }
  }
};
CsioWebrtcApp.prototype.addRemoveTracks = function(isAdd) {
  for(const key in pcs) {
    if (pcs.hasOwnProperty(key) && pcs[key]) {
      if (isAdd) {
        pcs[key].addTrackInternals();
      } else {
        pcs[key].removeTrackInternals();
      }
    }
  }
};
CsioWebrtcApp.prototype.tryReNegotiate = function() {
  for(const key in pcs) {
    if (pcs.hasOwnProperty(key) && pcs[key]) {
      pcs[key].createOffer();
    }
  }
};

module.exports = CsioWebrtcApp;
