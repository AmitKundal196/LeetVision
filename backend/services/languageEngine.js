export function getUsedLanguages(languageStats = []) {
  if (!languageStats) return [];
  
  // Filter out any languages that have 0 solved problems
  return languageStats
    .filter(l => l.problemsSolved > 0)
    .map(l => ({
      languageName: l.languageName,
      problemsSolved: l.problemsSolved
    }));
}
