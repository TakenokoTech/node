const PORT = process.env.PORT || 8888;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log = require('./utils/log')

io.on('connection', (socket) => {
  log.debug('a user connected');
});
