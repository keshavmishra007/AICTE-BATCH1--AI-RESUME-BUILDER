import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: String,
    jobRole: String,
    jobDescription: String,
    content: String
  },
  { timestamps: true }
);

export const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);
