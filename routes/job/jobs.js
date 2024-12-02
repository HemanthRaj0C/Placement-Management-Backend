const express = require('express');
const router = express.Router();

const Job = require('../../schema/Jobs/Job');
const JobApplication = require('../../schema/Jobs/JobApplication');
const User = require('../../schema/Users/User');

const verifyUserToken = require('../../middleware/verifyUserToken');
const verifyRecruiterToken = require('../../middleware/verifyRecruiterToken');
const Recruiters = require('../../schema/Recruiters/Recruiters');

router.get('/jobs', async (req, res) => {
    const jobs = await Job.find({});
    if(!jobs){
        return res.status(404).json({ message: 'No jobs found' });
    }
    if(jobs.length === 0){
        return res.status(404).json({ message: 'No jobs found' });
    }
    res.status(200).json(jobs);
})

router.get('/postedJobs', verifyRecruiterToken, async (req, res) => {
    const recruiterID = req.recruiterID;
    const recruiter = await Recruiters.findOne({recruiterID});
    const recruiterName = recruiter.name;
    const jobs = await Job.find({postedBy: recruiterName});
    if(!jobs){
        return res.status(404).json({ message: 'No jobs found' });
    }
    if(jobs.length === 0){
        return res.status(404).json({ message: 'No jobs found' });
    }
    res.status(200).json(jobs);
});

router.post('/jobs', verifyRecruiterToken, async (req, res) => {
    const recruiterToken = req.recruiterToken;
    if(!recruiterToken){
        return res.status(401).json({ message: 'No Valid Token Found' });
    }
    const recruiterEmail = req.email;
    const recruiter = await Recruiters.findOne({email: recruiterEmail});
    const recruiterName = recruiter.name;
    const { jobID, companyName, jobTitle, jobDescription, jobLocation, jobLocationType, jobRole, jobType, eligibilityCriteria, ctc, lastDateToApply } = req.body;
    if(!jobID || !companyName || !jobTitle || !jobDescription || !jobLocation || !jobLocationType || !jobRole || !jobType || !eligibilityCriteria || !ctc || !lastDateToApply){
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(jobLocationType !== 'On-Site' && jobLocationType !== 'Remote'){
        return res.status(400).json({ message: 'Invalid jobLocationType' });
    }
    if(jobType !== 'Full Time' && jobType !== 'Part Time' && jobType !== 'Internship'){
        return res.status(400).json({ message: 'Invalid jobType' });
    }
    const existingJob = await Job.findOne({ jobID });
    if(existingJob){
        return res.status(400).json({ message: 'Job already exists' });
    };
    const job = new Job({ jobID, companyName, jobTitle, jobDescription, jobLocation, jobLocationType, jobRole, jobType, eligibilityCriteria, ctc, postedBy: recruiterName, lastDateToApply });
    await job.save();
    if(!job){
        return res.status(500).json({ message: 'Error adding job' });
    }
    res.status(201).json({ message: 'Job added successfully' });
});

router.post('/applyJob', verifyUserToken, async (req, res) => {
    const { jobID } = req.body;
    const studentID = req.studentID;

    const job = await Job.findOne({jobID});
    if(!job){
        return res.status(404).json({ message: 'Job not found' });
    }
    const user = await User.findOne({studentID});
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

    const existingApplication = await JobApplication.findOne({ jobID, studentID });
    if(existingApplication){
        return res.status(400).json({ message: 'Application already exists' });
    }

    const application = new JobApplication({
         jobID, 
         studentID,
         name: user.name, 
         jobTitle: job.jobTitle, 
         companyName: job.companyName, 
         applicationStatus: 'Applied' 
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });

});

router.get('/jobApplications', verifyRecruiterToken, async (req, res) => {
    try {
        const recruiterEmail = req.email;
        const recruiter = await Recruiters.findOne({ email: recruiterEmail });
        
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }

        const jobs = await Job.find({ postedBy: recruiter.name });
        const jobIDs = jobs.map(job => job.jobID);

        // Find all applications for these jobs
        const applications = await JobApplication.find({ 
            jobID: { $in: jobIDs } 
        });

        if (applications.length === 0) {
            return res.status(404).json({ message: 'No applications found for your jobs' });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.patch('/updateApplicationStatus', verifyRecruiterToken, async (req, res) => {
    try {
        const { applicationID, applicationStatus } = req.body;
        const recruiterEmail = req.email;

        if (!applicationID || !applicationStatus) {
            return res.status(400).json({ message: 'Application ID and status are required' });
        }

        const validStatuses = ['Applied', 'Shortlisted', 'Rejected'];

        if (!validStatuses.includes(applicationStatus)) {
            return res.status(400).json({ message: 'Invalid application status' });
        }

        const application = await JobApplication.findOne({ applicationID });
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const job = await Job.findOne({ jobID: application.jobID });
        
        if (!job) {
            return res.status(404).json({ message: 'Associated job not found' });
        }

        const recruiter = await Recruiters.findOne({ email: recruiterEmail });
        if (job.postedBy !== recruiter.name) {
            return res.status(403).json({ message: 'Unauthorized to update this application' });
        }

        application.applicationStatus = applicationStatus;
        application.updatedAt = Date.now();
        
        await application.save();

        res.status(200).json({ 
            message: 'Application status updated successfully',
            application 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/appliedJobs', verifyUserToken, async (req, res)=>{
    const studentID = req.studentID;
    const appliedJobs = await JobApplication.find({studentID})
    res.status(200).json(appliedJobs);

});

module.exports = router;