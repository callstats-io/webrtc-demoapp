/**
 * Callbacks: events for sendMessage, addRemoteVideo
 */

'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioPeerConnection {
  constructor(userId, iceConfig, stream) {
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
    for (const label in this.datachannels) {
      this.datachannels[label].close();
    }
    this.pc.close();
    const detail = {
      userId: this.userId,
      pc: this.pc
    };
    TriggerEvent(CsioEvents.CsioPeerConnection.ON_PEERCONNECTION_CLOSED, detail);
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
      });
  }

  setRemoteDescription(offer) {
    const l = new RTCSessionDescription(offer);
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
              });
          } else {
            console.log(this.userId, 'answer received');
          }
        }.bind(this),
        // setRemoteDescription failure
        function(e) {
        });
  }
  oniceconnectionstatechange(e) {
    console.log('ICE connection state:', this.pc.iceConnectionState);
    if (this.pc.iceConnectionState === 'failed' ||
      this.pc.iceConnectionState === 'disconnected') {
      // this.createOffer(true);
    } else if (this.pc.iceConnectionState === 'completed' ||
      this.pc.iceConnectionState === 'closed') {
    }
  }
  // callback functions
  onTrack(e) {
    console.log(this.userId, 'received remote stream');
    const detail = {
      pc: this.pc,
      userId: this.userId,
      streams: e.streams
    };
    TriggerEvent(CsioEvents.CsioPeerConnection.ON_REMOTE_STREAM, detail);
  }

  onAddIceCandidateSuccess() {
    console.log(this.userId, 'addIceCandidate success');
  }

  onAddIceCandidateError(error) {
    console.log(this.userId, 'failed to add ICE Candidate: ' +
      error.toString());
  }

  onIceCandidate(e) {
    if (e.candidate) {
      // send ICE candidate
      const json = {'ice': e.candidate};
      const str = JSON.stringify(json);
      console.log(this.userId, 'sending ICE');
      const detail = {
        userId: this.userId,
        message: str
      };
      TriggerEvent(CsioEvents.CsioPeerConnection.SEND_MESSAGE, detail);
    }
  }

  onCreateOfferSuccess(e) {
    this.pc.setLocalDescription(e)
      .then(
        function() {
          // send offer
          const json = {'offer': e};
          const str = JSON.stringify(json);
          const detail = {
            userId: this.userId,
            message: str
          };
          TriggerEvent(CsioEvents.CsioPeerConnection.SEND_MESSAGE, detail);
        }.bind(this),
        function(e) {
        });
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
    };
    this.datachannels[label].onclose = function(e) {
      console.log('Channel closed:', label);
    };
  }

  receiveChannelCallback(event) {
    const label = event.channel.label;
    console.log(this.userId, 'receive channel:', label);
    this.datachannels[label] = event.channel;
    this.setChannelCallbacks(label);
  }

  handleChannelMessage(event) {
    const label = event.currentTarget.label;
    const message = event.data;
    const detail = {
      label: label,
      userId: this.userId,
      message: message
    };
    TriggerEvent(CsioEvents.CsioPeerConnection.ON_CHANNEL_MESSAGE, detail);
  }

  sendChannelMessage(label, message) {
    if (this.datachannels[label]) {
      this.datachannels[label].send(message);
    }
  }
}

export default CsioPeerConnection;
