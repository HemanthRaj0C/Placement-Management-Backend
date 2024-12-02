const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: Number,
        required: true,
        unique: true
    },
    degree: {
        type: String,
        enum: ['B.E', 'B.Tech', 'M.Tech', 'PhD'],
        required: true
    },
    degreeStatus:{
        type: String,
        enum: ['Pursuing', 'Completed'],
        required: true
    },
    highestQualification: {
        type: String,
        enum: ['Higher Secondary', 'Diploma', 'Under Graduation', 'Post Graduation', 'PhD'],
        required: true
    },
    technicalSkills: [String],
    otherSkills: [String],
    experience: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: true
    },
    projectLinks: [String] //GitHub Link

});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;