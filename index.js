var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var socketIO = require('socket.io');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

// variables
var app = express();
var server;

var fileDir = 'build';
var fileDefault = 'index.html';

var dir = path.join(__dirname, fileDir);
var def = path.join(dir, fileDefault);

fs.exists = fs.exists || require('path').exists;
var privKey = null;
privKey = fs.readFileSync('ssl/ecpriv.key');

// offered files
app.use(express.static(dir));

// not found in static files, so default to index.html
app.use((req, res) => res.sendFile(def));

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

  socket.on('leave', function() {
    leaveRoom(socket);
  });

  socket.on('message', function(to, message) {
    var from = socket.id;
    socket.to(to).emit('message', from, message);
  });

  socket.on('generateToken', function(data, callback) {
    var userName = data;
    // First generate the JWTID
    crypto.randomBytes(48, function(err, buffer) {
      if (err) {
        return callback(err);
      }
      var tokenid = buffer.toString('hex');
      var token = null;
      try {
        // Try to sign teh token
        token = jwt.sign(
          {
            userID: userName,
            appID: process.env.APPID,
            keyID: process.env.KEYID
          }, privKey,
          {
            algorithm: 'ES256',
            jwtid: tokenid,
            expiresIn: 300, // 5 minutes
            notBefore: -300 // -5 minutes
          });
      } catch (error) {
        console.log(error);
        return callback(error);
      }
      callback(null, token);
    });
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
