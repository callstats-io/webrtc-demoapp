'use strict';

const CsioEvents = {
  CSIOSignaling: {
    SEND_MESSAGE: 'csioevents.sendMessage',
    CONNECT: 'csioevents.connect',
    JOIN: 'csioevents.join',
    LEAVE: 'csioevents.leave',
    MESSAGE: 'csioevents.message',
    GENERATE_TOKEN: 'csioevents.generateToken',
    ON_CONNECT: 'csioevents.onConnect',
    ON_JOIN: 'csioevents.onJoin',
    ON_LEAVE: 'csioevents.onLeave',
    ON_MESSAGE: 'csioevents.onMessage',
    ON_GENERATE_TOKEN: 'csioevents.onGenerateToken'
  },
  CsioMediaCtrl: {
    ON_USER_MEDIA: 'csiomediactrl.onUserMedia',
    ON_REMOTE_MEDIA: 'csiomediactrl.onRemoteMedia',
    ON_ADD_REMOVE_REMOTESTREAM: 'csiomediactrl.addRemoveRemoteVideo',
    ON_VIDEO_FOCUS_CHANGE: 'csiomediactrl.onVideoFocusChanged'
  },
  CsioPeerConnection: {
    ON_PEERCONNECTION_CLOSED: 'csiopeerconnection.onPeerConnectionClosed',
    ON_WEBRTC_ERROR: 'csiopeerconnection.onWebrtcError',
    ON_REMOTE_STREAM: 'csiopeerconnection.onRemoteStream',
    ON_WERTC_ERROR: 'csiopeerconnection.webrtcError',
    SEND_MESSAGE: 'csiopeerconnection.sendMessage',
    CHANNEL_MESSAGE: 'csiopeerconnection.channelMessage'
  },
  UIEvent: {
    JOIN_ROOM_LINK_CLICK: 'joinroomlinkclick',
    MEETING_PAGE_LOADED: 'meetingpageloaded',
    VIDEO_FOCUS_CHANGE: 'videofocuschange',
    TOGGLE_MEDIA_STATE: 'togglemediastate',
    SHARE_MEETING_LINK: 'sharemeetinglink',
    CLOSE_MEETING: 'closemeeting'
  }
};

const Tags = {
  CSIOSignaling: {
    LOCAL_NAME: 'localName'
  }
};

const TriggerEvent = (name, detail) => {
  const newEvent = new CustomEvent(name, {'detail': detail});
  document.dispatchEvent(newEvent);
};
export {CsioEvents, TriggerEvent, Tags};
