var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var socketIO = require('socket.io');

// variables
var app = express();
var server;

// offered files
app.use(express.static(path.join(__dirname, 'app')));

// server
if (process.env.SSL === 'true') {
  var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    ca: fs.readFileSync('ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: 'v2ZIZj2jKUap',
  };
  server = https.createServer(options, app);
  server.listen(process.env.portSSL);
} else {
  server = http.createServer(app);
  server.listen(process.env.port);
}
var io = socketIO.listen(server);
console.log('IO created');

// functionality
io.sockets.on('connection', function(socket) {
  socket.on('join', function(room) {
    leaveRoom(socket);

    var id = socket.id;
    console.log(id, 'joins', room);
    socket.join(room);
    socket.room = room;
    socket.broadcast.to(room).emit('join', id);
  });

  socket.on('disconnect', function() {
    leaveRoom(socket);
  });

  socket.on('message', function(to, message) {
    var from = socket.id;
    socket.to(to).emit('message', from, message);
  });
});

function leaveRoom(socket) {
  if (!socket.room) {
    return;
  }

  var id = socket.id;
  var room = socket.room;
  console.log(id, 'leaves', room);
  socket.broadcast.to(room).emit('leave', id);
  socket.leave(room);
  socket.room = null;
}
