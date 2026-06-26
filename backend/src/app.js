import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import coverLetterRoutes from './routes/coverletter.routes.js';
import atsRoutes from './routes/ats.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'careerforge-backend' });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/resume', resumeRoutes);
app.use('/coverletter', coverLetterRoutes);
app.use('/ats', atsRoutes);
app.use('/portfolio', portfolioRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
