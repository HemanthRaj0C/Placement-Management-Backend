const express = require('express');
const verifyRecruiterToken = require('../../middleware/verifyRecruiterToken');
const RecruiterProfile = require('../../schema/Recruiters/RecruiterProfile');
const router = express.Router();

router.get('/recruiterProfile', verifyRecruiterToken, async (req, res) => {
    const recruiterID = req.recruiterID;
    if(!recruiterID){
        return res.status(401).send('Unauthorized');
    }
    const recruiterProfile = await RecruiterProfile.find({recruiterID: recruiterID});
    if(recruiterProfile.length === 0){
        return res.status(400).json({message:'No Recruiter found'});
    }
    res.status(200).json(recruiterProfile);
});

router.post('/recruiterProfile', verifyRecruiterToken, async (req, res) => {
    const recruiterID = req.recruiterID;
    const { companyName, companyEmail, companyAbout, companyHeadquarters, companyIndustry, companyType, companyLinkedIn, companyWebsite } = req.body;
    if(!companyName || !companyEmail || !companyAbout || !companyHeadquarters || !companyIndustry || !companyType || !companyLinkedIn || !companyWebsite){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    try {
        await RecruiterProfile.findOneAndUpdate(
            { companyName:companyName, companyEmail: companyEmail },
            {
                companyName, 
                companyEmail, 
                companyAbout, 
                companyHeadquarters, 
                companyIndustry, 
                companyType, 
                companyLinkedIn, 
                companyWebsite, 
                recruiterID
            },
            { 
                new: true,
                upsert: true
            }
        );
        
        res.status(200).json({message: 'Recruiter profile updated successfully'});
    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
            error
        });
    }
});

module.exports = router;