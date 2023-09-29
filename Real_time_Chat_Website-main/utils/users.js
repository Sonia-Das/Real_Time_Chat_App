const RoomModel = require('../models/room.js');
const UserModel = require('../models/user.js');

let users = [];

// Join user to chat
async function userJoin (id, username, room) {
  let curr_user = await UserModel.findOne({name: username});
  if(curr_user===null){
    const new_user = new UserModel({name: username});
    await new_user.save();
    curr_user = new_user;
  }

  let curr_room = await RoomModel.findOne({roomName: room});
  if(!curr_room){
    const new_room = new RoomModel({roomName: room});
    await new_room.save();
    curr_room = new_room;
  }
    
  curr_room.users = [...curr_room.users, curr_user._id];
  await curr_room.save();
 
  let user = {
    socketId: id,
    id: curr_user._id,
    room_id: curr_room._id,
    room: curr_room.roomName,
    username: curr_user.name,
  };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.socketId === id);
}

// User leaves chat
async function userLeave (socketId) {
  const index = users.findIndex(user => user.socketId === socketId);
  // console.log(index);
  const userFound = users[index];

  let curr_room = await RoomModel.findOne({ _id: userFound.room_id }).populate("users");
  if (curr_room === null) {
    return;
  }
  const indexRoom = curr_room.users.findIndex(
    (user) => String(user._id) === String(userFound.id)
  );
  if (indexRoom !== -1) {
    // return users.splice(index, 1)[0];
    const usersArray = [...curr_room.users];
    usersArray.splice(indexRoom, 1);
    curr_room.users = [...usersArray];
    await curr_room.save();
    return userFound;
  }
}

// Get room users
async function getRoomUsers(room_id) {
  let curr_room = await RoomModel.findOne({_id: room_id}).populate("users");
  if(curr_room===null){
    return;
  }
  return curr_room.users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
