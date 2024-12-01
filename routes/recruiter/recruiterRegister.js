const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const Recruiter = require('../../schema/Recruiters/Recruiters');

router.post('/recruiterRegister', async (req, res) => {
    const { recruiterID, name, companyName, email, password } = req.body;
    if (!recruiterID || !name || !companyName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const existingRecruiter = await Recruiter.findOne({ email });
    if(existingRecruiter){
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const recruiter = new Recruiter({ recruiterID, name, companyName, email, password: hashedPassword });
    await recruiter.save();
    res.status(201).json({ message: 'Recruiter registered successfully' });
});

module.exports = router;