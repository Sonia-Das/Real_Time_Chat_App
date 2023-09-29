const moment = require('moment');
const RoomModel = require('../models/room.js');
const ChatModel = require('../models/chat.js');

async function updateChats(roomId, username, text){
  const new_chat = new ChatModel({
    roomId: roomId,
    text: text,
    username: username,
    time: moment().format("h:mm a"),
  });
  // console.log(new_chat);
  await new_chat.save();
  let curr_chat = new_chat;
  let curr_room = await RoomModel.findOne({ _id: roomId });
  curr_room.chats = [...curr_room.chats, curr_chat._id];
  await curr_room.save();

  let chatFinal = {
    username,
    text,
    time: moment().format("h:mm a"),
  };
  return chatFinal;
};

module.exports = updateChats;