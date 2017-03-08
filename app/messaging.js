'use strict';

var pcs = {};

var signalling = new csioSignalling();
signalling.setCallbackUserJoin(messagingUserJoin); // param: userId
signalling.setCallbackUserLeave(messagingUserLeave); // param: userId
signalling.setCallbackUserMessage(messagingUserMessage); // param: userId, msg

csioPeerConnectionSettings.send = signalling.send.bind(signalling);
// csioPeerConnectionSettings.addRemoteVideo = addRemoteVideo;

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
  var pc = new csioPeerConnection(userId);
  pcs[userId] = pc;
  pc.createOffer();
}

/**
 * A user leaves, turn down local user associated content
 */
function messagingUserLeave(userId) {
  removeRemoteVideo(userId);

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
    pc = new csioPeerConnection(userId);
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
