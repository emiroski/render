const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let players = {};

io.on('connection', (socket) => {
    players[socket.id] = {
        id: socket.id,
        x: 0, y: 1, z: 0, ry: 0,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (data) => {
        if (players[socket.id]) {
            Object.assign(players[socket.id], data);
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port ' + PORT);
});