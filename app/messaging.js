
var pcs = {};
var servers;

/**
 * A new user joins, send your details
 */
function messagingUserJoin(userId) {
  // init webRTC
  var pc = createPC(userId);

  console.log('createOffer start for', userId);
  pc.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  }).then(
    function(e) {
      onCreateOfferSuccess(pc, e);
    });
}
function createPC(userId) {
  var pc = new RTCPeerConnection(servers);
  pcs[userId] = pc;
  pc.userId = userId;

  console.log('Created new peer connection for', userId);
  pc.onicecandidate = function(e) {
    onIceCandidate(pc, e);
  };
  pc.addStream(window.localStream);
  console.log('Added local stream to pc for', userId);

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
  var userId = pc.userId;
  //console.log(userId, 'ICE candidate: \n' + (e.candidate ?
  //    e.candidate.candidate : '(null)'));

  // send ICE candidate
  var json = {"ice": e.candidate};
  var str  = JSON.stringify(json);
  signallingSend(userId, str);
}
function onCreateOfferSuccess(pc, e) {
  var userId = pc.userId;
  //console.log(userId, 'Send '+type+':', e.sdp);
  pc.setLocalDescription(e);

  // send offer
  var json = {"offer": e};
  var str  = JSON.stringify(json);
  signallingSend(userId, str);
}
function onCreateAnswerSuccess(pc, e) {
  var userId = pc.userId;
  //console.log(userId, 'Send '+type+':', e.sdp);
  pc.setLocalDescription(e);

  // send offer
  var json = {"answer": e};
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
  console.log(json);
  if (json.ice) {
    console.log(json.ice);
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
    console.log(userId, 'createAnswer start');

    pc.createAnswer().then(
      function(e) {
        onCreateAnswerSuccess(pc, e);
      }
    );
  }
  if (json.answer) {
    var l = new RTCSessionDescription(json.answer);
    pc.setRemoteDescription(l);
  }
}

function onAddIceCandidateSuccess(pc) {
 console.log(pc.userId, 'addIceCandidate success');
}

function onAddIceCandidateError(pc, error) {
 console.log(pc.userId, 'failed to add ICE Candidate: ' + error.toString());
}



function stopCalls() {
  console.log("PCs:", pcs);
  for (var userId in pcs) {
    console.log("Remove", userId);
    messagingUserLeave(userId);
  }
  console.log("PCs:", pcs);
}
