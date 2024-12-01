const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
    const recruiterToken = req.header('recruiterToken');
    if (!recruiterToken) {
        return res.status(401).json({ message: 'No Token Found' });
    }
    try {
        const decoded = jwt.verify(recruiterToken, process.env.JWT_SECRET);
        req.recruiterToken = recruiterToken;
        req.recruiterID = decoded.recruiterID;
        req.email = decoded.email;
        req.recruiter = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}