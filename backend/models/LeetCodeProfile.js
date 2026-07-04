import mongoose from 'mongoose';

const LeetCodeProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: { type: String, required: true, trim: true, index: true },
  
  // Solved Stats
  solvedStats: {
    total: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 3300 },
    easyQuestions: { type: Number, default: 800 },
    mediumQuestions: { type: Number, default: 1600 },
    hardQuestions: { type: Number, default: 900 }
  },
  
  acceptanceRate: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  
  // Contest Stats
  contestRating: { type: Number, default: 0 },
  globalRank: { type: Number, default: 0 },
  totalContestParticipants: { type: Number, default: 0 },
  topPercentage: { type: Number, default: 100 },
  attendedContestsCount: { type: Number, default: 0 },
  
  // Activity / Streak
  currentStreak: { type: Number, default: 0 },
  lastSynced: { type: Date, default: Date.now },
  
  // Badges
  badges: [{
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
    hoverText: { type: String, default: '' }
  }],
  
  // Advanced stats arrays
  languageStats: [{
    languageName: { type: String, default: '' },
    problemsSolved: { type: Number, default: 0 }
  }],
  
  topicStats: [{
    tagName: { type: String, default: '' },
    tagSlug: { type: String, default: '' },
    problemsSolved: { type: Number, default: 0 },
    category: { type: String, default: 'fundamental' } // fundamental, medium, advanced
  }],
  
  contestHistory: [{
    contestTitle: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    totalProblems: { type: Number, default: 4 },
    finishTime: { type: Number, default: 0 }
  }],
  
  recentSubmissions: [{
    id: { type: String, default: '' },
    title: { type: String, default: '' },
    titleSlug: { type: String, default: '' },
    timestamp: { type: String, default: '' },
    status: { type: String, default: 'Accepted' },
    language: { type: String, default: '' },
    runtime: { type: String, default: '' },
    memory: { type: String, default: '' },
    difficulty: { type: String, default: '' }
  }],
  
  // Git-style calendar mapping: { "1624500000": 3, "1624586400": 1, ... }
  submissionCalendar: { type: String, default: '{}' },
  
  profileDetails: {
    realName: { type: String, default: '' },
    countryName: { type: String, default: '' },
    userAvatar: { type: String, default: '' },
    aboutMe: { type: String, default: '' }
  },
  generatedAnalytics: { type: mongoose.Schema.Types.Mixed, default: null }
}, {
  timestamps: true
});

const LeetCodeProfile = mongoose.models.LeetCodeProfile || mongoose.model('LeetCodeProfile', LeetCodeProfileSchema);
export default LeetCodeProfile;
