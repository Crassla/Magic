//This collects the username password and email of the teachers which are used to login
//The email data can later be used to have an automatic response when succesfully added 
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  worth: {
    type: Number,
    required: true,
  },
  person_to: {
    type: String,
    required: true,
  },
  person_from: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model('cards', cardSchema);