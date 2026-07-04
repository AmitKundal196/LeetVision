import mongoose from 'mongoose';

const OnboardingSchema = new mongoose.Schema({
  leetcodeUsername: { type: String, trim: true, default: '' },
  targetCompany: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'JavaScript' },
  dailyGoal: { type: Number, default: 3 },
  interviewDate: { type: Date, default: null }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false }, // optional if logged in via OAuth
  name: { type: String, default: '' },
  provider: { type: String, default: 'email' }, // email, google, github
  providerId: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  onboarding: { type: OnboardingSchema, default: () => ({}) },
  isOnboarded: { type: Boolean, default: false },
  refreshToken: { type: String, default: '' },
  rememberMe: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Avoid compile error on hot reloads
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
