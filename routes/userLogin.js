const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const User = require('../schema/User');

router.post('/userLogin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id:user._id, email: user.email, studentID:user.studentID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
});

module.exports = router;