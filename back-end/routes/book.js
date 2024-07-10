const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/bestrating', bookController.bestRating);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.post('/', auth, multer, bookController.createBook);
router.put('/:id', auth, multer, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;