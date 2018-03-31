/**
 * Callbacks: events for sendMessage, addRemoteVideo
 */

'use strict';

var modCommon = require('../utils/Common');

class CsioPeerConnection {
  constructor(userId, iceConfig) {
    if (!userId || userId === '') {
      console.error('Necessary parameter missing:', userId);
      return;
    }
    this.userId = userId;

    // TODO is there any error when the TURN servers are not responding o.s.?
    this.pc = new RTCPeerConnection(iceConfig);
    this.datachannels = {};
    this.pc.ondatachannel = this.receiveChannelCallback.bind(this);
    console.log(userId, 'new peer connection');
    this.pc.onicecandidate = this.onIceCandidate.bind(this);
    this.pc.oniceconnectionstatechange = this.oniceconnectionstatechange.bind(this);
    this.pc.ontrack = this.onTrack.bind(this);
  }

  // callable functions
  close() {
    for (var label in this.datachannels) {
      this.datachannels[label].close();
    }
    this.pc.close();
    modCommon.triggerEvent('closePeerConnection',
      {'userId': this.userId, 'pc': this.pc});
    modCommon.triggerEvent('applicationLogEvent',
      {'pc': this.pc, 'eventLog': 'PeerConnection closed for ' + this.userId});
  }

  // toggle media states
  toggleMediaStates(isMuteOrPaused, mediaStream, mediaType) {
    let febType;
    let logMsg;
    if (mediaType === 'screen') {
      logMsg = 'Screen share is ' + (isMuteOrPaused ? 'enabled' : 'disabled') +
        ' for ' + this.userId;
      febType = isMuteOrPaused
        ? 'screenShareEnabled' : 'screenShareDisabled';
    } else {
      febType = !isMuteOrPaused ? 'audioMuted' : 'audioUnmuted';
      logMsg = 'Audio is ' +
        (!isMuteOrPaused ? 'muted' : 'unmuted') + ' for ' + this.userId;
      if (mediaType !== 'audio') {
        febType = !isMuteOrPaused ? 'videoPaused' : 'videoResumed';
        logMsg = 'Video is ' +
          (!isMuteOrPaused ? 'paused' : 'resumed') + ' for ' + this.userId;
      }
      let mediaTracks = mediaType === 'audio'
        ? mediaStream.getAudioTracks() : mediaStream.getVideoTracks();
      if (mediaTracks.length === 0) {
        console.warn('No local ', mediaType, 'track available.');
        return;
      }
      for (const i in mediaTracks) {
        if (mediaTracks.hasOwnProperty(i) && mediaTracks[i]) {
          mediaTracks[i].enabled = isMuteOrPaused;
        }
      }
    }
    modCommon.triggerEvent('applicationLogEvent',
      {'pc': this.pc, 'eventLog': logMsg});
    modCommon.triggerEvent('toggleMediaStates',
      {'userId': this.userId, 'pc': this.pc, 'type': febType});
  }
  addIceCandidate(ic) {
    this.pc.addIceCandidate(new RTCIceCandidate(ic))
      .then(
        this.onAddIceCandidateSuccess.bind(this),
        this.onAddIceCandidateError.bind(this)
      );
  }

  createOffer(iceRestart = false) {
    this.opener = true;
    let offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
      iceRestart: iceRestart
    };
    console.log('Signaling state:', this.pc.signalingState);
    if (this.pc.signalingState !== 'stable') {
      return;
    }
    this.pc.createOffer(offerOptions).then(
      function(e) {
        console.log(this.userId, 'send offer');
        this.onCreateOfferSuccess(e);
      }.bind(this),
      function(e) {
        modCommon.triggerEvent('webrtcError',
          {'type': 'createOffer',
            'userId': this.userId,
            'pc': this.pc,
            'error': e});
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
                    'userId': this.userId,
                    'pc': this.pc,
                    'error': e});
              }.bind(this));
          } else {
            console.log(this.userId, 'answer received');
          }
        }.bind(this),
        // setRemoteDescription failure
        function(e) {
          modCommon.triggerEvent('webrtcError',
            {'type': 'setRemoteDescription',
              'userId': this.userId,
              'pc': this.pc,
              'error': e});
        }.bind(this));
  }
  oniceconnectionstatechange(e) {
    console.log('ICE connection state:', this.pc.iceConnectionState);
    if (this.pc.iceConnectionState === 'failed' ||
      this.pc.iceConnectionState === 'disconnected') {
      this.createOffer(true);
    } else if (this.pc.iceConnectionState === 'completed' ||
      this.pc.iceConnectionState === 'closed') {
      modCommon.triggerEvent('applicationLogEvent',
        {'pc': this.pc,
          'eventLog': 'ICE connection ' +
          this.pc.iceConnectionState + ' for ' + this.userId});
    }
  }
  // callback functions
  onTrack(e) {
    console.log(this.userId, 'received remote stream');
    modCommon.triggerEvent('addRemoteVideo',
      {'pc': this.pc, 'userId': this.userId, 'streams': e.streams});
    modCommon.triggerEvent('applicationLogEvent',
      {'pc': this.pc, 'eventLog': 'Remote stream received for ' + this.userId});
  }

  onAddIceCandidateSuccess() {
    console.log(this.userId, 'addIceCandidate success');
  }

  onAddIceCandidateError(error) {
    console.log(this.userId, 'failed to add ICE Candidate: ' +
      error.toString());

    modCommon.triggerEvent('webrtcError',
      {'type': 'addIceCandidate',
        'userId': this.userId,
        'pc': this.pc,
        'error': error});
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
              'userId': this.userId,
              'pc': this.pc,
              'error': error});
        }.bind(this));
  }

  /*
   * Channel related functions
   */

  createChannel(label) {
    console.log('Channel creating:', label);
    this.datachannels[label] = this.pc.createDataChannel(label);
    this.setChannelCallbacks(label);
    modCommon.triggerEvent('applicationLogEvent',
      {'pc': this.pc,
        'eventLog': 'DataChannel ' + label + ' created for ' +
        this.userId});
  }

  setChannelCallbacks(label) {
    this.datachannels[label].onmessage = this.handleChannelMessage.bind(this);
    this.datachannels[label].onopen = function(e) {
      console.log('Channel opened:', label);
      modCommon.triggerEvent('applicationLogEvent',
        {'pc': this.pc,
          'eventLog': 'DataChannel ' + label + ' opened for ' +
          this.userId});
    }.bind(this);
    this.datachannels[label].onclose = function(e) {
      console.log('Channel closed:', label);
      modCommon.triggerEvent('applicationLogEvent',
        {'pc': this.pc,
          'eventLog': 'DataChannel ' + label + ' closed for ' +
          this.userId});
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

  removeTrackInternals() {
    this.pc.getSenders().forEach((sender) => {
      this.pc.removeTrack(sender);
      console.log(this.userId, 'remove local stream with kind', sender);
    }, this);
  }

  addTrackInternals() {
    window.localStream.getTracks().forEach(function(track) {
      if (typeof this.pc.addTrack === 'function') {
        this.pc.addTrack(track, window.localStream);
        console.log(this.userId, 'added local stream with kind', track.kind);
      }
    }, this);
  }
}

export default CsioPeerConnection;
