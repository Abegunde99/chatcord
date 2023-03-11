const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const formatMessages = require('./utils/message');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();

//environment variable
require('dotenv').config();
const PORT = process.env.PORT || 8080

//public file
app.use(express.static(path.join(__dirname, 'public')));



const botName = "chatCord"

const server = app.listen(PORT, () => {
    console.log(`server connected successfully with port ${PORT}`);
})
const io = socketIo(server);

io.on('connection', (socket) => {
    //listen for the joinRoom
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        //join room
        socket.join(user.room);

        //emit the welcome message to any user that joined
        socket.emit('message', formatMessages(botName, "Welcome to chatCord")) 
        
        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has joined`)) 

        //send the room and users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
            
        })
       
    })

    //listen for the chatMessage
    socket.on('message', (msg) => {
        const user = getCurrentUser(socket.id)
        //emit that message to all clients
        io.to(user.room).emit('message', formatMessages(user.username, msg)) 
    })
    

    //listen for a disconnect event
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`)); 
            
             //send the room and users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
                
            })
        }
    })
})