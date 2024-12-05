const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    applicationID:{
        type: Number,
        unique: true,
        default: function() {
            return Math.floor(Math.random() * 1000);
        }
    },
    jobID:{
        type: String,
        ref: 'Job',
        required: true
    },
    studentID:{
        type: String,
        ref: 'User',
        required: true
    },
    name: String,
    jobTitle:String,
    companyName: String,
    applicationStatus: {
        type:String,
        enum:['Applied', 'Shortlisted', 'Rejected', 'Hired'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);
module.exports = JobApplication;