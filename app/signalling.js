
class Signalling {
  constructor() {
    self = this;
    self.socket = null;
    self.callbackUserJoin = function(userId) {};
    self.callbackUserLeave = function(userId) {};
    self.callbackUserMessage = function(userId, message) {};
  }

  setCallbackUserJoin(func) {
    self.callbackUserJoin = func;
  }

  setCallbackUserLeave(func) {
    self.callbackUserLeave = func;
  }

  setCallbackUserMessage(func) {
    self.callbackUserMessage = func;
  }

  /**
   * Open connection and set hooks for users joining, leaving and incoming message
   */
  start(room) {
    // annouce your presence
    self.socket = io.connect();
    self.socket.on('connect', function(data) {
      console.log('Joining', room);
      self.socket.emit('join', room);
    });

    // hear from others
    self.socket.on('join', function(userId) {
      console.log(userId, 'user joining');
      self.callbackUserJoin(userId);
    });
    self.socket.on('leave', function(userId) {
      console.log(userId, 'user leaving');
      self.callbackUserLeave(userId);
    });
    self.socket.on('message', function(userId, message) {
     self.callbackUserMessage(userId, message);
    });
  }

  /**
   * Leaving, tell others
   */
  stop() {
    // server automatically tells others it's leaving
    self.socket.disconnect();
  }

  /**
   * Send a signalling message to another user
   */
  send(to, msg) {
    self.socket.emit('message', to, msg);
  }
}
