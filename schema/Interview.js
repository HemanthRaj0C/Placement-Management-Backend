const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    applicationID: {
        type: String,
        required: true,
        ref: 'JobApplication'
    },
    studentID: {
        type: String,
        required: true,
        ref: 'User'
    },
    jobID: {
        type: String,
        required: true,
        ref: 'Job'
    },
    name: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
    interviewTime: {
        type: String,
        required: true
    },
    interviewMode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    interviewLink: {
        type: String
    },
    applicationStatus: {
        type: String,
        default: 'Interviewed',
        enum: ['Applied', 'Shortlisted', 'Interviewed', 'Rejected']
    }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);