const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
try {
    fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
    console.error('Error creating upload directory:', err);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const baseUploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
        const email = req.email;
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
        const userUploadDir = path.join(baseUploadDir, sanitizedEmail);
        try{
            fs.mkdirSync(userUploadDir, { recursive: true });
            cb(null, userUploadDir);
        }
        catch(err){
            console.error('Error creating user upload directory:', err);
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const email = req.email;
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
        const fileExtension = path.extname(file.originalname);
        const uniqueFilename = `${sanitizedEmail}_resume_${Date.now()}${fileExtension}`;
        cb(null, uniqueFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

module.exports = upload;