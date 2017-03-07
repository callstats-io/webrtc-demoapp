
/**
 * Initialize (local media)
 */
function start() {
  console.log('Requesting local stream');
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  .then(function (stream) {
    console.log('Received local stream');
    localVideo.srcObject = stream;
    window.localStream = stream;
  })
  .catch(function(e) {
    console.log('getUserMedia() error: ', e);
  });
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
  stopCalls();

  //TODO how to stop the local media?
}
