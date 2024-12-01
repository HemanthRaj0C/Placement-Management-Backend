const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const Recruiter = require('../../schema/Recruiters/Recruiters');

router.post('/recruiterLogin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id:recruiter._id, email: recruiter.email, recruiterID:recruiter.recruiterID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
});

module.exports = router;