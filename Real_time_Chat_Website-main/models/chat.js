const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const chatSchema = Schema({
  roomId: { type: mongoose.Types.ObjectId },
  text: { type: String},
  username: { type: String, required: true },
  time: { type: String, required: true },
});
const ChatModel = mongoose.model("Chat", chatSchema);

module.exports = ChatModel;