'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const socketIO = require('socket.io');
const logger = require('./logger');

const csiosignalingserver = (server, privKey) => {
  const io = socketIO.listen(server);
  logger.info('IO created');
  // functionality
  io.sockets.on('connection', (socket) => {
    // socket io specific events
    socket.on('join', (room) => { join(socket, room); });
    socket.on('leave', () => { leaveRoom(socket); });
    socket.on('message', (to, msg) => { message(socket, to, msg); });
    socket.on('generateToken', (data, callback) => generateToken(data, callback));
    socket.on('generateTurnToken', (data, callback) => generateTurnToken(data, callback));
    socket.on('disconnect', () => { disconnect(socket); });
  });
  // when user join to a room
  const join = (socket, room) => {
    leaveRoom(socket);
    const id = socket.id;
    logger.info(`${id} joined room`);
    socket.join(room);
    socket.room = room;
    socket.broadcast.to(room).emit('join', id);
  };
  // when user leave a room
  const leaveRoom = (socket) => {
    if (socket && !socket.room) {
      return;
    }
    const id = socket.id;
    const room = socket.room;
    logger.info(id, 'leaves', room);
    socket.broadcast.to(room).emit('leave', id);
    socket.leave(room);
    socket.room = null;
  };
  // when user disconnected
  const disconnect = (socket) => {
    logger.info(`${socket.id} disconnected.`);
    leaveRoom(socket);
  };
  // message exchange loop
  const message = (socket, to, msg) => {
    const from = socket.id;
    socket.to(to).emit('message', from, msg);
  };
  // token generation request
  const generateToken = (data, callback) => {
    const userName = data;
    crypto.randomBytes(48, function(err, buffer) {
      if (err) {
        return callback(err);
      }
      const tokenid = buffer.toString('hex');
      let token = null;
      try {
        // Try to sign teh token
        token = jwt.sign({
          userID: userName,
          appID: process.env.APPID,
          keyID: process.env.KEYID
        }, privKey, {
          algorithm: 'ES256',
          jwtid: tokenid,
          expiresIn: 300, // 5 minutes
          notBefore: -300 // -5 minutes
        });
      } catch (error) {
        logger.error(error);
        return callback(error);
      }
      callback(null, token);
    });
  };

  // turn token generation request
  const generateTurnToken = (callback) => {
    const userName = 'turnUser';
    crypto.randomBytes(48, function(err, buffer) {
      if (err) {
        return callback(err);
      }
      const tokenid = buffer.toString('hex');
      let token = null;
      try {
        // Try to sign teh token
        token = jwt.sign({
          userID: userName,
          appID: process.env.APPID,
          keyID: process.env.KEYID,
          generateTurnCredentials: true
        }, privKey, {
          algorithm: 'ES256',
          jwtid: tokenid,
          expiresIn: 300, // 5 minutes
          notBefore: -300 // -5 minutes
        });
      } catch (error) {
        logger.error(error);
        return callback(error);
      }
      callback(null, token);
    });
  };
};

module.exports = csiosignalingserver;
