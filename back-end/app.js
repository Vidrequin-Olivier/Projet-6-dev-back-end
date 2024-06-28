const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Page d\'accueil');
});

app.post('/sign-in', (req, res) => {
  const { username, password } = req.body;
  res.send('Authentification réussie');
});

app.get('/book/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Détails du livre avec ID: ${id}`);
});

app.post('/add-book', (req, res) => {
  const newBook = req.body;
  res.send('Nouveau livre ajouté');
});

app.put('/update-book/:id', (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  res.send(`Livre avec ID: ${id} mis à jour`);
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

module.exports = app;