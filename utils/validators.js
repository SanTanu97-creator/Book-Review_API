// Validator middleware for request body fields
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Name, email, and password are required'));
  }
  next();
};

//  Validator middleware for login inputs
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return next(new Error('Email and password are required'));
  }
  next();
};

// Validator middleware for adding a new Book
export const validateBook = (req, res, next) => {
  const { title, author, genre } = req.body;
  if (!title || !author || !genre) {
    res.status(400);
    return next(new Error('Title, author, and genre are required'));
  }
  next();
};

// Validator middleware for adding a new review
export const validateAddReview = (req, res, next) => {
  const { bookId, rating, comment } = req.body;
  if (!bookId) {
    res.status(400);
    return next(new Error('Book ID is required'));
  }
  if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
    res.status(400);
    return next(new Error('Rating must be a number between 1 and 5'));
  }
  next();
};

// Validator middleware for updating a review
export const validateUpdateReview = (req, res, next) => {
  const { rating, comment } = req.body;

  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    res.status(400);
    return next(new Error('If provided, rating must be a number between 1 and 5'));
  }
  next();
};
