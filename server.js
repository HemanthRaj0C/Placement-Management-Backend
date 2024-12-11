const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app= express();
dotenv.config();
const userLogin = require('./routes/user/userLogin');
const userRegister = require('./routes/user/userRegister');
const jobs = require('./routes/job/jobs');
const userProfiles = require('./routes/user/userProfile');
const fileUpload = require('./routes/file/fileUpload')
const recruiterLogin = require('./routes/recruiter/recruiterLogin');
const recruiterRegister = require('./routes/recruiter/recruiterRegister');
const recruiterProfile = require('./routes/recruiter/recruiterProfile');
const quiz = require('./routes/quiz');
const interview = require('./routes/interview');

app.use(cors());
app.use(express.json());

app.use('/api', userLogin);
app.use('/api', userRegister);
app.use('/api', jobs);
app.use('/api', userProfiles);
app.use('/api', fileUpload);
app.use('/api', recruiterLogin);
app.use('/api', recruiterRegister);
app.use('/api', recruiterProfile);
app.use('/api', interview);
app.use('/api', quiz);

mongoose.connect('mongodb://localhost:27017/placement-management', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => { 
  console.log('Connected to MongoDB');
})
.catch((err) => { 
  console.error('Error connecting to MongoDB', err);
  console.error('Full error details:', JSON.stringify(err, null, 2));
  console.error('Detailed error message:', err.message);
  console.error('Error stack:', err.stack);
  process.exit(1);
});

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});