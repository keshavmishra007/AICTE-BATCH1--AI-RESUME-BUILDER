import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    title: String,
    organization: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String,
    technologies: [String],
    link: String
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personal: {
      fullName: String,
      headline: String,
      email: String,
      phone: String,
      location: String,
      summary: String
    },
    education: [entrySchema],
    skills: [String],
    projects: [entrySchema],
    experience: [entrySchema],
    achievements: [String],
    certifications: [entrySchema],
    languages: [String],
    links: {
      github: String,
      linkedin: String,
      portfolio: String
    }
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
