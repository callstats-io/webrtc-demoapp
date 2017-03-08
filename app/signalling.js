'use strict';

class csioSignalling {
  constructor() {
    this.socket = null;
    this.callbackUserJoin = function(userId) {};
    this.callbackUserLeave = function(userId) {};
    this.callbackUserMessage = function(userId, message) {};
  }

  setCallbackUserJoin(func) {
    this.callbackUserJoin = func;
  }

  setCallbackUserLeave(func) {
    this.callbackUserLeave = func;
  }

  setCallbackUserMessage(func) {
    this.callbackUserMessage = func;
  }

  /**
   * Open connection and set hooks for users joining,
   * leaving and incoming message
   */
  start(room) {
    // annouce your presence
    this.socket = io.connect();
    this.socket.on('connect', function(data) {
      console.log('Joining', room);
      this.emit('join', room);
    });

    // hear from others
    this.socket.on('join', function(userId) {
      console.log(userId, 'user joining');
      this.callbackUserJoin(userId);
    }.bind(this));
    this.socket.on('leave', function(userId) {
      console.log(userId, 'user leaving');
      this.callbackUserLeave(userId);
    }.bind(this));
    this.socket.on('message', function(userId, message) {
      this.callbackUserMessage(userId, message);
    }.bind(this));
  }

  /**
   * Leaving, tell others
   */
  stop() {
    // server automatically tells others it's leaving
    this.socket.disconnect();
  }

  /**
   * Send a signalling message to another user
   */
  send(to, msg) {
    this.socket.emit('message', to, msg);
  }
}
