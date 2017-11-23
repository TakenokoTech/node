const express = require('express');
const log = require('./utils/log')

//===================================================
// SERVER SETUP
//===================================================
const socket = express();
const http = require('http').Server(socket);
const io = require('socket.io')(http);
http.listen(8888);

//===================================================
// IO.SOCKET SETUP
//===================================================
io.sockets.on('connection', connection);
function connection(socket) {
  console.log('... connected');
  socket.on('message',receiveMessage);
}

//===================================================
// OPARATION SETUP
//===================================================
function receiveMessage(data) {
  console.log(data)
  io.sockets.emit('receiveMessage', data)
}

module.exports = socket;