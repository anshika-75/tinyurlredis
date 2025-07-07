const express = require('express');
const Routes = require('./Routes/sign');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const PORT = 3000;


  app.use(express.json());
  app.use(cookieParser());

app.use('/api' , Routes )

app.get('/All' , (req,res) => {
   res.send('HELLO')});

mongoose.connect('mongodb://127.0.0.1:27017/anshika')
      .then(() => console.log('MongoDB connected successfully!'))
      .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT , () => console.log(`server is running on port ${PORT}`));
