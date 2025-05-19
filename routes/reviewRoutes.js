import express from 'express';
import {
  addReview,
  deleteReview,
  getReviewsForBook,
  updateReview,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateAddReview, validateUpdateReview } from '../utils/validators.js';

const router = express.Router();

// @route   POST /api/books/:id/reviews
// @desc    Add a review for a book (Authenticated)
router.post('/books/:id/reviews', protect, validateAddReview, addReview);

// @route   PUT /api/reviews/:id
// @desc    Update a user's own review (Authenticated)
router.put('/reviews/:id', protect,  validateUpdateReview, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a user's own review (Authenticated)
router.delete('/reviews/:id', protect, deleteReview);

// @route   GET /api/books/:bookId/reviews
// @desc    Get all reviews for a book (Public)
router.get('/books/:bookId/reviews', getReviewsForBook);

export default router;
