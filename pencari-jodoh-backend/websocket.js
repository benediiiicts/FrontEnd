const { Server } = require("socket.io");
const initializeChat = require('./controllers/chatController');

/**
 menerima instance server http
 instance server HTTP dari Node.js.
 @param {import('http').Server} server
 */

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // untuk menangani koneksi WebSocket
  io.on('connection', (socket) => {
    // Saat ada user baru terhubung, langsung serahkan ke controller untuk dikelola
    initializeChat(io, socket);
  });
}

module.exports = setupWebSocket;