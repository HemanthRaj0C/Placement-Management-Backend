const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../../schema/Users/User');

router.post('/userRegister', async (req, res) => {
    const { studentID, name, email, password, branch } = req.body;
    if (!studentID || !name || !email || !password || !branch) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new User({ studentID, name, email, password: hashedPassword, branch });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;