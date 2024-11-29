const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ message: 'No Token Found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.studentID = decoded.studentID;
        req.email = decoded.email;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}