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
    this.opener = false;

    this.pc = new RTCPeerConnection(servers);
    modCommon.triggerEvent('newPeerConnection',
        {'userId': userId, 'pc': this.pc});

    // chat
    this.chat = null;
    this.pc.ondatachannel = this.receiveChatChannelCallback.bind(this);

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
    this.chat.close();
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
        modCommon.triggerEvent('createOfferError',
            {'userId': this.userId, 'pc': this.pc, 'error': e});
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

    if (this.opener) {
      console.log('Opening chat ..');
      this.chat = this.pc.createDataChannel('chat');
      this.setChatChannelCallbacks();
      // re-negotiation needed, since it's the first datachannel
      this.createOffer();
    }
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

  /*
   * Methods for data channel
   */
  setChatChannelCallbacks() {
    this.chat.onmessage = this.handleChatMessage.bind(this);
    this.chat.onopen = function(e) {
      console.log('Chat opened');
    }.bind(this);
    this.chat.onclose = function(e) {
      console.log('Chat closed');
    }.bind(this);
  }

  receiveChatChannelCallback(event) {
    console.log('receive chat channel');
    this.chat = event.channel;
    this.setChatChannelCallbacks();
  }

  handleChatMessage(event) {
    var message = event.data;
    console.log('CHAT', this.userId+':', message);
    modCommon.triggerEvent('chatMessage',
        {'userId': this.userId, 'message': message});
  }

  sendChatMessage(message) {
    this.chat.send(message);
  }
}

module.exports.CsioPeerConnection = CsioPeerConnection;
