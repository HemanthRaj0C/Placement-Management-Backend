const express = require('express');
const router = express.Router();

const Job = require('../schema/Job');
const JobApplication = require('../schema/JobApplication');
const User = require('../schema/User');

const verifyToken = require('../middleware/verifyToken');

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
router.post('/jobs', async (req, res) => {
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
    const job = new Job({ jobID, companyName, jobTitle, jobDescription, jobLocation, jobLocationType, jobRole, jobType, eligibilityCriteria, ctc, lastDateToApply });
    await job.save();
    if(!job){
        return res.status(500).json({ message: 'Error adding job' });
    }
    res.status(201).json({ message: 'Job added successfully' });
});

router.post('/applyJob', verifyToken, async (req, res) => {
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

router.get('/appliedJobs', verifyToken, async (req, res)=>{
    const studentID = req.studentID;
    const appliedJobs = await JobApplication.find({studentID})
    res.status(200).json(appliedJobs);

});

module.exports = router;