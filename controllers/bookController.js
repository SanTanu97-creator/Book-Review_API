import Book from '../models/Book.js';
import Review from '../models/Review.js';

/**
 * @route   POST /api/books
 * @desc    Add a new book
 * @access  Private (Admin or Authenticated users)
 */
export const addBook = async (req, res, next) => {
  try {
    const { title, author, genre, description } = req.body;

    const book = new Book({ title, author, genre, description });
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/books
 * @desc    Get all books with optional filters and pagination
 * @access  Public
 */
export const getAllBooks = async (req, res, next) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Apply filters if present
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const skip = (page - 1) * limit;
    const total = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/books/:id
 * @desc    Get book details by ID including average rating & paginated reviews
 * @access  Public
 */
export const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    // Pagination for reviews
    const skip = (page - 1) * limit;
    const totalReviews = await Review.countDocuments({ book: bookId });

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Calculate average rating
    const agg = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' } } },
    ]);
    const avgRating = agg.length > 0 ? agg[0].avgRating.toFixed(2) : null;

    res.json({
      book,
      averageRating: avgRating,
      reviews: {
        total: totalReviews,
        page: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
        data: reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/search/books?query=
 * @desc    Search books by title or author (partial, case-insensitive)
 * @access  Public
 */
export const searchBooks = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      res.status(400);
      throw new Error('Search query is required');
    }

    const regex = new RegExp(query, 'i');
    const filter = { $or: [{ title: regex }, { author: regex }] };

    const skip = (page - 1) * limit;
    const total = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    next(error);
  }
};
