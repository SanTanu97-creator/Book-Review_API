import express from 'express';
import {
  addBook,
  getAllBooks,
  getBookById,
  searchBooks,
} from '../controllers/bookController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBook } from '../utils/validators.js';

const router = express.Router();

// @route   POST /api/books
// @desc    Add a new book (Authenticated)
router.post('/', protect, validateBook, addBook);

// @route   GET /api/books
// @desc    Get all books with pagination and optional filters
router.get('/', getAllBooks);

// @route   GET /api/search?query=...
// @desc    Search books by title or author
router.get('/search', searchBooks);

// @route   GET /api/books/:id
// @desc    Get a single book by ID with average rating and reviews
router.get('/:id', getBookById);

export default router;
