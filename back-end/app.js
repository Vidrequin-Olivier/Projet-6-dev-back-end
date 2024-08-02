const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

// Charge les variables d'environnement
require('dotenv').config();

// Utilise la variable d'environnement pour la connexion MongoDB
// Problème à résoudre: mongooseConnect renvoie undefined: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined".
const mongooseConnect = process.env.MONGOOSE_CONNECT;
// console.log("mongooseConnect = ", mongooseConnect);
// console.log("process.env = ", process.env);
console.log("process.env.S3_BUCKET = ", process.env.S3_BUCKET);

// Connection à MongoDB
mongoose.connect(mongooseConnect,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log('Connexion à MongoDB réussie !'))
 .catch((error) => console.log('Connexion à MongoDB échouée !', error));


// mongoose.connect('mongodb+srv://exercice:d2YmkDSc9pF.D@cluster0.dihitit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//   { useNewUrlParser: true,
//     useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));

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