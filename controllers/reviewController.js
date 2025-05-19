import Review from '../models/Review.js';

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for a book
 * @access  Private (Authenticated users)
 */
export const addReview = async (req, res, next) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Check if the user has already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};


/**
 * @route   PUT /api/reviews/:id
 * @desc    Update an existing review
 * @access  Private (Review owner only)
 */
export const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Authorization check (only owner can update)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update fields if provided
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.json(review);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Review owner only)
 */
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Only review owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reviews/book/:bookId?page=&limit=
 * @desc    Get all reviews for a specific book (with pagination)
 * @access  Public
 */
export const getReviewsForBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ book: bookId });

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
