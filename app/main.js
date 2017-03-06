
// HTTP elements
var startButton   = document.getElementById('startButton');
var callButton    = document.getElementById('callButton');
var hangupButton  = document.getElementById('hangupButton');
var roomInput     = document.getElementById('roomInput');
var localVideo    = document.querySelector('video#localVideo');

// startup settings
callButton.disabled   = true;
hangupButton.disabled = true;

// assign functions
startButton.onclick   = start;
callButton.onclick    = call;
hangupButton.onclick  = hangup;

// variables
var socket;

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


/*
 * Call button
 * - initialize the call
 */
function call() {
  console.log('Starting call');
  callButton.disabled   = true;
  roomInput.disabled    = true;
  hangupButton.disabled = false;

  // annouce your presence
  socket = io.connect();
  socket.on('connect', function(data) {
    room = roomInput.value;
    console.log('joining', room);
    socket.emit('join', room);
  });
  socket.on('reconnect', function(data) {
    room = roomInput.value;
    console.log('joining', room);
    socket.emit('join', room);
  });

  // hear from others
  socket.on('join', function(userId) {
    console.log('user joining:', userId);
    handleUserJoin(userId);
  });
  socket.on('leave', function(userId) {
    console.log('user leaving:', userId);
    handleUserLeave(userId);
  });
  socket.on('message', function(userId, message) {
    console.log(userId + ': ' + message);
  });
}

function handleUserJoin(userId) {
  // send a message
  socket.emit('message', userId, 'welcome :)');
}
function handleUserLeave(userId) {

}

/*
 * Hang up button
 * - reset everything
 */
function hangup() {
  console.log('Ending call');

  // tell others
  socket.emit('leave')
  socket.disconnect();

  //TODO how to stop the local media?

  hangupButton.disabled = true;
  roomInput.disabled    = false;
  callButton.disabled   = false;
}
