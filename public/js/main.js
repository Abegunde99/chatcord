const chatForm = document.getElementById('chat-form')

let socket = io();

socket.on('message', message => {
    console.log(message);
})

chatForm.addEventListener('submit', (e) => {
    const chat = e.target('msg').value
    console.log(chat);
})