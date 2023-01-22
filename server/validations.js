import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Invalid email address. Please enter a valid email.').isEmail(),
  body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
  body('fullName', 'Invalid name format. Please enter your full name.').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid image URL format. Please enter a valid image URL.').optional().isURL(),
];


export const loginValidator = [
  body('email', 'Invalid email address. Please enter a valid email.').isEmail(),
  body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
]

export const postCreateValidator = [
  body('title', 'Please enter a valid title. Title should be at least 5 characters long').isLength({ min: 5 }).isString(),
  body('text', 'Post content should be at least 10 characters long.').isLength({ min: 10 }).isString(),
  body('tags', 'Please select a valid tags for this post.').optional().isArray(),
  body('imageUrl', 'Invalid image URL format. Please enter a valid image URL.').optional().isString(),
]