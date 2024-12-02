const express = require('express');
const router = express.Router();
const Interview = require('../schema/Interview');
const JobApplication = require('../schema/Jobs/JobApplication');
const Job = require('../schema/Jobs/Job');
const verifyRecruiterToken = require('../middleware/verifyRecruiterToken');
const verifyUserToken = require('../middleware/verifyUserToken');

router.post('/schedule-interview', verifyRecruiterToken, async (req, res) => {
    try {
        const { 
            applicationID, 
            interviewDate, 
            interviewTime, 
            interviewMode, 
            interviewLink 
        } = req.body;

        const application = await JobApplication.findOne({ 
            applicationID: applicationID,
            applicationStatus: 'Shortlisted'
        });

        if (!application) {
            return res.status(404).json({ message: 'Shortlisted application not found' });
        }

        const job = await Job.findOne({ jobID: application.jobID });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existingInterview = await Interview.findOne({ applicationID: applicationID });
        if (existingInterview) {
            return res.status(400).json({ message: 'Interview already scheduled' });
        }

        const interview = new Interview({
            applicationID: application.applicationID,
            studentID: application.studentID,
            jobID: application.jobID,
            name: application.name,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            interviewDate,
            interviewTime,
            interviewMode,
            interviewLink: interviewMode === 'Online' ? interviewLink : null,
            applicationStatus: 'Interview'
        });

        await interview.save();

        // application.applicationStatus = 'Interviewed';
        // await application.save();

        res.status(201).json({ 
            message: 'Interview scheduled successfully', 
            interview: interview 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error scheduling interview' });
    }
});

router.get('/interviews', verifyRecruiterToken, async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ interviewDate: 1 });
        res.json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching interviews' });
    }
});

router.get('/user-interviews', verifyUserToken, async (req, res) => {
    try {
        const interviews = await Interview.find({ 
            studentID: req.user.studentID 
        }).sort({ interviewDate: 1 });
        
        res.json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user interviews' });
    }
});

module.exports = router;