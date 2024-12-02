const express = require('express');
const verifyToken = require('../../middleware/verifyUserToken');
const upload = require('../../config/multerConfig');
const FileUpload = require('../../schema/Files/FileUpload');
const User = require('../../schema/Users/User');
const Recruiters = require('../../schema/Recruiters/Recruiters');
const Job = require('../../schema/Jobs/Job');
const JobApplication = require('../../schema/Jobs/JobApplication');
const path = require('path');
const fs = require('fs');
const verifyRecruiterToken = require('../../middleware/verifyRecruiterToken');

const router = express.Router();

router.post('/upload-resume', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const email = req.email;
        const user = await User.findOne({email: email});
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        //Mark previous resumes as not latest
        await FileUpload.updateMany(
            { email: user.email, isLatest: true },
            { isLatest: false }
        );

        const fileUpload = new FileUpload({
            email: user.email,
            studentID: user.studentID,
            branch: user.branch,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadPath: req.file.path,
            isLatest: true
        });

        await fileUpload.save();

        res.status(200).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

router.get('/latest-resume', verifyToken, async (req, res) => {
    try {
        const email = req.email;
        const latestResume = await FileUpload.findOne({
            email: email,
            isLatest: true
        });

        if (!latestResume) {
            return res.status(404).json({ message: 'No resume found' });
        }

        res.status(200).json(latestResume);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving resume', error: error.message });
    }
});

router.get('/download-resume', verifyToken, async (req, res) => {
    try {
        const resume = await FileUpload.findOne({
            email: req.email,
            isLatest: true
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const filePath = path.resolve(resume.uploadPath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath, resume.originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ message: 'Error downloading resume' });
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Error downloading resume' });
    }
});

router.get('/appliedResume', verifyRecruiterToken, async (req, res) => {
    try {
        const email = req.email;
        const recruiter = await Recruiters.findOne({ email: email });
        
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }

        const jobs = await Job.find({ postedBy: recruiter.name });
        const jobIDs = jobs.map(job => job.jobID);

        const applications = await JobApplication.find({
            jobID: { $in: jobIDs }
        });

        const appliedResumes = await FileUpload.find({
            studentID: { $in: applications.map(application => application.studentID) }
        });

        if (appliedResumes.length === 0) {
            return res.status(404).json({ message: 'No resumes found for your job applications' });
        }

        // Send list of resumes instead of downloading
        const resumeList = appliedResumes.map(resume => ({
            _id: resume._id,
            studentID: resume.studentID,
            fileName: resume.originalName,
            uploadPath: resume.uploadPath
        }));

        res.json({ resumes: resumeList });

    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/download-resume/:resumeId', verifyRecruiterToken, async (req, res) => {
    try {
        const resume = await FileUpload.findById(req.params.resumeId);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const filePath = path.resolve(resume.uploadPath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath, resume.originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ message: 'Error downloading resume' });
            }
        });
    } catch (error) {
        console.error('Error downloading resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;