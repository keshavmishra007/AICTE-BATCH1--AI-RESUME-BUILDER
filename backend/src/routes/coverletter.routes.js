import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { CoverLetter } from '../models/CoverLetter.js';
import { Profile } from '../models/Profile.js';
import { generateCoverLetter } from '../services/aiClient.js';
import { streamCoverLetterPdf } from '../utils/pdf.js';

const router = express.Router();

router.use(protect);

router.post(
  '/generate',
  [
    body('companyName').trim().notEmpty(),
    body('jobRole').trim().notEmpty(),
    body('jobDescription').trim().isLength({ min: 20 })
  ],
  validate,
  async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      const result = await generateCoverLetter({
        profile,
        company_name: req.body.companyName,
        job_role: req.body.jobRole,
        job_description: req.body.jobDescription
      });
      const letter = await CoverLetter.create({
        user: req.user._id,
        companyName: req.body.companyName,
        jobRole: req.body.jobRole,
        jobDescription: req.body.jobDescription,
        content: result.cover_letter
      });
      res.status(201).json(letter);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id/download', async (req, res, next) => {
  try {
    const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id });
    if (!letter) {
      const error = new Error('Cover letter not found');
      error.statusCode = 404;
      throw error;
    }
    streamCoverLetterPdf(res, letter);
  } catch (error) {
    next(error);
  }
});

export default router;
