const socketio = require("socket.io");
const http = require("http");

const express = require("express");
const app = express();

const path = require("path");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const { addUser, removeUser, getUser } = require("./utils/users");

const io = socketio(server);
io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${user.username} has joined`));
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      const user = getUser(socket.id);
      return callback("Strong language not allowed here");
    }
    io.to(user.room).emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left the chat`)
      );
    }
  });
});

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log("server is running on port ", port);
});
