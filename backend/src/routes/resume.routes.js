import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { Profile } from '../models/Profile.js';
import { Resume } from '../models/Resume.js';
import { generateResume } from '../services/aiClient.js';
import { streamResumePdf } from '../utils/pdf.js';

const router = express.Router();

router.use(protect);

router.post(
  '/generate',
  [
    body('targetRole').isIn(['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'AI Engineer']),
    body('template').optional().isIn(['modern', 'professional', 'classic'])
  ],
  validate,
  async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      if (!profile) {
        const error = new Error('Complete your profile before generating a resume');
        error.statusCode = 400;
        throw error;
      }

      const content = await generateResume(profile.toObject(), req.body.targetRole);
      const resume = await Resume.create({
        user: req.user._id,
        targetRole: req.body.targetRole,
        template: req.body.template || 'modern',
        content,
        atsScore: content.ats_score || 82
      });
      res.status(201).json(resume);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/latest', async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/download', async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    const profile = await Profile.findOne({ user: req.user._id });
    if (!resume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }
    streamResumePdf(res, resume, profile);
  } catch (error) {
    next(error);
  }
});

export default router;
