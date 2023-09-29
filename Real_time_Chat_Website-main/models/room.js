const mongoose = require('mongoose');

const Schema = mongoose.Schema; 
// const ChatModel = require('./models/chat');

const roomSchema = Schema({
  roomName: { type: String },
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
});
const RoomModel = mongoose.model("Room", roomSchema);
module.exports = RoomModel;