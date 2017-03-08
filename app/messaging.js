'use strict';

var pcs = {};

var signalling = new CsioSignalling();
document.addEventListener('userJoin',
    function(e) {
      messagingUserJoin(e.detail.userId);
    },
    false);
document.addEventListener('userLeave',
    function(e) {
      messagingUserLeave(e.detail.userId);
    },
    false);
document.addEventListener('userMessage',
    function(e) {
      messagingUserMessage(e.detail.userId, e.detail.message);
    },
    false);

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
    messagingUserLeave(userId);
  }
  console.log('PCs:', pcs);

  // TODO how to stop the local media?
}

/**
 * A new user joins, send your details
 */
function messagingUserJoin(userId) {
  // init webRTC
  var pc = new CsioPeerConnection(userId);
  pcs[userId] = pc;
  pc.createOffer();
}

/**
 * A user leaves, turn down local user associated content
 */
function messagingUserLeave(userId) {
  triggerEvent('removeRemoteVideo', {'userId': userId});

  if (pcs[userId]) {
    pcs[userId].close();
    delete pcs[userId];
  }
}

/**
 * Receive details from another user
 */
function messagingUserMessage(userId, message) {
  var pc;
  if (pcs[userId]) {
    pc = pcs[userId];
  } else {
    pc = new CsioPeerConnection(userId);
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
