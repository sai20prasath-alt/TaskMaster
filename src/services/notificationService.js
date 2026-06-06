const { Server } = require('socket.io');

let ioInstance;

function initNotifications(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  ioInstance.on('connection', () => {});
}

function notify(event, payload) {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

module.exports = {
  initNotifications,
  notify
};
