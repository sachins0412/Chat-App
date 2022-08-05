const socketio = require("socket.io");
const http = require("http");

const express = require("express");
const app = express();

const path = require("path");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", () => {
  console.log("new connection");
});

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log("server is running on port ", port);
});
