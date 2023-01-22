import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Invalid email address. Please enter a valid email.').isEmail(),
  body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
  body('fullName', 'Invalid name format. Please enter your full name.').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid image URL format. Please enter a valid image URL.').optional().isURL(),
];
