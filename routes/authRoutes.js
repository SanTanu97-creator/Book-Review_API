import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../utils/validators.js';


const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', validateSignup, signupUser);

// @route   POST /api/auth/login
// @desc    Login and get JWT token
router.post('/login', validateLogin, loginUser);

export default router;
