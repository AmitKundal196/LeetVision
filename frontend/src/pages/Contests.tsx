import React from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import { ContestRatingHistoryChart } from '../components/AnalyticsCharts';
import { Trophy, Award, Star, Clock } from 'lucide-react';

export const Contests: React.FC = () => {
  const { profile, connected, isLoading } = useLeetCodeProfile();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-14 w-64 bg-card border border-border rounded-lg shimmer animate-delay-100" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-delay-200">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-[104px] glass-panel rounded-2xl shimmer" />
          ))}
        </div>
        <div className="h-[220px] glass-panel rounded-2xl shimmer animate-delay-300" />
        <div className="h-[400px] glass-panel rounded-2xl shimmer animate-delay-300" />
      </div>
    );
  }

  if (!connected || !profile) {
    return (
      <div className="text-center py-16 glass-panel glass-panel-hover rounded-2xl">
        <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground">No Contest Data</h3>
        <p className="text-xs text-muted-foreground mt-1">Please connect your LeetCode profile on the dashboard to access contest insights.</p>
      </div>
    );
  }

  const { contestRating, globalRank, topPercentage, attendedContestsCount, contestHistory } = profile;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Contest Performance</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Historical tracking of competition ratings and global ranks.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in animate-delay-100">
        
        {/* Card 1: Current Rating */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Contest Rating</span>
            <span className="text-2xl font-bold text-foreground">{contestRating > 0 ? contestRating : 'N/A'}</span>
          </div>
          <Award className="h-8 w-8 text-[#ffc01e]" />
        </div>

        {/* Card 2: Global Ranking */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Global Rank</span>
            <span className="text-2xl font-bold text-foreground">
              {globalRank > 0 ? `#${globalRank.toLocaleString()}` : 'N/A'}
            </span>
          </div>
          <Trophy className="h-8 w-8 text-[#ffffff]" />
        </div>

        {/* Card 3: Top Percentile */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Top Percentile</span>
            <span className="text-2xl font-bold text-foreground">
              {contestRating > 0 ? `Top ${topPercentage}%` : 'N/A'}
            </span>
          </div>
          <Star className="h-8 w-8 text-[#ffc01e]" />
        </div>

        {/* Card 4: Total Contests */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Contests Attended</span>
            <span className="text-2xl font-bold text-foreground">{attendedContestsCount}</span>
          </div>
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>

      </div>

      {/* Chart */}
      <div className="animate-fade-in animate-delay-200">
        <ContestRatingHistoryChart history={contestHistory} />
      </div>

      {/* History table */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 animate-fade-in animate-delay-300">
        <h3 className="text-sm font-semibold text-foreground mb-4">Contest Ranking History</h3>
        {contestHistory.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No attended contest history. Keep practicing and participate in upcoming LeetCode contests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5">Contest</th>
                  <th className="py-2.5">Rating reached</th>
                  <th className="py-2.5">Global Rank</th>
                  <th className="py-2.5">Problems Solved</th>
                  <th className="py-2.5">Finish Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {contestHistory.slice().reverse().map((contest, idx) => (
                  <tr key={idx} className="hover:bg-accent/20 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{contest.contestTitle}</td>
                    <td className="py-3 font-bold text-foreground">{contest.rating}</td>
                    <td className="py-3 text-muted-foreground">#{contest.ranking.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">
                      {contest.problemsSolved} / {contest.totalProblems}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {Math.floor(contest.finishTime / 60)}m {contest.finishTime % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Contests;
