import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware.js';
import { AtsReport } from '../models/AtsReport.js';
import { analyzeResume } from '../services/aiClient.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF uploads are supported'));
    return cb(null, true);
  }
});

router.use(protect);

router.post('/analyze', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Resume PDF is required');
      error.statusCode = 400;
      throw error;
    }

    const result = await analyzeResume(req.file);
    const report = await AtsReport.create({
      user: req.user._id,
      fileName: req.file.originalname,
      overallScore: result.overall_score,
      keywordScore: result.keyword_score,
      formattingScore: result.formatting_score,
      suggestions: result.suggestions,
      missingSkills: result.missing_skills
    });
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
