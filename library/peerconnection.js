/**
 * Callbacks: events for sendMessage, addRemoteVideo
 */

'use strict';

var modCommon = require('./common');

var servers;

class CsioPeerConnection {
  constructor(userId) {
    this.userId = userId;

    this.pc = new RTCPeerConnection(servers);

    console.log(userId, 'new peer connection');
    this.pc.onicecandidate = this.onIceCandidate.bind(this);

    // FIXME addStream, onAddStream deprecated, use tracks
    this.pc.addStream(window.localStream);
    console.log(userId, 'added local stream');

    this.pc.onaddstream = this.onRemoteStream.bind(this);
    this.pc.ontrack = this.onTrack.bind(this);
  }

  onTrack(event) {
  }

  // callable functions
  close() {
    this.pc.close();
  }

  addIceCandidate(ic) {
    this.pc.addIceCandidate(new RTCIceCandidate(ic))
    .then(
      this.onAddIceCandidateSuccess.bind(this),
      this.onAddIceCandidateError.bind(this)
    );
  }

  createOffer() {
    this.pc.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(
      function(e) {
        console.log(this.userId, 'send offer');
        this.onCreateOfferSuccess(e);
      }.bind(this));
  }

  setRemoteDescription(offer) {
    var l = new RTCSessionDescription(offer);
    this.pc.setRemoteDescription(l)
    .then(
      function() {
        if (this.pc.remoteDescription.type === 'offer') {
          this.pc.createAnswer().then(
            function(e) {
              console.log(this.userId, 'send answer');
              this.onCreateOfferSuccess(e);
            }.bind(this));
          console.log(this.userId, 'offer received');
        } else {
          console.log(this.userId, 'answer received');
        }
      }.bind(this));
  }

  // callback functions
  onRemoteStream(e) {
    console.log(this.userId, 'received remote stream');
    modCommon.triggerEvent('addRemoteVideo',
        {'userId': this.userId, 'stream': e.stream});
  }

  onAddIceCandidateSuccess() {
    console.log(this.userId, 'addIceCandidate success');
  }

  onAddIceCandidateError(error) {
    console.log(this.userId, 'failed to add ICE Candidate: '
        + error.toString());
  }

  onIceCandidate(e) {
    if (e.candidate) {
      // send ICE candidate
      var json = {'ice': e.candidate};
      var str = JSON.stringify(json);
      console.log(this.userId, 'sending ICE');
      modCommon.triggerEvent('sendMessage',
          {'userId': this.userId, 'message': str});
    }
  }

  onCreateOfferSuccess(e) {
    this.pc.setLocalDescription(e);

    // send offer
    var json = {'offer': e};
    var str = JSON.stringify(json);
    modCommon.triggerEvent('sendMessage',
        {'userId': this.userId, 'message': str});
  }
}

module.exports.CsioPeerConnection = CsioPeerConnection;
