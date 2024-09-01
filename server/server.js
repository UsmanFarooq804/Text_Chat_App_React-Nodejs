const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../client/build')));

const usersInRooms = {}; // Maps room names to sets of usernames

io.on('connection', (socket) => {
    console.log('A user connected');

    let currentRoom;
    let username;

    socket.on('joinRoom', ({ room, username: userName }) => {
        username = userName;
        currentRoom = room;

        socket.join(room);

        if (!usersInRooms[room]) {
            usersInRooms[room] = new Set();
        }

        if (!usersInRooms[room].has(username)) {
            usersInRooms[room].add(username);
            io.to(room).emit('message', {
                username: 'System',
                message: `A new user has joined the room: ${username}`
            });
        }

        socket.emit('message', {
            username: 'System',
            message: `Welcome to the room: ${room}`
        });
    });

    socket.on('changeUsername', ({ room, oldUsername, newUsername }) => {
        if (usersInRooms[room]) {
            usersInRooms[room].delete(oldUsername);
            usersInRooms[room].add(newUsername);
            io.to(room).emit('message', {
                username: 'System',
                message: `${oldUsername} changed their username to ${newUsername}`
            });
        }
    });

    socket.on('chatMessage', ({ room, userId, username, message }) => {
        io.to(room).emit('message', { userId, username, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        if (currentRoom && username) {
            if (usersInRooms[currentRoom]) {
                usersInRooms[currentRoom].delete(username);
                io.to(currentRoom).emit('message', {
                    username: 'System',
                    message: `${username} has left the room`
                });
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
