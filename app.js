const express = require('express');
const path = require('path');
const socketIo = require('socket.io');

const app = express();

//environment variable
require('dotenv').config();
const PORT = process.env.PORT || 8080

//public file
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', (req, res) => {
//     res.sendFile('index.html')
// })



const server = app.listen(PORT, () => {
    console.log(`server connected successfully with port ${PORT}`);
})
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.emit('message', "Welcome to chatCord")
    socket.broadcast.emit('message', 'A user has joined')
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    })
})