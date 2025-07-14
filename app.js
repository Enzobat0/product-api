const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

//Error handling middleware
app.use(errorHandler);

module.exports = app;