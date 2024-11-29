const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'],
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    uploadPath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    isLatest: {
        type: Boolean,
        default: true
    }
});

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);
module.exports = FileUpload;