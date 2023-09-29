const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const userSchema = Schema({
    name: { type: String, required: true },
  });
  const UserModel = mongoose.model("User", userSchema);

  module.exports = UserModel;