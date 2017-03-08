'use strict';

// HTTP elements
var startButton = document.getElementById('startButton');
var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
var roomInput = document.getElementById('roomInput');
var localVideo = document.getElementById('localVideo');

// startup settings
callButton.disabled = true;
hangupButton.disabled = true;

// assign functions
startButton.onclick = function() {
  startButton.disabled = true;
  callButton.disabled = false;

  // Initialize (local media)
  console.log('Requesting local stream');
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  .then(function(stream) {
    console.log('Received local stream');
    localVideo.srcObject = stream;
    window.localStream = stream;
  })
  .catch(function(e) {
    console.log('getUserMedia() error: ', e);
  });
};

callButton.onclick = function() {
  callButton.disabled = true;
  roomInput.disabled = true;
  hangupButton.disabled = false;
  call(roomInput.value);
};

hangupButton.onclick = function() {
  hangupButton.disabled = true;
  roomInput.disabled = false;
  callButton.disabled = false;
  hangup();
};

// handle incoming video
function addRemoteVideo(userId,stream) {
  var v;
  if ((v = document.getElementById(userId)) === null) {
    v = document.createElement('video');
    v.id = userId;
    v.width = 320;
    v.height = 240;
    v.autoplay = true;

    document.getElementById('remoteVideos').append(v);
  }
  v.srcObject = stream;
}

function removeRemoteVideo(userId) {
  var v = document.getElementById(userId);
  if (v !== null) {
    document.getElementById(userId).remove();
  }
}
