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
      CsioEvents.CSIOSignaling.SENDMESSAGE,
      (e) => {
        this.send(e.detail.userId, e.detail.message);
      }, false);

    /**
     * Open connection and set hooks for users joining,
     * leaving and incoming message
     */
    this.socket = io.connect();
    this.socket.on(
      CsioEvents.CSIOSignaling.CONNECT, function(data) {
        const detail = {
          localName: this.id,
          from: 'onSocketConnect'
        };
        TriggerEvent(
          CsioEvents.CSIOSignaling.ON_CONNECT, detail);
      });

    // hear from others
    this.socket.on(
      CsioEvents.CSIOSignaling.JOIN, function(userId) {
        console.log(userId, 'user joined');
        const detail = {
          userId: this.userId,
          from: 'onSocketJoin'
        };
        TriggerEvent.triggerEvent(
          CsioEvents.CSIOSignaling.ON_JOIN, detail);
      });

    this.socket.on(
      CsioEvents.CSIOSignaling.LEAVE, function(userId) {
        console.log(userId, 'user leaving');
        const detail = {
          userId: userId,
          from: 'onSocketLeave'
        };
        TriggerEvent.triggerEvent(
          CsioEvents.CSIOSignaling.ON_LEAVE, detail);
      });

    this.socket.on(
      CsioEvents.CSIOSignaling.MESSAGE, function(userId, message) {
        const detail = {
          userId: userId,
          message: message,
          from: 'onSocketMessage'
        };
        TriggerEvent.triggerEvent(
          CsioEvents.CSIOSignaling.ON_MESSAGE, detail);
      });
  }

  start(room) {
    // annouce your presence
    console.log('Joining', room);
    this.socket.emit(
      CsioEvents.CSIOSignaling.JOIN, room);
  }

  /**
   * Leaving, tell others
   */
  stop() {
    this.socket.emit(
      CsioEvents.CSIOSignaling.LEAVE);
  }

  /**
   * Send a signalling message to another user
   */
  send(to, msg) {
    this.socket.emit(
      CsioEvents.CSIOSignaling.MESSAGE, to, msg);
  }

  /**
   * Ask server for a JWT token
   */
  generateToken(userId, callback) {
    this.socket.emit(
      CsioEvents.CSIOSignaling.GENERATE_TOKEN, userId, callback);
  }
}

export default CsioSignalling;
