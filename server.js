const app = require('express')();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/product-catalog';

mongoose.connect(MONGO_URI).then(() => {
  console.log('server running on port', PORT);
}).catch(err => {
  console.error('DB connection error:', err);
});

