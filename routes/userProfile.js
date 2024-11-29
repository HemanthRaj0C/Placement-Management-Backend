const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const UserProfile = require('../schema/UserProfile');
const router = express.Router();

router.get('/userProfile', verifyToken, async (req, res) => {

    const email = req.email;
    if(!email){
        return res.status(401).send('Unauthorized');
    }
    const userProfile = await UserProfile.find({email});
    if(userProfile.length === 0){
        return res.status(400).json({message:'User not found'});
    }
    res.status(200).json(userProfile);
});

router.post('/userProfile', verifyToken, async (req, res) => {
    const { firstName, lastName, email, mobileNumber, degree, degreeStatus, highestQualification, technicalSkills, otherSkills, experience, projectLinks } = req.body;

    if(!firstName || !lastName || !email || !mobileNumber || !degree || !degreeStatus || !highestQualification || !technicalSkills || !otherSkills || experience == undefined || !projectLinks){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    
    const tokenEmail = req.email;
    if(!tokenEmail){
        return res.status(401).json({message: 'Unauthorized'});
    }
    
    if(tokenEmail !== email){
        return res.status(401).json({message: 'Please enter the email used for registration'});
    }
    
    try {
        await UserProfile.findOneAndUpdate(
            { email: email }, 
            {
                firstName,
                lastName,
                email,
                mobileNumber,
                degree,
                degreeStatus,
                highestQualification,
                technicalSkills,
                otherSkills,
                experience,
                projectLinks,
            },
            { 
                new: true,
                upsert: true
            }
        );
        
        res.status(200).json({message: 'User profile updated successfully'});
    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
            error: error
        });
    }
});

module.exports = router;