
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
  signallingStart(room);
}

/**
 * Turn down the webRTC context
 */
function hangup() {
  console.log('Ending call');
  signallingStop();

  stopCalls();

  //TODO how to stop the local media?
}
