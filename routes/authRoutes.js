
const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    sendTestEmail
} = require('../controllers/authController');

const { body } = require('express-validator');

// Registration API
router.post(
    '/register',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required'),

        body('email')
            .isEmail()
            .withMessage('Enter a valid email')
            .normalizeEmail(),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    registerUser
);

// Login API
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid email')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    loginUser
);
router.post('/test-email', sendTestEmail);
module.exports = router;
