import express from 'express';
import { body } from 'express-validator';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { validate } from '../middleware/validate.middleware.js';
import { signToken } from '../utils/token.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  async (req, res, next) => {
    try {
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        const error = new Error('Email already registered');
        error.statusCode = 409;
        throw error;
      }

      const user = await User.create(req.body);
      await Profile.create({
        user: user._id,
        personal: { fullName: user.name, email: user.email },
        skills: [],
        education: [],
        projects: [],
        experience: [],
        achievements: [],
        certifications: [],
        languages: []
      });

      res.status(201).json({
        token: signToken(user),
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await user.comparePassword(req.body.password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      res.json({
        token: signToken(user),
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
