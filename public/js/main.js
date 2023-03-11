const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

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