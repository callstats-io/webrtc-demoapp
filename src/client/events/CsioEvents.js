'use strict';

const CsioEvents = {
  SocketIOEvents: {
    CONNECT: 'connect',
    JOIN: 'join',
    LEAVE: 'leave',
    MESSAGE: 'message'
  },
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
  CsioStats: {
    ON_INITIALIZED: 'csiostats.initialized',
    ON_DISCONNECTED: 'csiostats.disconnected'
  },
  CsioMediaCtrl: {
    ON_LOCAL_USER_MEDIA: 'csiomediactrl.onLocalUserMedia',
    ON_REMOTE_MEDIA: 'csiomediactrl.onRemoteMedia',
    ON_ADD_REMOVE_REMOTESTREAM: 'csiomediactrl.addRemoveRemoteVideo',
    VIDEO_FOCUS_CHANGE: 'csiomediactrl.videoFocusChanged'
  },
  CsioPeerConnection: {
    ON_PEERCONNECTION_CREATED: 'csiopeerconnection.onpeerconnectioncreated',
    ON_PEERCONNECTION_CLOSED: 'csiopeerconnection.onPeerConnectionClosed',
    ON_WEBRTC_ERROR: 'csiopeerconnection.onWebrtcError',
    ON_REMOTE_STREAM: 'csiopeerconnection.onRemoteStream',
    ON_WERTC_ERROR: 'csiopeerconnection.webrtcError',
    SEND_MESSAGE: 'csiopeerconnection.sendMessage',
    SEND_CHANNEL_MESSAGE: 'csiopeerconnection.sendChannelMessage',
    ON_CHANNEL_MESSAGE: 'csiopeerconnection.onChannelMessage',
    ON_APPLICATION_LOG: 'csiopeerconnection.applicationLogEvent'
  },
  CsioRTC: {
    ON_TOGGLE_MEDIA_STATE: 'csiortc.ontogglemediastate'
  },
  LANDING_PAGE: {
    ON_JOIN_MEETING_ROOM_LINK_CLICK: 'landingpage.onjoinmeetingroomlinkclick'
  },
  MEETING_PAGE: {
    ON_MEETING_PAGE_LOADED: 'meetingpage.onmeetingpageloaded',
    ON_SHARE_MEETING_LINK: 'meetingpage.onsharemeetinglink',
    ON_MEETING_CLOSE_CLICKED: 'meetingpage.onmeetingcloseclicked',
    ON_TOGGLE_MEDIA_STATE: 'meetingpage.ontogglemediastate',
    VIDEO_FOCUS_CHANGE: 'meetingpage.videoFocusChanged',
    RESIZE_VIDEO_VIEW: 'meetingpage.resizevideoview'
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
