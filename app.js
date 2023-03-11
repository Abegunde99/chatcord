const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const formatMessages = require('./utils/message');


const app = express();

//environment variable
require('dotenv').config();
const PORT = process.env.PORT || 8080

//public file
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', (req, res) => {
//     res.sendFile('index.html')
// })

const botName = "chatChod"

const server = app.listen(PORT, () => {
    console.log(`server connected successfully with port ${PORT}`);
})
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.emit('message', formatMessages(botName,"Welcome to chatCord"))
    socket.broadcast.emit('message', formatMessages(botName,'A user has joined'))

    //listen for a disconnect event
    socket.on('disconnect', () => {
        io.emit('message', formatMessages(botName,'A user has left the chat'));
    })

    //listen for the chatMessage
    socket.on('message', (msg) => {
       //emit that message to all clients
       io.emit('message', formatMessages('USER', msg)) 
    })
})