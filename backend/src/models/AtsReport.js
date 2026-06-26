import mongoose from 'mongoose';

const atsReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: String,
    overallScore: Number,
    keywordScore: Number,
    formattingScore: Number,
    suggestions: [String],
    missingSkills: [String]
  },
  { timestamps: true }
);

export const AtsReport = mongoose.model('AtsReport', atsReportSchema);
