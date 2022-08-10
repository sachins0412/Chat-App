const socketio = require("socket.io");
const http = require("http");

const express = require("express");
const app = express();

const path = require("path");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketio(server);
io.on("connection", (socket) => {
  console.log("new connection");

  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "a new user has joined");
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", ({ latitude, longitude }) => {
    io.emit("message", `https://google.com/maps?q=${latitude},${longitude}`);
  });

  socket.on("disconnect", () => {
    io.emit("message", "a user has left the chat");
  });
});

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log("server is running on port ", port);
});
