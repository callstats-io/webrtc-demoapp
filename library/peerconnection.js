/**
 * Callbacks: events for sendMessage, addRemoteVideo
 */

'use strict';

var modCommon = require('./common');

var turnServer = {
  url: 'turn:turn-server-1.dialogue.io:3478',
  username: 'test',
  credential: '1234',
  realm: 'reTurn'
};
var turnServerTls = {
  url: 'turn:turn-server-1.dialogue.io:5349',
  username: 'test',
  credential: '1234',
  realm: 'reTurn'
};
var iceServers = [turnServer, turnServerTls];
var servers = {'iceTransports': 'all','iceServers': iceServers};

class CsioPeerConnection {
  constructor(userId) {
    this.userId = userId;

    this.pc = new RTCPeerConnection(servers);
    modCommon.triggerEvent('newPeerConnection',
        {'userId': userId, 'pc': this.pc});

    this.datachannels = {};
    this.pc.ondatachannel = this.receiveChannelCallback.bind(this);

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
    for (var label in this.datachannels) {
      this.datachannels[label].close();
    }
    this.pc.close();
    modCommon.triggerEvent('closePeerConnection',
        {'userId': this.userId, 'pc': this.pc});
  }

  addIceCandidate(ic) {
    this.pc.addIceCandidate(new RTCIceCandidate(ic))
    .then(
      this.onAddIceCandidateSuccess.bind(this),
      this.onAddIceCandidateError.bind(this)
    );
  }

  createOffer() {
    this.opener = true;
    this.pc.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(
      function(e) {
        console.log(this.userId, 'send offer');
        this.onCreateOfferSuccess(e);
      }.bind(this),
      function(e) {
        modCommon.triggerEvent('webrtcError',
          {'type': 'createOffer',
            'userId': this.userId, 'pc': this.pc, 'error': e});
      }.bind(this));
  }

  setRemoteDescription(offer) {
    var l = new RTCSessionDescription(offer);
    this.pc.setRemoteDescription(l)
    .then(
      // setRemoteDescription success
      function() {
        if (this.pc.remoteDescription.type === 'offer') {
          console.log(this.userId, 'offer received');
          this.pc.createAnswer().then(
            // createAnswer success
            function(e) {
              console.log(this.userId, 'send answer');
              this.onCreateOfferSuccess(e);
            }.bind(this),
            // createAnswer failure
            function(e) {
              modCommon.triggerEvent('webrtcError',
                {'type': 'createAnswer',
                  'userId': this.userId, 'pc': this.pc, 'error': e});
            }.bind(this));
        } else {
          console.log(this.userId, 'answer received');
        }
      }.bind(this),
      // setRemoteDescription failure
      function(e) {
        modCommon.triggerEvent('webrtcError',
          {'type': 'setRemoteDescription',
            'userId': this.userId, 'pc': this.pc, 'error': e});
      }.bind(this));
  }

  // callback functions
  onRemoteStream(e) {
    console.log(this.userId, 'received remote stream');
    modCommon.triggerEvent('addRemoteVideo',
        {'pc': this.pc, 'userId': this.userId, 'stream': e.stream});
  }

  onAddIceCandidateSuccess() {
    console.log(this.userId, 'addIceCandidate success');
  }

  onAddIceCandidateError(error) {
    console.log(this.userId, 'failed to add ICE Candidate: '
        + error.toString());

    modCommon.triggerEvent('webrtcError',
      {'type': 'addIceCandidate',
        'userId': this.userId, 'pc': this.pc, 'error': error});
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
    this.pc.setLocalDescription(e)
    .then(
      function() {
        // send offer
        var json = {'offer': e};
        var str = JSON.stringify(json);
        modCommon.triggerEvent('sendMessage',
            {'userId': this.userId, 'message': str});
      }.bind(this),
      function(error) {
        modCommon.triggerEvent('webrtcError',
          {'type': 'setLocalDescription',
            'userId': this.userId, 'pc': this.pc, 'error': error});
      }.bind(this));
  }

  /*
   * Channel related functions
   */

  createChannel(label) {
    console.log('Channel creating:', label);
    this.datachannels[label] = this.pc.createDataChannel(label);
    this.setChannelCallbacks(label);
  }

  setChannelCallbacks(label) {
    this.datachannels[label].onmessage = this.handleChannelMessage.bind(this);
    this.datachannels[label].onopen = function(e) {
      console.log('Channel opened:', label);
    }.bind(this);
    this.datachannels[label].onclose = function(e) {
      console.log('Channel closed:', label);
    }.bind(this);
  }

  receiveChannelCallback(event) {
    var label = event.channel.label;
    console.log(this.userId, 'receive channel:', label);
    this.datachannels[label] = event.channel;
    this.setChannelCallbacks(label);
  }

  handleChannelMessage(event) {
    var label = event.currentTarget.label;
    var message = event.data;
    modCommon.triggerEvent('channelMessage',
        {'label': label, 'userId': this.userId, 'message': message});
  }

  sendChannelMessage(label, message) {
    this.datachannels[label].send(message);
  }
}

module.exports.CsioPeerConnection = CsioPeerConnection;
