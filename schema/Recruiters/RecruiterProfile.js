const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    companyAbout: {
        type: String,
        required: true
    },
    companyHeadquarters: {
        type: String,
        required: true
    },
    companyIndustry: {
        type: String,
        required: true
    },
    companyType: {
        type: String,
        enum: ['Startup', 'Mid-Size', 'Enterprise'],
        required: true
    },
    companyLinkedIn: {
        type: String,
        required: true, 
        unique: true
    },
    companyWebsite: {
        type: String,
        required: true, 
        unique: true
    },
    recruiterID: {
        type: String,
        ref: 'Recruiter',
        unique: true,
        required: true
    }
});

const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);
module.exports = RecruiterProfile;