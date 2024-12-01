const mongoose = require('mongoose');

const RecruitersSchema = new mongoose.Schema({
    recruiterID:{
        type: String,
        required: true,
        unique: true
    },
    name: String,
    companyName: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: String
});

const Recruiters = mongoose.model('Recruiters', RecruitersSchema);
module.exports = Recruiters;