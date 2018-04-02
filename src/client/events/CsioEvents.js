'use strict';
import CsioMediaCtrl from '../apis/csiortc/rtc/CsioMedia';

const CsioEvents = {
  CSIOSignaling: {
    SEND_MESSAGE: 'sendMessage',
    CONNECT: 'connect',
    JOIN: 'join',
    LEAVE: 'leave',
    MESSAGE: 'message',
    GENERATE_TOKEN: 'generateToken',
    ON_SEND_MESSAGE: 'onSendMessage',
    ON_CONNECT: 'onConnect',
    ON_JOIN: 'onJoin',
    ON_LEAVE: 'onLeave',
    ON_MESSAGE: 'onMessage',
    ON_GENERATE_TOKEN: 'onGenerateToken'
  },
  CsioMediaCtrl: {
    ON_USER_MEDIA: 'onUserMedia',
    ON_REMOTE_MEDIA: 'onRemoteMedia',
    ON_ADD_REMOVE_REMOTESTREAM: 'addRemoveRemoteVideo',
    ON_VIDEO_FOCUS_CHANGE: 'onVideoFocusChanged'
  },
  SocketIOEvents: {
    CONNECT: 'connect',
    JOIN: 'join',
    LEAVE: 'leave',
    MESSAGE: 'message',
    UserEvent: {
      SENDMESSAGE: 'sendMessage',
      JOIN: 'join',
      LEAVE: 'leave',
      MESSAGE: 'message',
      GENERATETOKEN: 'generateToken'
    }
  },
  UserEvent: {
    Signaling: {
      CONNECT: 'localname',
      USERJOIN: 'userJoin',
      USERLEAVE: 'userLeave',
      USERMESSAGE: 'userMessage',
      SETLOCALMEDIA: 'setlocalmedia'
    },
    Media: {
      LOCALMEDIA: 'localmedia',
      REMOTEMEDIA: 'remotemedia',
      ADDREMOTESTREAM: 'addRemoteVideo'
    }
  },
  UIEvent: {
    JOIN_ROOM_LINK_CLICK: 'joinroomlinkclick',
    MEETING_PAGE_LOADED: 'meetingpageloaded',
    VIDEO_FOCUS_CHANGE: 'videofocuschange',
    TOGGLE_MEDIA_STATE: 'togglemediastate',
    SHARE_MEETING_LINK: 'sharemeetinglink',
    CLOSE_MEETING: 'closemeeting'
  },
  RTCEvent: {
    CHANNELMESSAGE: 'channelMessage',
    SENDMESSAGE: 'sendDataChannelMessage'
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
