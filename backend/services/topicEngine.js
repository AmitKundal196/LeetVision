export function getStrongAndWeakTopics(topicStats = []) {
  if (!topicStats || topicStats.length === 0) {
    return { strongTopics: [], weakTopics: [] };
  }

  // Sort topics by solved counts descending
  const sorted = [...topicStats].sort((a, b) => b.problemsSolved - a.problemsSolved);

  // Top 5 become strong
  const strong = sorted.slice(0, 5).filter(t => t.problemsSolved > 0).map(t => ({
    name: t.tagName,
    slug: t.tagSlug,
    solved: t.problemsSolved
  }));

  // Bottom 5 (or topics with 0 solved) become weak
  const weakSorted = [...topicStats].sort((a, b) => a.problemsSolved - b.problemsSolved);
  const weak = weakSorted.slice(0, 5).map(t => ({
    name: t.tagName,
    slug: t.tagSlug,
    solved: t.problemsSolved
  }));

  return {
    strongTopics: strong,
    weakTopics: weak
  };
}
