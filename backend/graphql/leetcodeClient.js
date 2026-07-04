import axios from 'axios';
import { dbService } from '../services/dbService.js';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const BROWSER_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://leetcode.com/',
  'Origin': 'https://leetcode.com'
};

/**
 * Perform a GraphQL query to LeetCode
 */
async function queryLeetCode(query, variables = {}) {
  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query, variables },
      { headers: BROWSER_HEADERS, timeout: 8000 }
    );
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(`LeetCode GraphQL error: ${error.message}`);
  }
}

/**
 * Main function to sync a LeetCode user profile.
 * Falls back to mock data if the username is 'demo_user' or if the LeetCode API fails / blocks.
 */
export async function fetchLeetCodeData(username) {
  const isMock = username.toLowerCase() === 'demo_user' || username.toLowerCase() === 'mock_user';

  if (isMock) {
    console.log(`Generating mock LeetCode data for: ${username}`);
    return generateMockLeetCodeData(username);
  }

  try {
    // 1. Fetch Profile & Solved Stats
    const profileQuery = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            countryName
            aboutMe
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          badges {
            name
            icon
            hoverText
          }
        }
      }
    `;
    const profileData = await queryLeetCode(profileQuery, { username });
    
    if (!profileData || !profileData.matchedUser) {
      throw new Error(`User '${username}' not found on LeetCode.`);
    }

    // 2. Fetch Contests
    const contestQuery = `
      query getUserContestStats($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
        userContestRankingHistory(username: $username) {
          attended
          rating
          ranking
          problemsSolved
          totalProblems
          finishTimeInSeconds
          contest {
            title
            startTime
          }
        }
      }
    `;
    let contestData = { userContestRanking: null, userContestRankingHistory: [] };
    try {
      contestData = await queryLeetCode(contestQuery, { username });
    } catch (e) {
      console.warn(`Contest rating not found or failed for ${username}: ${e.message}`);
    }

    // 3. Fetch Languages & Topics
    const advancedQuery = `
      query getUserLanguageAndTopics($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;
    let advancedData = { matchedUser: { languageProblemCount: [], tagProblemCounts: { advanced: [], medium: [], fundamental: [] } } };
    try {
      advancedData = await queryLeetCode(advancedQuery, { username });
    } catch (e) {
      console.warn(`Language and topic stats failed for ${username}: ${e.message}`);
    }

    // 4. Fetch Submissions and Calendar Heatmap
    const submissionQuery = `
      query getUserSubmissions($username: String!) {
        recentSubmissionList(username: $username, limit: 15) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
        matchedUser(username: $username) {
          submissionCalendar
        }
      }
    `;
    let submissionData = { recentSubmissionList: [], matchedUser: { submissionCalendar: '{}' } };
    try {
      submissionData = await queryLeetCode(submissionQuery, { username });
    } catch (e) {
      console.warn(`Submissions query failed for ${username}: ${e.message}`);
    }

    // Parse and merge data
    const matchedUser = profileData.matchedUser;
    const allQs = profileData.allQuestionsCount || [];
    
    const qTotals = {
      All: allQs.find(q => q.difficulty === 'All')?.count || 3300,
      Easy: allQs.find(q => q.difficulty === 'Easy')?.count || 800,
      Medium: allQs.find(q => q.difficulty === 'Medium')?.count || 1600,
      Hard: allQs.find(q => q.difficulty === 'Hard')?.count || 900
    };

    const acStats = matchedUser.submitStats?.acSubmissionNum || [];
    const solvedCounts = {
      total: acStats.find(q => q.difficulty === 'All')?.count || 0,
      easy: acStats.find(q => q.difficulty === 'Easy')?.count || 0,
      medium: acStats.find(q => q.difficulty === 'Medium')?.count || 0,
      hard: acStats.find(q => q.difficulty === 'Hard')?.count || 0,
      totalQuestions: qTotals.All,
      easyQuestions: qTotals.Easy,
      mediumQuestions: qTotals.Medium,
      hardQuestions: qTotals.Hard
    };

    // Calculate Acceptance Rate
    const totalSubmits = matchedUser.submitStats?.acSubmissionNum?.find(q => q.difficulty === 'All')?.submissions || 1;
    const totalAcSubmissions = solvedCounts.total || 0;
    const acceptanceRate = totalSubmits > 0 ? parseFloat(((totalAcSubmissions / totalSubmits) * 100).toFixed(2)) : 54.2;

    const ranking = matchedUser.profile?.ranking || 0;
    
    // Parse Contest Rank
    const contestRanking = contestData?.userContestRanking || {};
    const contestHistoryRaw = contestData?.userContestRankingHistory || [];
    
    const contestRating = contestRanking.rating ? Math.round(contestRanking.rating) : 0;
    const globalRank = contestRanking.globalRanking || 0;
    const totalParticipants = contestRanking.totalParticipants || 0;
    const topPercentage = contestRanking.topPercentage || 100;
    const attendedContestsCount = contestRanking.attendedContestsCount || 0;

    const contestHistory = contestHistoryRaw
      .filter(c => c.attended)
      .map(c => ({
        contestTitle: c.contest?.title || 'Weekly Contest',
        rating: Math.round(c.rating),
        ranking: c.ranking,
        problemsSolved: c.problemsSolved || 0,
        totalProblems: c.totalProblems || 4,
        finishTime: c.finishTimeInSeconds || 0
      }));

    // Parse Badges
    const badges = (matchedUser.badges || []).map(b => ({
      name: b.name,
      icon: b.icon.startsWith('http') ? b.icon : `https://leetcode.com${b.icon}`,
      hoverText: b.hoverText || b.name
    }));

    // Language stats
    const languageStats = (advancedData?.matchedUser?.languageProblemCount || []).map(l => ({
      languageName: l.languageName,
      problemsSolved: l.problemsSolved
    }));

    // Topic stats
    const topics = [];
    const tagCounts = advancedData?.matchedUser?.tagProblemCounts || {};
    ['fundamental', 'intermediate', 'advanced'].forEach(category => {
      const list = tagCounts[category] || [];
      list.forEach(t => {
        topics.push({
          tagName: t.tagName,
          tagSlug: t.tagSlug,
          problemsSolved: t.problemsSolved,
          category
        });
      });
    });

    // Recent submissions (dynamic with tag lookup and DB caching)
    const recentSubmissions = await Promise.all(
      (submissionData?.recentSubmissionList || []).map(async (s, idx) => {
        let difficulty = '';
        let tags = [];

        try {
          // Check DB cache first
          let cached = await dbService.findProblemCache(s.titleSlug);
          if (!cached) {
            const details = await fetchProblemDetails(s.titleSlug);
            if (details) {
              cached = await dbService.saveProblemCache(s.titleSlug, {
                title: details.title || s.title,
                difficulty: details.difficulty || '',
                topicTags: details.topicTags || []
              });
            }
          }
          if (cached) {
            difficulty = cached.difficulty;
            tags = (cached.topicTags || []).map(t => t.name);
          }
        } catch (e) {
          console.warn(`Error resolving tags for submission ${s.titleSlug}:`, e.message);
        }

        return {
          id: String(idx + 1),
          title: s.title || '',
          titleSlug: s.titleSlug || '',
          timestamp: s.timestamp || '',
          status: s.statusDisplay || '',
          language: s.lang || '',
          runtime: '',
          memory: '',
          difficulty,
          tags
        };
      })
    );

    // Submission calendar
    const submissionCalendar = submissionData?.matchedUser?.submissionCalendar || '{}';

    // Current Streak calculation based on calendar
    const calendarObj = JSON.parse(submissionCalendar);
    let currentStreak = calculateStreak(calendarObj);

    return {
      solvedStats: solvedCounts,
      acceptanceRate,
      ranking,
      contestRating,
      globalRank,
      totalContestParticipants: totalParticipants,
      topPercentage,
      attendedContestsCount,
      contestHistory,
      badges,
      languageStats,
      topicStats: topics,
      recentSubmissions,
      submissionCalendar,
      profileDetails: {
        realName: matchedUser.profile?.realName || username,
        countryName: matchedUser.profile?.countryName || '',
        userAvatar: matchedUser.profile?.userAvatar || '',
        aboutMe: matchedUser.profile?.aboutMe || ''
      },
      currentStreak
    };
  } catch (error) {
    throw new Error(`Real sync failed for ${username}: ${error.message}`);
  }
}

/**
 * Validate a LeetCode username exists
 */
export async function validateLeetCodeUsername(username) {
  if (username.toLowerCase() === 'demo_user' || username.toLowerCase() === 'mock_user') {
    return true;
  }
  try {
    const query = `
      query validateUser($username: String!) {
        matchedUser(username: $username) {
          username
        }
      }
    `;
    const res = await queryLeetCode(query, { username });
    return !!(res && res.matchedUser);
  } catch (err) {
    if (err.message.includes("That user does not exist") || err.message.includes("not found")) {
      return false;
    }
    console.warn('Username validation query failed due to network error, allowing username:', err.message);
    return true; // allow username if it's just a network failure
  }
}

/**
 * Calculates the consecutive active days (streak) from the submission calendar JSON
 */
function calculateStreak(calendar) {
  if (!calendar || Object.keys(calendar).length === 0) return 0;
  
  // Convert timestamps to date strings (YYYY-MM-DD)
  const activeDays = new Set();
  Object.keys(calendar).forEach(ts => {
    const date = new Date(parseInt(ts) * 1000);
    activeDays.add(date.toISOString().split('T')[0]);
  });
  
  const sortedDays = Array.from(activeDays).sort((a, b) => new Date(b) - new Date(a));
  if (sortedDays.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // If no submissions today or yesterday, streak is broken
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
    return 0;
  }

  let currentCheck = new Date(sortedDays[0]);
  for (let i = 0; i < 365; i++) {
    const checkStr = currentCheck.toISOString().split('T')[0];
    if (activeDays.has(checkStr)) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Generate realistic statistics for a simulated profile
 */
function generateMockLeetCodeData(username) {
  const solvedStats = {
    total: 397,
    easy: 182,
    medium: 175,
    hard: 40,
    totalQuestions: 3300,
    easyQuestions: 800,
    mediumQuestions: 1600,
    hardQuestions: 900
  };
  
  const acceptanceRate = 62.4;
  const ranking = 124501;
  const contestRating = 1845;
  const globalRank = 14502;
  const totalContestParticipants = 280000;
  const topPercentage = 5.18;
  const attendedContestsCount = 18;

  // Generate contest history
  const contestHistory = [
    { contestTitle: 'Weekly Contest 380', rating: 1530, ranking: 8400, problemsSolved: 2, totalProblems: 4, finishTime: 4800 },
    { contestTitle: 'Weekly Contest 381', rating: 1560, ranking: 6200, problemsSolved: 2, totalProblems: 4, finishTime: 4200 },
    { contestTitle: 'Weekly Contest 382', rating: 1595, ranking: 5100, problemsSolved: 3, totalProblems: 4, finishTime: 5100 },
    { contestTitle: 'Weekly Contest 383', rating: 1620, ranking: 4500, problemsSolved: 3, totalProblems: 4, finishTime: 4900 },
    { contestTitle: 'Weekly Contest 384', rating: 1642, ranking: 4100, problemsSolved: 3, totalProblems: 4, finishTime: 3800 },
    { contestTitle: 'Weekly Contest 385', rating: 1690, ranking: 3100, problemsSolved: 3, totalProblems: 4, finishTime: 3500 },
    { contestTitle: 'Weekly Contest 386', rating: 1725, ranking: 2800, problemsSolved: 3, totalProblems: 4, finishTime: 2900 },
    { contestTitle: 'Weekly Contest 387', rating: 1740, ranking: 3400, problemsSolved: 2, totalProblems: 4, finishTime: 5400 },
    { contestTitle: 'Weekly Contest 388', rating: 1785, ranking: 1950, problemsSolved: 4, totalProblems: 4, finishTime: 5200 },
    { contestTitle: 'Weekly Contest 389', rating: 1812, ranking: 2100, problemsSolved: 3, totalProblems: 4, finishTime: 3100 },
    { contestTitle: 'Weekly Contest 390', rating: 1845, ranking: 1800, problemsSolved: 4, totalProblems: 4, finishTime: 4600 }
  ];

  // Badges
  const badges = [
    { name: '50 Days Badge 2026', icon: 'https://assets.leetcode.com/static_assets/marketing/2026-50.png', hoverText: 'Solved problems on 50 days in 2026' },
    { name: 'Knight', icon: 'https://assets.leetcode.com/static_assets/submissions/knight.png', hoverText: 'Contest rating top 25%' },
    { name: 'Jan LeetCoding Challenge', icon: 'https://assets.leetcode.com/static_assets/marketing/2026-01-daily.png', hoverText: 'Completed Jan LeetCoding Challenge' }
  ];

  // Language Stats
  const languageStats = [
    { languageName: 'JavaScript', problemsSolved: 192 },
    { languageName: 'TypeScript', problemsSolved: 145 },
    { languageName: 'Python', problemsSolved: 50 },
    { languageName: 'Java', problemsSolved: 10 }
  ];

  // Topic Stats
  const topics = [
    { tagName: 'Array', tagSlug: 'array', problemsSolved: 94, category: 'fundamental' },
    { tagName: 'String', tagSlug: 'string', problemsSolved: 73, category: 'fundamental' },
    { tagName: 'Hash Table', tagSlug: 'hash-table', problemsSolved: 62, category: 'fundamental' },
    { tagName: 'Two Pointers', tagSlug: 'two-pointers', problemsSolved: 34, category: 'fundamental' },
    { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', problemsSolved: 28, category: 'advanced' },
    { tagName: 'Tree', tagSlug: 'tree', problemsSolved: 31, category: 'medium' },
    { tagName: 'Graph', tagSlug: 'graph', problemsSolved: 19, category: 'advanced' },
    { tagName: 'Binary Search', tagSlug: 'binary-search', problemsSolved: 22, category: 'medium' },
    { tagName: 'Sliding Window', tagSlug: 'sliding-window', problemsSolved: 18, category: 'medium' },
    { tagName: 'DFS', tagSlug: 'depth-first-search', problemsSolved: 25, category: 'medium' },
    { tagName: 'Greedy', tagSlug: 'greedy', problemsSolved: 15, category: 'advanced' }
  ];

  // Submissions Calendar (Last 365 Days)
  // Format: timestamp -> count
  const calendar = {};
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    // 60% probability of active day
    if (Math.random() < 0.6) {
      const ts = Math.floor(d.getTime() / 1000);
      const count = Math.floor(Math.random() * 4) + 1; // 1-4 submissions
      calendar[ts.toString()] = count;
    }
  }

  // Recent Submissions
  const recentSubmissions = [
    { id: '1', title: 'Two Sum', titleSlug: 'two-sum', timestamp: Math.floor(Date.now() / 1000 - 3600).toString(), status: 'Accepted', language: 'TypeScript', runtime: '52 ms', memory: '44.8 MB', difficulty: 'Easy' },
    { id: '2', title: 'Longest Substring Without Repeating Characters', titleSlug: 'longest-substring-without-repeating-characters', timestamp: Math.floor(Date.now() / 1000 - 7200).toString(), status: 'Accepted', language: 'JavaScript', runtime: '78 ms', memory: '46.1 MB', difficulty: 'Medium' },
    { id: '3', title: 'Edit Distance', titleSlug: 'edit-distance', timestamp: Math.floor(Date.now() / 1000 - 15000).toString(), status: 'Accepted', language: 'JavaScript', runtime: '104 ms', memory: '48.2 MB', difficulty: 'Hard' },
    { id: '4', title: 'Merge Sorted Array', titleSlug: 'merge-sorted-array', timestamp: Math.floor(Date.now() / 1000 - 86400).toString(), status: 'Accepted', language: 'TypeScript', runtime: '48 ms', memory: '43.9 MB', difficulty: 'Easy' },
    { id: '5', title: 'Binary Tree Level Order Traversal', titleSlug: 'binary-tree-level-order-traversal', timestamp: Math.floor(Date.now() / 1000 - 100000).toString(), status: 'Accepted', language: 'Python', runtime: '38 ms', memory: '15.6 MB', difficulty: 'Medium' },
    { id: '6', title: 'Number of Islands', titleSlug: 'number-of-islands', timestamp: Math.floor(Date.now() / 1000 - 150000).toString(), status: 'Accepted', language: 'TypeScript', runtime: '82 ms', memory: '47.2 MB', difficulty: 'Medium' },
    { id: '7', title: 'Valid Parentheses', titleSlug: 'valid-parentheses', timestamp: Math.floor(Date.now() / 1000 - 200000).toString(), status: 'Accepted', language: 'JavaScript', runtime: '50 ms', memory: '44.1 MB', difficulty: 'Easy' }
  ];

  return {
    solvedStats,
    acceptanceRate,
    ranking,
    contestRating,
    globalRank,
    totalContestParticipants,
    topPercentage,
    attendedContestsCount,
    contestHistory,
    badges,
    languageStats,
    topicStats: topics,
    recentSubmissions,
    submissionCalendar: JSON.stringify(calendar),
    profileDetails: {
      realName: username === 'demo_user' ? 'Demo Engineer' : username,
      countryName: 'United States',
      userAvatar: 'https://assets.leetcode.com/users/demo_user/avatar_1624500000.png',
      aboutMe: 'Passionate software engineer grinding LeetCode to break into high-scale engineering systems.'
    },
    currentStreak: calculateStreak(calendar)
  };
}

async function fetchProblemDetails(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
  `;
  try {
    const data = await queryLeetCode(query, { titleSlug });
    return data?.question || null;
  } catch (e) {
    console.warn(`Failed to fetch details for problem slug: ${titleSlug}`, e.message);
    return null;
  }
}
