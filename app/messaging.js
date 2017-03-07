
var pcs = {};
var servers;

/**
 * A new user joins, send your details
 */
function messagingUserJoin(userId) {
  // init webRTC
  var pc = createPC(userId);

  pc.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  }).then(
    function(e) {
      console.log(userId, 'send offer');
      onCreateOfferSuccess(pc, e);
    });
}
function createPC(userId) {
  var pc = new RTCPeerConnection(servers);
  pcs[userId] = pc;
  pc.userId = userId;

  console.log(userId, 'new peer connection');
  pc.onicecandidate = function(e) {
    onIceCandidate(pc, e);
  };

  // TODO addStream, onAddStream deprecated, use tracks
  pc.addStream(window.localStream);
  console.log(userId, 'added local stream');

  pc.onaddstream = function(e) {
    gotRemoteStream(pc, e);
  };

  return pc;
}
function gotRemoteStream(pc, e) {
  console.log(pc.userId, 'received remote stream');
  addRemoteVideo(pc.userId, e.stream);
}
function onIceCandidate(pc, e) {
  if (e.candidate) {
    var userId = pc.userId;

    // send ICE candidate
    var json = {"ice": e.candidate};
    var str  = JSON.stringify(json);
    signallingSend(userId, str);
  }
}
function onCreateOfferSuccess(pc, e) {
  var userId = pc.userId;
  pc.setLocalDescription(e);

  // send offer
  var json = {"offer": e};
  var str  = JSON.stringify(json);
  signallingSend(userId, str);
}

/**
 * A user leaves, turn down local user associated content
 */
function messagingUserLeave(userId) {
  removeRemoteVideo(userId);

  pcs[userId].close();
  delete pcs[userId];
}

/**
 * Receive details from another user
 */
function messagingUserMessage(userId, message) {
  var pc;
  if (pcs[userId]) {
    pc = pcs[userId];
  } else {
    pc = createPC(userId);
  }

  var json = JSON.parse(message);
  if (json.ice) {
    pc.addIceCandidate(new RTCIceCandidate(json.ice))
    .then(
      function() {
        onAddIceCandidateSuccess(pc);
      },
      function(err) {
        onAddIceCandidateError(pc, err);
      });
  }
  if (json.offer) {
    var l = new RTCSessionDescription(json.offer);
    pc.setRemoteDescription(l);

    if (pc.remoteDescription.type == "offer") {
      pc.createAnswer().then(
        function(e) {
          console.log(userId, 'send answer');
          onCreateOfferSuccess(pc, e);
        });
      console.log(userId, 'offer received');
    } else { console.log(userId, 'answer received'); }
  }
}

function onAddIceCandidateSuccess(pc) {
 console.log(pc.userId, 'addIceCandidate success');
}

function onAddIceCandidateError(pc, error) {
 console.log(pc.userId, 'failed to add ICE Candidate: ' + error.toString());
}

/**
 * Stop all ongoing calls
 */
function stopCalls() {
  for (var userId in pcs) {
    console.log(userId, "remove");
    messagingUserLeave(userId);
  }
  console.log("PCs:", pcs);
}
