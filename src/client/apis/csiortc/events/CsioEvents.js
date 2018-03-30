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
      USERMESSAGE: 'userMessage'
    },
    Media: {
      LOCALMEDIA: 'localmedia',
      REMOTEMEDIA: 'remotemedia',
      ADDREMOTESTREAM: 'addRemoteVideo',
      REMOVEREMOTESTREAM: 'removeRemoteVideo'
    }
  },
  UIEvent: {
    JOIN_ROOM_LINK_CLICK: 'joinroomlinkclick'
  }
};
export {CsioEvents};
