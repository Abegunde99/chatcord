const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

let socket = io();

socket.on('message', message => {
    addMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

const times = function () {
    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    let am_pm;
    if (hour < 12) {
        am_pm = 'am'
    } else {
        am_pm = 'pm'
        hour = hour % 12;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let time = `${hour}:${minutes}${am_pm}`
    return time
}

const addMessage = function (msg) {
    const chatArea = document.querySelector('.chat-messages');

    //getting the time
    const time = times();
    
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'message');

    newDiv.innerHTML = 
    `
    <p class="meta">Mary <span>${time}</span></p>
    <p class="text">
    ${msg}
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