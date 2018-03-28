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
      LOCALNAME: 'localname',
      USERJOIN: 'userJoin',
      USERLEAVE: 'userLeave',
      USERMESSAGE: 'userMessage'
    }
  }
};
export default CsioEvents;
