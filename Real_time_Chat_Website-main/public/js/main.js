
const msgForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get the username & room from URL 
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join Chatroom
socket.emit('JoinRoom', {username, room});

//Message submit

msgForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    //Clear msg
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    
    //Emit message to server
    socket.emit('chatMessage', msg);
});

socket.on("loadMessages", (chatsList) =>{
    outputAllChats(chatsList);
});

//Output all chats from db
function outputAllChats(chatsList){
    chatsList.forEach((message) => {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>			
        <p class="text">
            ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    });
}

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputAllUsers(users);
});

//Add roomname to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add users to DOM
function outputAllUsers(users){
    userList.innerHTML = `${users.map((user) => `<li>${user.name}</li>`).join("")}`;
}

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>			
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        socket.disconnect();
        window.location = '../index.html';
    } else {
    }
});