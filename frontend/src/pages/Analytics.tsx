import React, { useState, useMemo } from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import { BarChart3, Search, Play } from 'lucide-react';
import {
  WeeklySolvedTrendChart, MonthlySolvedTrendChart, DifficultyDistributionChart,
  SubmissionTimelineChart, ContestRatingHistoryChart, LanguageUsageChart,
  TopicDistributionBarChart, ProblemGrowthChart, AcceptanceTrendChart
} from '../components/AnalyticsCharts';
import { DashboardInsights } from '../components/DashboardInsights';
import { Heatmap } from '../components/Heatmap';

export const Analytics: React.FC = () => {
  const { profile, connected, isLoading } = useLeetCodeProfile();
  const [searchQuery, setSearchQuery] = useState('');

  const analytics = profile?.generatedAnalytics;

  const filteredPatterns = useMemo(() => {
    const list = analytics?.patternProgress || [];
    return list.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [analytics, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-delay-100">
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div key={idx} className="h-28 glass-panel rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-delay-200">
          <div className="md:col-span-2 h-[220px] glass-panel rounded-2xl shimmer" />
          <div className="md:col-span-1 h-[220px] glass-panel rounded-2xl shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-delay-300">
          <div className="md:col-span-3 h-32 glass-panel rounded-2xl shimmer" />
          <div className="md:col-span-3 h-[300px] glass-panel rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (!connected || !profile || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-border bg-card/25 space-y-4 max-w-lg mx-auto mt-[12vh]">
        <div className="w-14 h-14 rounded-full bg-accent/40 flex items-center justify-center border border-border">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground">No Analytics Data Available</h4>
          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
            Please connect your LeetCode profile on the dashboard to access detailed charts and metrics.
          </p>
        </div>
      </div>
    );
  }

  const { solvedStats } = profile;
  const totalQuestionsPct = Math.min(Math.round((solvedStats.total / solvedStats.totalQuestions) * 100), 100);

  return (
    <div className="space-y-8">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Solved Rate</span>
          <div className="text-2xl font-extrabold text-foreground">{solvedStats.total || '--'}</div>
          <div className="text-[9px] text-zinc-500 font-bold">E:{solvedStats.easy} M:{solvedStats.medium} H:{solvedStats.hard}</div>
        </div>
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Acceptance</span>
          <div className="text-2xl font-extrabold text-foreground">{analytics.acceptanceRate ? `${analytics.acceptanceRate}%` : '--'}</div>
        </div>
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Contest Rating</span>
          <div className="text-2xl font-extrabold text-foreground">{analytics.contestRating > 0 ? analytics.contestRating : '--'}</div>
        </div>
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Global Rank</span>
          <div className="text-xl font-extrabold text-foreground truncate">{analytics.globalRank > 0 ? `#${analytics.globalRank.toLocaleString()}` : '--'}</div>
        </div>
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Active Days</span>
          <div className="text-2xl font-extrabold text-foreground">{analytics.activeDays > 0 ? `${analytics.activeDays} Days` : '--'}</div>
        </div>
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Active Streak</span>
          <div className="text-2xl font-extrabold text-foreground">{analytics.currentStreak || 0} Days</div>
          <div className="text-[9px] text-zinc-500 font-bold">Max: {analytics.longestStreak || 0} days</div>
        </div>
      </div>

      {/* Row 2: Progress Card & Difficulty Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Target Progress</h3>
            <span className="text-2xl font-extrabold text-foreground">{solvedStats.total} / {solvedStats.totalQuestions} Solved</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
              <span>Progress percentage</span>
              <span>{totalQuestionsPct}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-300" style={{ width: `${totalQuestionsPct}%` }} />
            </div>
          </div>
        </div>
        <DifficultyDistributionChart easy={solvedStats.easy} medium={solvedStats.medium} hard={solvedStats.hard} />
      </div>

      {/* Row 3: Insights and Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <DashboardInsights insights={analytics.developerInsights || []} />
        </div>
        <div className="md:col-span-3">
          <Heatmap submissionCalendar={profile.submissionCalendar} />
        </div>
      </div>

      {/* Row 4: Visual Trends Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Visual Trend Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeeklySolvedTrendChart submissionCalendar={profile.submissionCalendar} />
          <MonthlySolvedTrendChart submissionCalendar={profile.submissionCalendar} />
          <SubmissionTimelineChart submissionCalendar={profile.submissionCalendar} />
          <ContestRatingHistoryChart history={profile.contestHistory} />
          <LanguageUsageChart languages={analytics.usedLanguages || []} />
          <TopicDistributionBarChart topics={profile.topicStats} />
          <ProblemGrowthChart total={solvedStats.total} submissionCalendar={profile.submissionCalendar} />
          <AcceptanceTrendChart acceptanceRate={profile.acceptanceRate} />
        </div>
      </div>

      {/* Row 5: Pattern Distribution & Progress Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Pattern Progress Index</h3>
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patterns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatterns.map((p: any) => (
            <div key={p.slug} className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{p.name}</h4>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.recommendedQuestion?.difficulty === 'Easy' ? 'bg-[#10b981]/10 text-lc-easy' : p.recommendedQuestion?.difficulty === 'Medium' ? 'bg-[#ffc01e]/10 text-[#ffc01e]' : 'bg-red-500/10 text-lc-hard'
                  }`}>
                    {p.recommendedQuestion?.difficulty}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-foreground">{p.solved} solved</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                  <span>{p.percentage}% of your total solved</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-300" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 text-[10px] space-y-1">
                <span className="text-muted-foreground block font-medium">Recommended Question:</span>
                <a
                  href={`https://leetcode.com/problems/${p.recommendedQuestion?.titleSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold hover:underline text-foreground flex items-center gap-1.5"
                >
                  <Play className="h-2.5 w-2.5 fill-current shrink-0" />
                  {p.recommendedQuestion?.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
