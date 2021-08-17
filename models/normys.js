//This collects the username password and email of the teachers which are used to login
//The email data can later be used to have an automatic response when succesfully added 
const mongoose = require('mongoose');

const normySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true,
        unqiue: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model('normy', normySchema);