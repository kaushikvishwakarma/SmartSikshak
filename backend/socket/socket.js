import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const app =express();


// Setup server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Store connected users
let users = {};

// Socket.IO events
io.on('connection', (socket) => {
  console.log("User connected", socket.id);

  socket.on('register', (userId) => {
    users[userId] = socket.id;
  });
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("newMessage", (message) => {
    const chatId = message?.chat?._id;
    socket.to(chatId).emit("messageReceived", message);
  });

  

  socket.on('disconnect', () => {
    for (let id in users) {
      if (users[id] === socket.id) delete users[id];
    }
    console.log("User disconnected", socket.id);
  });
});

export { io,app,server };
