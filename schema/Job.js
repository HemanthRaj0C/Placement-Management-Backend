const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    
    jobID:{
        type: String,
        required: true,
        unique: true
    },
    companyName: String,
    jobTitle: String,
    jobDescription: String,
    jobLocation: String,
    jobLocationType: {
        type: String,
        enum: ['On-Site', 'Remote'],
        required: true
    },
    jobRole: String,
    jobType: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Internship'],
        required: true
    },
    eligibilityCriteria: String,
    ctc: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastDateToApply: Date,

});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;