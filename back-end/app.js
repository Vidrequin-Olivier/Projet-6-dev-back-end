require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');
const mongooseConnect = process.env.MONGOOSE_CONNECT;

mongoose.connect(mongooseConnect,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log('Connexion à MongoDB réussie !'))
 .catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;