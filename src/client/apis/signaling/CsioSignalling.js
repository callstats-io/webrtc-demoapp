/**
 * Callbacks: events for userJoin, userLeave, userMessage
 * Functions: send a message on event sendMessage
 */

'use strict';
import io from 'socket.io-client';
const modCommon = require('../utils/Common');
const CsioEvents = require('../events/CsioEvents').CsioEvents;

class CsioSignalling {
  constructor() {
    this.socket = null;
    document.addEventListener(
      CsioEvents.SocketIOEvents.UserEvent.SENDMESSAGE,
      function(e) {
        this.send(e.detail.userId, e.detail.message);
      }.bind(this),
      false);

    /**
     * Open connection and set hooks for users joining,
     * leaving and incoming message
     */
    this.socket = io.connect();
    this.socket.on(
      CsioEvents.SocketIOEvents.CONNECT, function(data) {
        modCommon.triggerEvent(
          CsioEvents.UserEvent.Signaling.CONNECT, {'localname': this.id});
      });

    // hear from others
    this.socket.on(
      CsioEvents.SocketIOEvents.JOIN, function(userId) {
        console.log(userId, 'user joining');
        modCommon.triggerEvent(
          CsioEvents.UserEvent.Signaling.USERJOIN, {'userId': userId});
      });

    this.socket.on(
      CsioEvents.SocketIOEvents.LEAVE, function(userId) {
        console.log(userId, 'user leaving');
        modCommon.triggerEvent(
          CsioEvents.UserEvent.Signaling.USERLEAVE, {'userId': userId});
      });

    this.socket.on(
      CsioEvents.SocketIOEvents.MESSAGE, function(userId, message) {
        modCommon.triggerEvent(
          CsioEvents.UserEvent.Signaling.USERMESSAGE,
          {'userId': userId, 'message': message});
      });
  }

  start(room) {
    // annouce your presence
    console.log('Joining', room);
    this.socket.emit(
      CsioEvents.SocketIOEvents.UserEvent.JOIN, room);
  }

  /**
   * Leaving, tell others
   */
  stop() {
    this.socket.emit(
      CsioEvents.SocketIOEvents.UserEvent.LEAVE);
  }

  /**
   * Send a signalling message to another user
   */
  send(to, msg) {
    this.socket.emit(
      CsioEvents.SocketIOEvents.UserEvent.MESSAGE, to, msg);
  }

  /**
   * Ask server for a JWT token
   */
  generateToken(userId, callback) {
    this.socket.emit(
      CsioEvents.SocketIOEvents.UserEvent.GENERATETOKEN, userId, callback);
  }
}

export default CsioSignalling;
