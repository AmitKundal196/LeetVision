import { calculatePatternProgress } from './patternEngine.js';
import { getStrongAndWeakTopics } from './topicEngine.js';
import { generateRecommendations } from './recommendationEngine.js';
import { getUsedLanguages } from './languageEngine.js';
import { getCompanyTagsForSubmission } from './companyEngine.js';

export function runAnalyticsEngine(profile) {
  if (!profile) return null;

  const { solvedStats, topicStats, languageStats, submissionCalendar, recentSubmissions, currentStreak } = profile;
  
  // 1. Calculate pattern progress
  const patternProgress = calculatePatternProgress(topicStats, solvedStats?.total || 1);

  // 2. Calculate strong and weak topics
  const { strongTopics, weakTopics } = getStrongAndWeakTopics(topicStats);

  // 3. Filter used languages
  const usedLanguages = getUsedLanguages(languageStats);

  // 4. Generate recommendations
  const recommendations = generateRecommendations(profile, weakTopics, patternProgress);

  // 5. Generate Developer Insights dynamically
  const cal = JSON.parse(submissionCalendar || '{}');
  const recent = recentSubmissions || [];

  // Active days count
  const activeDays = Object.keys(cal).length;

  // Monthly solved
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let monthSolved = 0;
  Object.entries(cal).forEach(([ts, val]) => {
    const date = new Date(parseInt(ts) * 1000);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      monthSolved += Number(val);
    }
  });

  // Productivity Day of Week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = Array(7).fill(0);
  Object.entries(cal).forEach(([ts, val]) => {
    const day = new Date(parseInt(ts) * 1000).getDay();
    dayCounts[day] += Number(val);
  });
  let peakDayIdx = 0;
  let maxSubmissions = 0;
  dayCounts.forEach((cnt, idx) => {
    if (cnt > maxSubmissions) {
      maxSubmissions = cnt;
      peakDayIdx = idx;
    }
  });
  const peakDay = maxSubmissions > 0 ? daysOfWeek[peakDayIdx] : 'Sunday';

  // Active Hour of Day
  const hourCounts = Array(24).fill(0);
  recent.forEach(sub => {
    if (sub.timestamp) {
      const hr = new Date(Number(sub.timestamp) * 1000).getHours();
      hourCounts[hr]++;
    }
  });
  let peakHour = 21; // Default 9 PM
  let maxHourCount = 0;
  hourCounts.forEach((cnt, hr) => {
    if (cnt > maxHourCount) {
      maxHourCount = cnt;
      peakHour = hr;
    }
  });
  const formattedHour = peakHour >= 12 ? `${peakHour % 12 || 12} PM` : `${peakHour || 12} AM`;

  const insights = [];
  if (monthSolved > 0) {
    insights.push(`You solved ${monthSolved} problems this month.`);
  } else {
    insights.push(`No submissions recorded in the current month.`);
  }

  const graphTopic = topicStats?.find(t => t.tagSlug === 'graph');
  const graphSolved = graphTopic ? graphTopic.problemsSolved : 0;
  if (graphSolved === 0) {
    insights.push('Graphs remain untouched.');
  } else {
    insights.push(`You have solved ${graphSolved} Graph problems.`);
  }

  if (currentStreak > 0) {
    insights.push(`Current streak is ${currentStreak} days.`);
  } else {
    insights.push('No active daily solved streak.');
  }

  const solvedTotal = solvedStats?.total || 0;
  if (solvedTotal < 100) {
    insights.push(`${100 - solvedTotal} problems left to reach 100.`);
  } else if (solvedTotal < 500) {
    insights.push(`${500 - solvedTotal} problems left to reach 500.`);
  } else {
    insights.push(`You have crossed ${solvedTotal} solved milestones.`);
  }

  insights.push(`Most productive day is ${peakDay}.`);
  insights.push(`Most active coding hour is ${formattedHour}.`);

  const easyRatio = solvedStats?.total > 0 ? Math.round((solvedStats.easy / solvedStats.total) * 100) : 0;
  insights.push(`Easy problems account for ${easyRatio}% of solved set.`);

  // Weekly solved activity
  let weeklyActivity = 0;
  try {
    const sevenDaysAgo = Date.now() / 1000 - 7 * 86400;
    Object.entries(cal).forEach(([ts, val]) => {
      if (Number(ts) >= sevenDaysAgo) {
        weeklyActivity += Number(val);
      }
    });
  } catch (e) {
    console.warn('Error calculating weekly activity in analyticsEngine', e);
  }

  return {
    solvedStats,
    acceptanceRate: profile.acceptanceRate,
    ranking: profile.ranking,
    contestRating: profile.contestRating,
    globalRank: profile.globalRank,
    activeDays,
    currentStreak,
    longestStreak: currentStreak, // Default to current streak as simple fallback
    weeklyActivity,
    strongTopics,
    weakTopics,
    patternProgress,
    usedLanguages,
    recommendations,
    developerInsights: insights,
    lastSynced: profile.lastSynced
  };
}
