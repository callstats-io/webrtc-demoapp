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
if (process.env.SSL == 'true') {
    var options = {
        key:    fs.readFileSync('ssl/server.key'),
        cert:   fs.readFileSync('ssl/server.crt'),
        ca:     fs.readFileSync('ssl/ca.crt'),
        requestCert:        true,
        rejectUnauthorized: false,
        passphrase: "v2ZIZj2jKUap",
    };
    server = https.createServer(options, app);
    server.listen(process.env.portSSL);
} else {
		server = http.createServer(app);
		server.listen(process.env.port);
}
var io = socketIO.listen(server);

console.log("IO created");


// functionality
io.sockets.on('connection', function (socket){

  socket.on('join', function () {
		socket.broadcast.emit('join', 'new user');
		// for a real app, would be room only (not broadcast)
		//socket.broadcast.to('game').emit('message', 'nice game');
  });

  socket.on('leave', function () {
		socket.broadcast.emit('leave', 'user left');
  });

});
