const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    studentID:{
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'],
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
