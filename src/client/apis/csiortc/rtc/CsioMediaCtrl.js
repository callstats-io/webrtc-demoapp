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
      this.onRemoteStream.bind(this), false);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.VIDEO_FOCUS_CHANGE,
      this.onVideoFocusChanged.bind(this), false);
  }
  async isAudioOnly(constraints) {
    // if no audio, then don't need to check we need audio only
    if (!constraints.audio) {
      return false;
    }
    let audioOnly = false;
    try {
      await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      audioOnly = true;
    };
    return audioOnly;
  }
  getUserMedia(constraints) {
    const self = this;
    let promise = this.isAudioOnly(constraints);
    promise.then(function(audioOnly) {
      let _contrain = {...constraints};
      if (audioOnly) {
        _contrain.video = false;
      }
      navigator.mediaDevices.getUserMedia(_contrain)
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
          const detail = {
            type: 'getUserMedia',
            pc: null,
            error: e
          };
          TriggerEvent(
            CsioEvents.CsioPeerConnection.ON_WEBRTC_ERROR, detail);
        });
    }, (e) => {
      console.error(e);
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
  disposeLocalStream() {
    if (this.localStream) {
      for (const at in this.localStream.getTracks()) {
        this.localStream.getTracks()[at].stop();
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
