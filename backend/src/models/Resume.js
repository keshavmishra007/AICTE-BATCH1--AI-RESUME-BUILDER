import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    template: { type: String, enum: ['modern', 'professional', 'classic'], default: 'modern' },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    atsScore: Number
  },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', resumeSchema);
