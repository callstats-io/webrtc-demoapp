'use strict';

// HTTP elements
var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
var roomInput = document.getElementById('roomInput');
var localVideo = document.getElementById('localVideo');


// callstats
var callstats = new callstats();
var AppID = '425973066';
var AppSecret = 'MBKqPIW6bPZM:Veq6vZD4xgTo7xLPqVaaaPFCBz6e9rlnF0r2FDIzzQU=';
var localUserId = '';

function csInitCallback(csError, csErrMsg) {
  console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg );
}
var reportType = {
  inbound: 'inbound',
  outbound: 'outbound'
};
var csStatsCallback = function(stats) {
  var ssrc;
  for (ssrc in stats.streams) {
    console.log('SSRC is: ', ssrc);
    var dataSsrc = stats.streams[ssrc];
    console.log('SSRC Type ', dataSsrc.reportType);
    if (dataSsrc.reportType === reportType.outbound) {
      console.log('RTT is: ', dataSsrc.rtt);
    } else if (dataSsrc.reportType === reportType.inbound) {
      console.log('Inbound loss rate is: ', dataSsrc.fractionLoss);
    }
  }
};
var configParams = {
  disableBeforeUnloadHandler: false,
  applicationVersion: 'v1.0'
};

// This event is triggered by CsioWebrtcApp when the name is available
// from the server
document.addEventListener('localName',
    function(e) {
      localUserId = e.detail.localname;
      console.log('Initialize callstats', localUserId);
      callstats.initialize(AppID, AppSecret, localUserId, csInitCallback,
          csStatsCallback, configParams);
    },
    false);

function pcCallback(err, msg) {
  console.log('Monitoring status: '+ err + ' msg: ' + msg);
}
document.addEventListener('newPeerConnection',
    function(e) {
      var pcObject = e.detail.pc;
      var remoteUserID = e.detail.userId;
      var usage = callstats.fabricUsage.multiplex;
      var conferenceID = roomInput.value;
      callstats.addNewFabric(pcObject, remoteUserID, usage,
          conferenceID, pcCallback);
    },
    false);

document.addEventListener('createOfferError',
    function(e) {
      var pcObject = e.detail.pc;
      var err = e.detail.error;
      var conferenceID = roomInput.value;
      callstats.reportError(pcObject, conferenceID,
          callstats.webRTCFunctions.createOffer, err);
    },
    false);


// library
var lib = new CsioWebrtcApp();

// handle video add/remove provided by library
document.addEventListener('addRemoteVideo',
    function(e) {
      addRemoteVideo(e.detail.userId, e.detail.stream);
    },
    false);
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

document.addEventListener('removeRemoteVideo',
    function(e) {
      removeRemoteVideo(e.detail.userId);
    },
    false);
function removeRemoteVideo(userId) {
  var v = document.getElementById(userId);
  if (v !== null) {
    document.getElementById(userId).remove();
  }
}

// startup settings
callButton.disabled = true;
hangupButton.disabled = true;

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
  callButton.disabled = false;
})
.catch(function(e) {
  console.log('getUserMedia() error: ', e);
});

// assign functions to buttons
callButton.onclick = function() {
  callButton.disabled = true;
  roomInput.disabled = true;
  hangupButton.disabled = false;
  lib.call(roomInput.value);
};

hangupButton.onclick = function() {
  hangupButton.disabled = true;
  roomInput.disabled = false;
  callButton.disabled = false;
  lib.hangup();
};
