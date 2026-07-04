import React from 'react';
import { Flame, CheckCircle2, Trophy, Activity } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { LeetCodeProfile } from '../types';

interface DashboardRow1Props {
  profile: LeetCodeProfile;
  weeklyProgress: number;
}

export const DashboardRow1: React.FC<DashboardRow1Props> = ({ profile, weeklyProgress }) => {
  const { solvedStats, acceptanceRate, ranking, contestRating } = profile;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Problems Solved */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group min-h-[120px]">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Problems Solved</span>
        <div className="flex items-baseline gap-1">
          <AnimatedNumber value={solvedStats.total} className="text-3xl font-display font-bold tracking-tight text-foreground" />
          <span className="text-[10px] text-muted-foreground font-display font-medium">/ {solvedStats.totalQuestions}</span>
        </div>
        <div className="flex gap-0.5 h-1">
          <div className="bg-lc-easy rounded-sm h-full" style={{ width: `${(solvedStats.easy / Math.max(solvedStats.total, 1)) * 100}%` }} title="Easy" />
          <div className="bg-lc-medium rounded-sm h-full" style={{ width: `${(solvedStats.medium / Math.max(solvedStats.total, 1)) * 100}%` }} title="Medium" />
          <div className="bg-lc-hard rounded-sm h-full" style={{ width: `${(solvedStats.hard / Math.max(solvedStats.total, 1)) * 100}%` }} title="Hard" />
        </div>
      </div>

      {/* 2. Acceptance */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Acceptance Rate</span>
        <div className="flex items-center gap-1">
          <AnimatedNumber value={acceptanceRate} suffix="%" className="text-3xl font-display font-bold tracking-tight text-foreground" />
          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
        </div>
        <span className="text-[9px] text-muted-foreground font-semibold">Rank: #{ranking.toLocaleString()}</span>
      </div>

      {/* 3. Contest Rating */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group min-h-[120px]">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Contest Rating</span>
        <div className="flex items-center gap-1">
          {contestRating > 0 ? (
            <AnimatedNumber value={Math.round(contestRating)} className="text-3xl font-display font-bold tracking-tight text-[#ffc01e]" />
          ) : (
            <span className="text-3xl font-display font-bold tracking-tight text-[#ffc01e]">--</span>
          )}
          <Trophy className="h-4 w-4 text-[#ffc01e]" />
        </div>
        <span className="text-[9px] text-muted-foreground font-semibold">
          {profile.globalRank > 0 ? `#${profile.globalRank.toLocaleString()} Globally` : 'Unrated'}
        </span>
      </div>

      {/* 4. Streak */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group min-h-[120px]">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Current Streak</span>
        <div className="flex items-center gap-1">
          <AnimatedNumber value={profile.currentStreak || 0} className="text-3xl font-display font-bold tracking-tight text-[#ef4743]" />
          <Flame className="h-4 w-4 text-[#ef4743]" />
        </div>
        <span className="text-[9px] text-muted-foreground font-semibold">Active Days</span>
      </div>

      {/* 5. Submissions (Weekly) */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group min-h-[120px]">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Weekly Activity</span>
        <div className="flex items-center gap-1">
          <AnimatedNumber value={weeklyProgress} className="text-3xl font-display font-bold tracking-tight text-[#3b82f6]" />
          <Activity className="h-4 w-4 text-[#3b82f6]" />
        </div>
        <span className="text-[9px] text-muted-foreground font-semibold">Submissions in 7 days</span>
      </div>
    </div>
  );
};
export default DashboardRow1;
