const PRACTICE_CATALOG = [
  { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', tag: 'hash-table', pattern: 'Hashing' },
  { title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', tag: 'hash-table', pattern: 'Hashing' },
  { title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium', tag: 'hash-table', pattern: 'Hashing' },
  
  { title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', tag: 'two-pointers', pattern: 'Two Pointer' },
  { title: '3Sum', slug: '3sum', difficulty: 'Medium', tag: 'two-pointers', pattern: 'Two Pointer' },
  { title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', tag: 'two-pointers', pattern: 'Two Pointer' },
  
  { title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', tag: 'sliding-window', pattern: 'Sliding Window' },
  { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', tag: 'sliding-window', pattern: 'Sliding Window' },
  { title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', tag: 'sliding-window', pattern: 'Sliding Window' },
  
  { title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', tag: 'binary-search', pattern: 'Binary Search' },
  { title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium', tag: 'binary-search', pattern: 'Binary Search' },
  { title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', tag: 'binary-search', pattern: 'Binary Search' },
  
  { title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', tag: 'linked-list', pattern: 'Linked List' },
  { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', tag: 'linked-list', pattern: 'Linked List' },
  { title: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium', tag: 'linked-list', pattern: 'Linked List' },
  
  { title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', tag: 'tree', pattern: 'Trees' },
  { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', tag: 'tree', pattern: 'Trees' },
  { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', tag: 'tree', pattern: 'Trees' },
  
  { title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', tag: 'graph', pattern: 'Graphs' },
  { title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', tag: 'graph', pattern: 'Graphs' },
  { title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', tag: 'graph', pattern: 'Graphs' },
  
  { title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', tag: 'dynamic-programming', pattern: 'Dynamic Programming' },
  { title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', tag: 'dynamic-programming', pattern: 'Dynamic Programming' },
  { title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', tag: 'dynamic-programming', pattern: 'Dynamic Programming' },
  
  { title: 'Permutations', slug: 'permutations', difficulty: 'Medium', tag: 'backtracking', pattern: 'Backtracking' },
  { title: 'Subsets', slug: 'subsets', difficulty: 'Medium', tag: 'backtracking', pattern: 'Backtracking' },
  { title: 'Word Search', slug: 'word-search', difficulty: 'Medium', tag: 'backtracking', pattern: 'Backtracking' }
];

export function generateRecommendations(profile, weakTopics = [], patternProgress = []) {
  if (!profile) return [];

  const solvedSlugs = new Set((profile.recentSubmissions || []).map(s => s.titleSlug));
  
  // Determine progression difficulty target
  const solvedMediums = profile.solvedStats?.medium || 0;
  let targetDifficulty = 'Easy';
  if (solvedMediums > 5) targetDifficulty = 'Medium';
  if (solvedMediums > 25) targetDifficulty = 'Hard';

  // Identify weak tags/slugs
  const weakSlugs = new Set(weakTopics.map(t => t.slug));
  const weakPatterns = new Set(patternProgress.filter(p => p.percentage < 25).map(p => p.name));

  const recommendations = [];

  // 1. Try to find questions from Weak Topics and Weak Patterns matching the target difficulty
  for (const item of PRACTICE_CATALOG) {
    if (solvedSlugs.has(item.slug)) continue;

    const matchesWeakTopic = weakSlugs.has(item.tag);
    const matchesWeakPattern = weakPatterns.has(item.pattern);
    const matchesDifficulty = item.difficulty === targetDifficulty || item.difficulty === 'Medium';

    if ((matchesWeakTopic || matchesWeakPattern) && matchesDifficulty) {
      recommendations.push(item);
    }
    if (recommendations.length >= 3) break;
  }

  // 2. Fallback: fill up to 3 recommendations with any unsolved catalog problems
  if (recommendations.length < 3) {
    for (const item of PRACTICE_CATALOG) {
      if (solvedSlugs.has(item.slug) || recommendations.some(r => r.slug === item.slug)) continue;
      recommendations.push(item);
      if (recommendations.length >= 3) break;
    }
  }

  return recommendations.map(item => ({
    title: item.title,
    titleSlug: item.slug,
    difficulty: item.difficulty,
    tag: item.tag,
    pattern: item.pattern
  }));
}
