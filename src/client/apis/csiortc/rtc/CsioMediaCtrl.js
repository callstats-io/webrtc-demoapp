'use strict';

import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioMediaCtrl {
  constructor() {
    this.previouslySelectedUserId = undefined;
    this.remoteStreams = {};
    this.localStream = {};
    // event listeners
    document.addEventListener(
      CsioEvents.CsioPeerConnection.ON_REMOTE_STREAM,
      this.onRemoteStream, false);
  }
  getUserMedia(constraints) {
    const self = this;
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        const detail = {
          media: stream
        };
        self.localStream = stream;
        TriggerEvent(
          CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA, detail);
      },
      function(e) {
        console.error(e);
        self.localStream = null;
      });
  }
  addStream(stream, ctx) {
    stream.getTracks().forEach(function(mediaTrack) {
      if (typeof ctx.pc.addTrack === 'function') {
        ctx.pc.addTrack(mediaTrack, stream);
      }
    }, ctx);
  }
  removeStream(ctx, userId) {
    ctx.pc.getSenders().forEach(function(sender) {
      if (typeof ctx.pc.removeTrack === 'function') {
        ctx.pc.removeTrack(sender);
      }
    }, ctx);
  }
  getStream(isLocal, userId) {
    if (isLocal) {
      return this.localStream;
    } else {
      return this.remoteStreams[userId];
    }
  }
  disposeLocalStream(isLocal, userId) {
    if (this.localStream) {
      for (const at in this.localStream.getTracks()) {
        if (typeof this.localStream.getTrack === 'function') {
          if (this.localStream.getTracks()[at]) {
            this.localStream.getTracks()[at].stop();
          }
        }
      }
      this.localStream = null;
    }
  }
  disposeRemoteStream(userId) {
    delete this.remoteStreams[userId];
    const detail = {
      media: this.remoteStreams,
      userId: userId
    };
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.ON_ADD_REMOVE_REMOTESTREAM, detail);
  }
  // toggle media states
  toggleMediaStates(isMuteOrPaused, mediaType) {
    if (!this.localStream) {
      return;
    }
    let mediaTracks = mediaType === 'audio'
      ? this.localStream.getAudioTracks() : this.localStream.getVideoTracks();
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

  // Event based functions
  // when peer connection got remote streams
  onRemoteStream(e) {
    const streams = e.detail.streams;
    const userId = e.detail.userId;
    this.remoteStreams[userId] = streams[0];
    const detail = {
      media: this.remoteStreams,
      userId: userId
    };
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.ON_ADD_REMOVE_REMOTESTREAM, detail);
  }
  // ui related stream change handler
  onVideoFocusChanged(e) {
    const userId = e.detail.userId;
    const from = e.detail.from;
    let detail = {
      media: this.localStream,
      from: 'videoFocusChanged'
    };
    // if from click handler must need a change
    if (from === 'onClickHandler') {
      detail.media = userId === 'local' ? this.localStream : this.remoteStreams[userId];
    } else {
      if (this.remoteStreams[this.previouslySelectedUserId]) {
        detail.media = this.remoteStreams[this.previouslySelectedUserId];
      } else if (this.remoteStreams[userId]) {
        detail.media = this.remoteStreams[userId];
      }
    }
    this.previouslySelectedUserId = userId;
    TriggerEvent(
      CsioEvents.CsioMediaCtrl.VIDEO_FOCUS_CHANGE, detail);
  }
}

export default CsioMediaCtrl;
