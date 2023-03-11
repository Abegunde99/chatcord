const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const room_name = document.getElementById('room-name');
const ul = document.getElementById('users')
// const { addUsersList } = require('../../utils/userNames');

let socket = io();


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room);
socket.emit('joinRoom', {username, room}) //emit username and room 

socket.on('message', message => {
    addMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight; //making the scrollTop to be the scrollHeight
})

socket.on('roomUsers', ({ room, users }) => {
    room_name.innerText = room;

    addUsersList(users)
    
})


function addUsersList(users) {
    ul.innerHTML = 
    `
    ${users.map(user => `<li>${user.username}</li>`).join(' ')}
   `
};

const addMessage = function (msg) {
    const chatArea = document.querySelector('.chat-messages');
    
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'message');

    newDiv.innerHTML = 
    `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
    ${msg.message}
    </p>
    `
    chatArea.appendChild(newDiv)
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let chat = e.target['msg'].value

    //emit chat message
    socket.emit('message', chat)
    e.target['msg'].value = ''
})