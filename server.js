const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app= express();
dotenv.config();
const userLogin = require('./routes/userLogin');
const userRegister = require('./routes/userRegister');
const jobs = require('./routes/jobs');
const userProfiles = require('./routes/userProfile');
const fileUpload = require('./routes/fileUpload')

app.use(cors());
app.use(express.json());

app.use('/api', userLogin);
app.use('/api', userRegister);
app.use('/api', jobs);
app.use('/api', userProfiles);
app.use('/api', fileUpload);

mongoose.connect('mongodb://localhost:27017/placement-management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{console.log('Connected to MongoDB')})
    .catch((err)=>{console.log('Error connecting to MongoDB', err)});

const PORT = process.env.SERVER_PORT

app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});