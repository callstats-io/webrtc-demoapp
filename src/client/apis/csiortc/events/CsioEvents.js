'use strict';
const CsioEvents = {
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
  }
};
const triggerEvent = (name, detail) => {
  const newEvent = new CustomEvent(name, {'detail': detail});
  document.dispatchEvent(newEvent);
};
export {CsioEvents, triggerEvent};
