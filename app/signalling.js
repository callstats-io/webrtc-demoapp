
var socket;

/**
 * Open connection and set hooks for users joining, leaving and incoming message
 */
function signallingStart(room) {
  // annouce your presence
  socket = io.connect();
  socket.on('connect', function(data) {
    console.log('joining', room);
    socket.emit('join', room);
  });

  // hear from others
  socket.on('join', function(userId) {
    console.log('user joining:', userId);
    messagingUserJoin(userId);
  });
  socket.on('leave', function(userId) {
    console.log('user leaving:', userId);
    messagingUserLeave(userId);
  });
  socket.on('message', function(userId, message) {
    //console.log(userId + ': ' + message);
    messagingUserMessage(userId, message);
  });
}

/**
 * Leaving, tell others
 */
function signallingStop() {
  // server automatically tells others it's leaving
  socket.disconnect();
}

/**
 * Send a signalling message to another user
 */
function signallingSend(to, msg) {
  socket.emit('message', to, msg);
}
