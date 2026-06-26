import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { Profile } from '../models/Profile.js';
import { Resume } from '../models/Resume.js';
import { AtsReport } from '../models/AtsReport.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const recentResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const recentAts = await AtsReport.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ profile, recentResume, recentAts });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;
