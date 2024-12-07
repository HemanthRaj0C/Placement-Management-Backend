const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    quizID: {
        type: String,
        required: true,
        unique: true
    },
    jobID: {
        type: String,
        required: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        points: {
            type: Number,
            default: 1
        }
    }],
    passingPercentage: {
        type: Number,
        default: 50
    },
    totalQuestions: {
        type: Number
    },
    totalMarks: {
        type: Number
    },
    postedBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);