import React, { useState, useEffect } from 'react';
import { Calendar, Pin, Flame, History } from 'lucide-react';
import type { LeetCodeProfile } from '../types';

interface DashboardSidebarProps {
  profile: LeetCodeProfile;
  todayProgress: { solved: number; goal: number; percentage: number };
  handleForceSync: () => void;
  isSyncing: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  profile,
  todayProgress,
  handleForceSync,
  isSyncing
}) => {
  const [bookmarks, setBookmarks] = useState<{ title: string; slug: string; difficulty: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('leetvision_bookmarks') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setBookmarks(JSON.parse(localStorage.getItem('leetvision_bookmarks') || '[]'));
      } catch {}
    };
    window.addEventListener('bookmarks_updated', handleUpdate);
    return () => window.removeEventListener('bookmarks_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Today's Goal (Radial Progress Ring) */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col items-center text-center space-y-4">
        <div className="w-full text-left">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Goal</h3>
        </div>
        
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="40" strokeWidth="5" stroke="#18181b" fill="transparent" />
            <circle
              cx="48"
              cy="48"
              r="40"
              strokeWidth="5"
              stroke="#ffffff"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - todayProgress.percentage / 100)}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-base font-bold text-foreground">{todayProgress.percentage}%</span>
            <span className="text-[8px] text-muted-foreground uppercase font-semibold">Progress</span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">
            {todayProgress.solved} / {todayProgress.goal} Solved
          </h4>
          <p className="text-[10px] text-muted-foreground">
            {todayProgress.solved >= todayProgress.goal 
              ? '🎉 Daily goal accomplished!'
              : `Solve ${todayProgress.goal - todayProgress.solved} more to secure your streak.`}
          </p>
        </div>
      </div>

      {/* 2. Current Streak Widget */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Current Streak</h3>
          <span className="text-xl font-bold text-foreground block">{profile.currentStreak || 0} Days</span>
        </div>
        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2 text-orange-500">
          <Flame className="h-5 w-5 animate-pulse" />
        </div>
      </div>

      {/* 3. Last Sync Timestamp */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Last Sync</h3>
          <span className="text-xs font-bold text-foreground block">
            {profile.lastSynced ? new Date(profile.lastSynced).toLocaleTimeString() : 'N/A'}
          </span>
          <span className="text-[9px] text-muted-foreground block">
            {profile.lastSynced ? new Date(profile.lastSynced).toLocaleDateString() : 'Never'}
          </span>
        </div>
        <div className="rounded-lg bg-zinc-900 border border-border p-2">
          <History className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* 4. Pinned Problems (from Bookmarks) */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pinned Problems</h3>
          <Pin className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          {bookmarks.length === 0 ? (
            <p className="text-[10px] text-muted-foreground leading-relaxed">No bookmarked problems. Pin problems to save them here.</p>
          ) : (
            bookmarks.map(prob => (
              <a
                key={prob.slug}
                href={`https://leetcode.com/problems/${prob.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5 hover:border-accent-foreground/20 hover:bg-accent/10 transition-all duration-150"
              >
                <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">{prob.title}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  prob.difficulty === 'Easy' ? 'text-lc-easy bg-lc-easy/10' : prob.difficulty === 'Medium' ? 'text-[#ffc01e] bg-[#ffc01e]/10' : 'text-lc-hard bg-lc-hard/10'
                }`}>
                  {prob.difficulty}
                </span>
              </a>
            ))
          )}
        </div>
      </div>

      {/* 5. Upcoming Contest */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Upcoming Contest</h3>
        <div className="flex items-start gap-2.5">
          <div className="rounded-lg bg-zinc-900 border border-border p-2 mt-0.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Weekly Contest 405</h4>
            <p className="text-[9px] text-muted-foreground mt-0.5">Sunday, 8:00 AM IST</p>
          </div>
        </div>
        <a 
          href="https://leetcode.com/contest" 
          target="_blank" 
          rel="noreferrer" 
          className="block w-full text-center rounded-lg bg-accent py-1.5 text-xs font-semibold hover:bg-accent/80 transition-colors"
        >
          Register Page
        </a>
      </div>

      {/* 6. Revision Reminder */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Revision Reminder</h3>
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          Practicing algorithms regularly reduces pattern decay. Consider reviewing:
        </p>
        <div className="rounded-lg border border-border bg-background p-3.5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">3Sum</span>
            <span className="text-[#ffc01e] font-semibold text-[10px]">Medium</span>
          </div>
          <p className="text-[9px] text-muted-foreground">Topics: Two Pointers, Array</p>
        </div>
      </div>

      {/* 7. Quick Actions */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Quick Actions</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex-1 rounded-lg border border-border bg-background py-1.5 text-[10px] font-semibold text-foreground hover:bg-accent/40 disabled:opacity-50 transition-colors"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <a
            href="/settings"
            className="flex-1 text-center rounded-lg border border-border bg-background py-1.5 text-[10px] font-semibold text-foreground hover:bg-accent/40 transition-colors"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};
export default DashboardSidebar;
