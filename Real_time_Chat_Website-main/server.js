const express = require('express');
const http = require('http');

//connect to mongo db
const mongoose = require('mongoose');
const dbURI = '' //Link to your database and put the connection string here.
mongoose.connect(dbURI)
.then(() => console.log('connected to db'))
.catch((err) => console.log(err));


const socketio = require('socket.io');
const loadMessages = require('./utils/loadMessages');
const chatMessage = require('./utils/updateChats');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
  } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Serving static files
app.use(express.static('public'));
const PORT = 3000 || process.env.PORT;
// const botName = "QuikBot";
//Run when client connects
io.on('connection', async (socket) => {
    
    socket.on('JoinRoom', async ({username, room}) => {
        const user = await userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome current user
        //socket.emit('message', formatMessage(botName, "Welcome to ChatVerse!!"));//emits to the single client that's connecting

        socket.emit("loadMessages", await loadMessages(user.room_id));

        //Broadcast when user connects
        //broadcast.emit() means  emit to everybody except the user that is connecting.
        // socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send all users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: await getRoomUsers(user.room_id),
        });

    });

    //Listen for chat message
    socket.on('chatMessage', async (msg) => {
        //console.log(msg);
        const user = getCurrentUser(socket.id);
        //console.log(user);
        io.to(user.room).emit('message', await chatMessage(user.room_id, user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', async() => {
        const user = await userLeave(socket.id);
        
        if(user){
            // io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
             //Send all users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: await getRoomUsers(user.room_id),
            });
        }
       
    });
});



server.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

