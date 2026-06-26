import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { Profile } from '../models/Profile.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      const error = new Error('Profile not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({
      hero: {
        name: profile.personal?.fullName,
        headline: profile.personal?.headline,
        location: profile.personal?.location
      },
      about: profile.personal?.summary,
      skills: profile.skills,
      projects: profile.projects,
      education: profile.education,
      contact: {
        email: profile.personal?.email,
        phone: profile.personal?.phone,
        ...profile.links
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
