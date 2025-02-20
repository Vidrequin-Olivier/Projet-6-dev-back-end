const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  const filePath = path.join(__dirname, '../images', req.file.filename);
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-T:\.Z]/g, '');
  const filename = `${timestamp}.jpg`;
  const outputFilePath = path.join(__dirname, '../images', filename);

  sharp(filePath)
    .rotate()
    .resize(null, 1000)
    .jpeg({ mozjpeg: true })
    .toFile(outputFilePath)
    .then(() => {
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
      });
      
      book.save()
        .then(() => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
          res.status(201).json({ message: 'Nouveau livre enregistré !' });
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ error });
      }
      if (req.file) {
        const oldFilename = book.imageUrl.split('/images/')[1];
        const filePath = path.join(__dirname, '../images', req.file.filename);
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-T:\.Z]/g, '');
        const outputFilename = `${timestamp}.jpg`;
        const outputFilePath = path.join(__dirname, '../images', outputFilename);

        sharp(filePath)
          .rotate()
          .resize(null, 1000)
          .jpeg({ mozjpeg: true })
          .toFile(outputFilePath)
          .then(() => {
            fs.unlink(`images/${oldFilename}`, (err) => {
              if (err) {
                console.error(err);
              }
            });
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
              }
            });

            const updatedBook = {
              ...bookObject,
              imageUrl: `${req.protocol}://${req.get('host')}/images/${outputFilename}`,
              _id: req.params.id
            };

            Book.updateOne({ _id: req.params.id }, updatedBook)
              .then(() => res.status(200).json({ message: 'Livre modifié !' }))
              .catch(error => res.status(401).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre modifié !' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.bestRating = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'Requête refusée'});
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé'})})
            .catch(error => res.status(401).json({ error }));
        });
      };
    })
    .catch( error => {
      res.status(500).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;
  const bookId = req.params.id;

  if (!userId || rating === undefined) { return res.status(400).json({ error }) }
  if (rating < 0 || rating > 5) { return res.status(400).json({ error }) }

  Book.findOne({ _id: bookId })
      .then(book => {
          if (!book) { return res.status(404).json({ error }) }
          if (book.ratings.find(el => el.userId === userId)) { return res.status(400).json({ error }) }

          book.ratings.push({ userId, grade: rating });
          book.averageRating = book.ratings.reduce((sum, el) => sum + el.grade, 0) / book.ratings.length;

          Book.updateOne({ _id: bookId }, { ratings: book.ratings, averageRating: book.averageRating })
              .then(() => {
                  res.status(200).json(book);
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};