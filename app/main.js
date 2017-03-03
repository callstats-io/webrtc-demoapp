// parts borrowed from
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/multiple/js/main.js


// HTTP elements
var startButton   = document.getElementById('startButton');
var callButton    = document.getElementById('callButton');
var hangupButton  = document.getElementById('hangupButton');
var localVideo    = document.querySelector('video#localVideo');

// startup settings
callButton.disabled   = true;
hangupButton.disabled = true;

// assign functions
startButton.onclick = start;

// variables

/*
 * Start button
 * - request local media
 * - display video
 */
function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  .then(gotStream)
  .catch(function(e) {
    console.log('getUserMedia() error: ', e);
  });
}

function gotStream(stream) {
 console.log('Received local stream');
 localVideo.srcObject = stream;
 window.localStream = stream;
 callButton.disabled = false;
}
