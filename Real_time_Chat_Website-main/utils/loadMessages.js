const RoomModel = require('../models/room.js');

async function loadMessages(roomId) {
    const curr_room = await RoomModel.findOne({ _id: roomId }).populate("chats");
    const messages = curr_room.chats;
    return messages;
};

module.exports = loadMessages;