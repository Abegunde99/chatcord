const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const formatMessages = require('./utils/message');
const {userJoin, getCurrentUser} = require('./utils/users');


const app = express();

//environment variable
require('dotenv').config();
const PORT = process.env.PORT || 8080

//public file
app.use(express.static(path.join(__dirname, 'public')));



const botName = "chatChod"

const server = app.listen(PORT, () => {
    console.log(`server connected successfully with port ${PORT}`);
})
const io = socketIo(server);

io.on('connection', (socket) => {
    //listen for the joinRoom
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log(user);
        //join room
        socket.join(user.room);

        socket.emit('message', formatMessages(botName,"Welcome to chatCord")) 
        socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has joined`)) 
        
        //listen for the chatMessage
        socket.on('message', (msg) => {
            //emit that message to all clients
            io.to(user.room).emit('message', formatMessages(user.username, msg)) 
        })

        //listen for a disconnect event
        socket.on('disconnect', () => {
            io.to(user.room).emit('message', formatMessages(botName,`${user.username} has left the chat`));
        })
    })

    


})