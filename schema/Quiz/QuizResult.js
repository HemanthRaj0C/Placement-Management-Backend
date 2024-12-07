const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    quizID: {
        type: String,
        required: true
    },
    jobID: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);