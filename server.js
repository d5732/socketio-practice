const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const uuidv4 = require("uuid").v4;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    socket.uuid = uuidv4();
    console.log(`${socket.uuid} connected`);
    socket.join("lobby");
    socket.room = "lobby";
    socket.on("chat message", (msg) => {
        switch (msg) {
            case "lobby":
                socket.leave(socket.room);
                socket.join("lobby");
                socket.room = "lobby";
                io.to("lobby").emit(
                    "chat message",
                    `${socket.uuid} has joined ${socket.room}`
                );
                break;
            case "game1":
                socket.leave(socket.room);
                socket.join("game1");
                socket.room = "game1";
                io.to("game1").emit(
                    "chat message",
                    `${socket.uuid} has joined ${socket.room}`
                );
                break;
            case "game2":
                socket.leave(socket.room);
                socket.join("game2");
                socket.room = "game2";
                io.to("game2").emit(
                    "chat message",
                    `${socket.uuid} has joined ${socket.room}`
                );
                break;
            default:
                io.to(socket.room).emit(
                    "chat message",
                    `${socket.uuid}: ${msg}`
                );
        }
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
