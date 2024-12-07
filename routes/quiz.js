const express = require('express');
const router = express.Router();

const Quiz = require('../schema/Quiz/Quiz');
const QuizResult = require('../schema/Quiz/QuizResult');
const Job = require('../schema/Jobs/Job');
const User = require('../schema/Users/User');
const Recruiters = require('../schema/Recruiters/Recruiters');

const verifyRecruiterToken = require('../middleware/verifyRecruiterToken');
const verifyUserToken = require('../middleware/verifyUserToken');

// Create a quiz for a specific job
router.post('/createQuiz', verifyRecruiterToken, async (req, res) => {
    try {
        const recruiterEmail = req.email;
        const recruiter = await Recruiters.findOne({ email: recruiterEmail });
        
        const { 
            jobID, 
            quizTitle, 
            questions, 
            passingPercentage 
        } = req.body;

        const job = await Job.findOne({ jobID });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const quizID = `QUIZ-${Date.now()}`;

        const totalMarks = questions.reduce((sum, q) => sum + (q.points || 1), 0);

        const quiz = new Quiz({
            quizID,
            jobID,
            quizTitle,
            postedBy: recruiter.name,
            questions,
            passingPercentage,
            totalQuestions: questions.length,
            totalMarks
        });

        await quiz.save();

        res.status(201).json({ 
            message: 'Quiz created successfully', 
            quizID: quiz.quizID 
        });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getQuiz/:jobID', verifyUserToken, async (req, res) => {
    try {
        const { jobID } = req.params;
        const quiz = await Quiz.findOne({ jobID }).select('-questions.options.isCorrect');
        
        if (!quiz) {
            return res.status(404).json({ message: 'No quiz found for this job' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/submitQuiz', verifyUserToken, async (req, res) => {
    try {
        const { quizID, jobID, answers } = req.body;
        const studentID = req.studentID;

        const quiz = await Quiz.findOne({ quizID });
        const user = await User.findOne({ studentID });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        const processedAnswers = quiz.questions.map((question, index) => {
            const userAnswer = answers[index] || '';
            
            const correctOption = question.options.find(opt => opt.isCorrect);
            
            const isCorrect = correctOption && userAnswer === correctOption.text;
            
            if (isCorrect) {
                score += question.points || 1;
            }

            return {
                questionText: question.questionText,
                userAnswer,
                correctAnswer: correctOption ? correctOption.text : null,
                isCorrect
            };
        });

        const percentage = (score / quiz.totalMarks) * 100;
        const passed = percentage >= quiz.passingPercentage;

        const quizResult = new QuizResult({
            quizID,
            jobID,
            studentID,
            studentName: user.name,
            score,
            totalMarks: quiz.totalMarks,
            percentage,
            passed
        });

        await quizResult.save();

        res.status(200).json({
            message: 'Quiz submitted successfully',
            result: {
                score,
                totalMarks: quiz.totalMarks,
                percentage,
                passed,
                answers: processedAnswers
            }
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/quizResults', verifyRecruiterToken, async (req, res) => {
    try {
        const recruiterEmail = req.email;
        const recruiter = await Recruiters.findOne({ email: recruiterEmail });
        
        const jobs = await Job.find({ postedBy: recruiter.name });
        const jobIDs = jobs.map(job => job.jobID);

        const quizResults = await QuizResult.find({ jobID: { $in: jobIDs } });

        res.status(200).json(quizResults);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/quizResults/:jobID', verifyRecruiterToken, async (req, res) => {
    try {
        const jobID = req.params.jobID;
        const recruiterEmail = req.email;
        const recruiter = await Recruiters.findOne({ email: recruiterEmail });
        const job = await Job.findOne({ 
            jobID: jobID, 
            postedBy: recruiter.name
        });
        if (!job) {
            return res.status(403).json({ message: "Unauthorized to view these results" });
        }

        const quizResults = await QuizResult.find({ jobID: jobID })
            .sort({ submittedAt: -1 }); // Most recent first

        res.json(quizResults);

    } catch (error) {
        console.error('Error in quiz results:', error);
        res.status(500).json({ message: "Error fetching quiz results", error: error.message });
    }
});

module.exports = router;