/**
 * Callbacks: events for userJoin, userLeave, userMessage
 * Functions: send a message on event sendMessage
 */

'use strict';
import io from 'socket.io-client';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioSignalling {
  constructor() {
    this.socket = null;
    document.addEventListener(
      CsioEvents.CsioPeerConnection.SEND_MESSAGE,
      function(e) {
        this.send(e.detail.userId, e.detail.message);
      }.bind(this), false);

    /**
     * Open connection and set hooks for users joining,
     * leaving and incoming message
     */
    this.socket = io.connect();
    this.socket.on(
      CsioEvents.SocketIOEvents.CONNECT, function(data) {
        const detail = {
          userId: this.id,
          from: 'onSocketConnect'
        };
        TriggerEvent(
          CsioEvents.CSIOSignaling.ON_CONNECT, detail);
      });

    // hear from others
    this.socket.on(
      CsioEvents.SocketIOEvents.JOIN, function(userId) {
        console.log(userId, 'user joined');
        const detail = {
          userId: userId,
          from: 'onSocketJoin'
        };
        TriggerEvent(
          CsioEvents.CSIOSignaling.ON_JOIN, detail);
      });

    this.socket.on(
      CsioEvents.SocketIOEvents.LEAVE, function(userId) {
        console.log(userId, 'user leaving');
        const detail = {
          userId: userId,
          from: 'onSocketLeave'
        };
        TriggerEvent(
          CsioEvents.CSIOSignaling.ON_LEAVE, detail);
      });

    this.socket.on(
      CsioEvents.SocketIOEvents.MESSAGE, function(userId, message) {
        const detail = {
          userId: userId,
          message: message,
          from: 'onSocketMessage'
        };
        TriggerEvent(
          CsioEvents.CSIOSignaling.ON_MESSAGE, detail);
      });
  }

  start(room) {
    // annouce your presence
    console.log('Joining', room);
    this.socket.emit(
      CsioEvents.SocketIOEvents.JOIN, room);
  }

  /**
   * Leaving, tell others
   */
  stop() {
    this.socket.emit(
      CsioEvents.SocketIOEvents.LEAVE);
  }

  /**
   * Send a signalling message to another user
   */
  send(to, msg) {
    this.socket.emit(
      CsioEvents.SocketIOEvents.MESSAGE, to, msg);
  }

  /**
   * Ask server for a JWT token
   */
  generateToken(userId, callback) {
    this.socket.emit(
      CsioEvents.SocketIOEvents.GENERATE_TOKEN, userId, callback);
  }

  /**
   * Ask server for a JWT token
   */
  generateTurnToken(callback) {
    this.socket.emit(
      CsioEvents.SocketIOEvents.GENERATE_TURN_TOKEN, callback);
  }
}

export default CsioSignalling;
