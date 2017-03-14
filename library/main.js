/**
 * Main file for the library.
 * Requirement:
 *    window.localStream
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

// TODO events are in document. create own event domain?
var signalling = new modSignalling.CsioSignalling();
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
  var pc = new modPeerconnection.CsioPeerConnection(userId);
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
    pc = new modPeerconnection.CsioPeerConnection(userId);
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
  console.log('Starting call');
  signalling.start(room);
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

  // TODO how to stop the local media?
}


// public functions
function CsioWebrtcApp() {
}
CsioWebrtcApp.prototype.call = function(room) {
  call(room);
};
CsioWebrtcApp.prototype.hangup = function() {
  hangup();
};

module.exports = CsioWebrtcApp;
