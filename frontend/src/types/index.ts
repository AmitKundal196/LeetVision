export interface OnboardingData {
  leetcodeUsername: string;
  targetCompany: string;
  preferredLanguage: string;
  dailyGoal: number;
  interviewDate: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isOnboarded: boolean;
  avatarUrl?: string;
  provider: string;
  onboarding: OnboardingData;
}

export interface SolvedStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  totalQuestions: number;
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
}

export interface Badge {
  name: string;
  icon: string;
  hoverText: string;
}

export interface LanguageStat {
  languageName: string;
  problemsSolved: number;
}

export interface TopicStat {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
  category: 'fundamental' | 'medium' | 'advanced';
}

export interface ContestHistoryItem {
  contestTitle: string;
  rating: number;
  ranking: number;
  problemsSolved: number;
  totalProblems: number;
  finishTime: number;
}

export interface Submission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  difficulty: string;
}

export interface ProfileDetails {
  realName: string;
  countryName: string;
  userAvatar: string;
  aboutMe: string;
}

export interface LeetCodeProfile {
  _id?: string;
  userId: string;
  username: string;
  solvedStats: SolvedStats;
  acceptanceRate: number;
  ranking: number;
  contestRating: number;
  globalRank: number;
  totalContestParticipants: number;
  topPercentage: number;
  attendedContestsCount: number;
  currentStreak: number;
  lastSynced: string;
  badges: Badge[];
  languageStats: LanguageStat[];
  topicStats: TopicStat[];
  contestHistory: ContestHistoryItem[];
  recentSubmissions: Submission[];
  submissionCalendar: string; // JSON string
  profileDetails: ProfileDetails;
  generatedAnalytics?: any;
}

export interface SyncLog {
  _id: string;
  userId: string;
  username: string;
  status: 'success' | 'failed';
  message: string;
  durationMs: number;
  timestamp: string;
}

export interface ServerHealth {
  status: string;
  database: {
    type: string;
    connected: boolean;
  };
  system: {
    os: string;
    platform: string;
    arch: string;
    cpus: number;
    cpuModel: string;
    loadAverage: number[];
  };
  uptime: {
    system: number;
    process: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
    percentage: number;
  };
  syncStats: {
    totalLogsCount: number;
    successCount: number;
    failureCount: number;
    averageLatencyMs: number;
  };
}
