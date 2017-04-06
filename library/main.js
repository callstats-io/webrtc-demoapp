/**
 * Main file for the library.
 * Requirement:
 *    window.localStream
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
var localStream;

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
  var pc = new modPeerconnection.CsioPeerConnection(userId);
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

/*
 * Local media
 */
function initLocalMedia() {
  console.log('Requesting local stream');
  return new Promise(function(resolve, reject) {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    .then(function(stream) {
      console.log('Received local stream');
      localStream = stream;
      resolve(localStream);
    },
    function(e) {
      console.log('getUserMedia() error: ', e);
      reject(e);
    });
  });
}

function stopLocalMedia() {
  console.log('Stopping local stream');
  return new Promise(function(resolve, reject) {
    for (var i in localStream.getTracks()) {
      localStream.getTracks()[i].stop();
    }
    localStream = null;
    resolve();
  });
}

// public functions
function CsioWebrtcApp(labels) {
  datachannels = (typeof labels === 'undefined')? [] : labels;

  signalling = new modSignalling.CsioSignalling();
}
CsioWebrtcApp.prototype.call = call;
CsioWebrtcApp.prototype.hangup = hangup;
CsioWebrtcApp.prototype.generateToken = generateToken;
CsioWebrtcApp.prototype.initLocalMedia = initLocalMedia;
CsioWebrtcApp.prototype.stopLocalMedia = stopLocalMedia;
CsioWebrtcApp.prototype.sendChannelMessageAll = function(label, message) {
  for (var i in pcs) {
    pcs[i].sendChannelMessage(label, message);
  }
};

module.exports = CsioWebrtcApp;
