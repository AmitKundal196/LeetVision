const PATTERN_MAP = {
  'two-pointers': 'Two Pointer',
  'sliding-window': 'Sliding Window',
  'binary-search': 'Binary Search',
  'hash-table': 'Hashing',
  'prefix-sum': 'Prefix Sum',
  'linked-list': 'Linked List',
  'depth-first-search': 'DFS',
  'breadth-first-search': 'BFS',
  'tree': 'Trees',
  'binary-tree': 'Trees',
  'graph': 'Graphs',
  'heap-priority-queue': 'Heap',
  'greedy': 'Greedy',
  'backtracking': 'Backtracking',
  'dynamic-programming': 'Dynamic Programming',
  'bit-manipulation': 'Bit Manipulation',
  'math': 'Math',
  'sorting': 'Sorting',
  'recursion': 'Recursion'
};

const PATTERN_CONFIGS = [
  { name: 'Two Pointer', slug: 'two-pointers', total: 150, recTitle: 'Container With Most Water', recSlug: 'container-with-most-water', difficulty: 'Medium' },
  { name: 'Sliding Window', slug: 'sliding-window', total: 80, recTitle: 'Longest Substring Without Repeating Characters', recSlug: 'longest-substring-without-repeating-characters', difficulty: 'Medium' },
  { name: 'Binary Search', slug: 'binary-search', total: 120, recTitle: 'Search in Rotated Sorted Array', recSlug: 'search-in-rotated-sorted-array', difficulty: 'Medium' },
  { name: 'Hashing', slug: 'hash-table', total: 180, recTitle: 'Two Sum', recSlug: 'two-sum', difficulty: 'Easy' },
  { name: 'Prefix Sum', slug: 'prefix-sum', total: 60, recTitle: 'Subarray Sum Equals K', recSlug: 'subarray-sum-equals-k', difficulty: 'Medium' },
  { name: 'Linked List', slug: 'linked-list', total: 80, recTitle: 'Reverse Linked List', recSlug: 'reverse-linked-list', difficulty: 'Easy' },
  { name: 'DFS', slug: 'depth-first-search', total: 160, recTitle: 'Number of Islands', recSlug: 'number-of-islands', difficulty: 'Medium' },
  { name: 'BFS', slug: 'breadth-first-search', total: 100, recTitle: 'Word Ladder', recSlug: 'word-ladder', difficulty: 'Hard' },
  { name: 'Trees', slug: 'tree', total: 180, recTitle: 'Maximum Depth of Binary Tree', recSlug: 'maximum-depth-of-binary-tree', difficulty: 'Easy' },
  { name: 'Graphs', slug: 'graph', total: 110, recTitle: 'Clone Graph', recSlug: 'clone-graph', difficulty: 'Medium' },
  { name: 'Heap', slug: 'heap', total: 60, recTitle: 'Merge k Sorted Lists', recSlug: 'merge-k-sorted-lists', difficulty: 'Hard' },
  { name: 'Greedy', slug: 'greedy', total: 130, recTitle: 'Jump Game', recSlug: 'jump-game', difficulty: 'Medium' },
  { name: 'Backtracking', slug: 'backtracking', total: 85, recTitle: 'Permutations', recSlug: 'permutations', difficulty: 'Medium' },
  { name: 'Dynamic Programming', slug: 'dynamic-programming', total: 240, recTitle: 'Longest Common Subsequence', recSlug: 'longest-common-subsequence', difficulty: 'Medium' },
  { name: 'Bit Manipulation', slug: 'bit-manipulation', total: 75, recTitle: 'Single Number', recSlug: 'single-number', difficulty: 'Easy' },
  { name: 'Math', slug: 'math', total: 190, recTitle: 'Pow(x, n)', recSlug: 'powx-n', difficulty: 'Medium' },
  { name: 'Sorting', slug: 'sorting', total: 130, recTitle: 'Merge Intervals', recSlug: 'merge-intervals', difficulty: 'Medium' },
  { name: 'Recursion', slug: 'recursion', total: 50, recTitle: 'K-th Symbol in Grammar', recSlug: 'k-th-symbol-in-grammar', difficulty: 'Medium' }
];

export function calculatePatternProgress(topicStats = [], userTotalSolved = 1) {
  return PATTERN_CONFIGS.map(config => {
    let maxSolved = 0;
    Object.entries(PATTERN_MAP).forEach(([tagSlug, patternName]) => {
      if (patternName === config.name) {
        const topic = topicStats.find(t => t.tagSlug === tagSlug);
        if (topic && topic.problemsSolved > maxSolved) {
          maxSolved = topic.problemsSolved;
        }
      }
    });

    const solved = maxSolved;
    const percentage = userTotalSolved > 0 ? Math.min(Math.round((solved / userTotalSolved) * 100), 100) : 0;

    return {
      name: config.name,
      slug: config.slug,
      solved,
      percentage,
      recommendedQuestion: {
        title: config.recTitle,
        titleSlug: config.recSlug,
        difficulty: config.difficulty
      }
    };
  }).sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.solved - a.solved;
  });
}
