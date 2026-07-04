import React, { useMemo, useEffect, useState } from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardRow1 } from '../components/DashboardRow1';
import { DashboardRow3 } from '../components/DashboardRow3';
import { DashboardRow4 } from '../components/DashboardRow4';
import { Heatmap } from '../components/Heatmap';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile, connected, isLoading, isSyncing, sync, refetch, syncError } = useLeetCodeProfile();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const connectUsername = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    if (!connectUsername) return;
    try {
      await sync({ leetcodeUsername: connectUsername, force: true });
      refetch();
    } catch (err: any) {}
  };

  const handleForceSync = async () => {
    try {
      await sync({ force: true });
      refetch();
    } catch (err: any) {}
  };

  const todayProgress = useMemo(() => {
    if (!profile) return { solved: 0, goal: 3, percentage: 0 };
    const calendarStr = profile.submissionCalendar || '{}';
    let todaySolved = 0;
    try {
      const cal = JSON.parse(calendarStr);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayStart = new Date(todayStr).getTime() / 1000;
      const todayEnd = todayStart + 86400;

      Object.entries(cal).forEach(([ts, count]) => {
        const itemTs = parseInt(ts);
        if (itemTs >= todayStart && itemTs < todayEnd) todaySolved += Number(count);
      });
    } catch (e) {
      console.warn('Error parsing calendar for progress', e);
    }
    const goal = user?.onboarding?.dailyGoal || 3;
    return { solved: todaySolved, goal, percentage: Math.min(Math.round((todaySolved / goal) * 100), 100) };
  }, [profile, user]);

  const weeklyProgress = profile?.generatedAnalytics?.weeklyActivity || 0;

  useEffect(() => {
    if (profile?.solvedStats?.total) {
      const total = profile.solvedStats.total;
      const milestones = [100, 200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000];
      const hitMilestone = milestones.slice().reverse().find(m => total >= m);
      
      if (hitMilestone) {
        const key = `milestone_${hitMilestone}_${profile.username || 'user'}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, 'true');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }
      }
    }
  }, [profile]);

  if (isLoading || isSyncing) {
    return (
      <div className="space-y-8 animate-fade-in">
        {isSyncing && (
          <div className="flex items-center gap-3 rounded-xl bg-[#ffc01e]/5 border border-[#ffc01e]/15 p-4 text-xs text-[#ffc01e] animate-pulse">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Synchronizing LeetCode stats and submissions. Please hold...</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(idx => (
            <div key={idx} className="h-32 glass-panel rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-[320px] glass-panel rounded-2xl shimmer" />
          <div className="lg:col-span-1 h-[320px] glass-panel rounded-2xl shimmer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] glass-panel rounded-2xl shimmer" />
          <div className="lg:col-span-1 h-[400px] glass-panel rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (!connected || !profile) {
    return (
      <div className="max-w-md mx-auto mt-[12vh] text-center space-y-6">
        <div className="premium-card glass-panel p-10 shadow-2xl space-y-8 animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-primary shadow-[0_0_20px_rgba(0,184,163,0.15)] ring-1 ring-white/10">
            <Plus className="h-8 w-8" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground font-display tracking-tight">Connect LeetCode Profile</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Import solved counts, contest historical ratings, and activity logs to configure your developer analytics space.
            </p>
          </div>
          {syncError && (
            <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-left">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{syncError?.message || 'Failed to sync. Please try again.'}</span>
            </div>
          )}
          <form onSubmit={handleConnect} className="space-y-4 text-left">
            <input
              type="text"
              name="username"
              placeholder="LeetCode username (e.g. demo_user)"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isSyncing}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(0,184,163,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Connect Developer Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} />
        </div>
      )}

      {/* Sync Status Progress */}
      {isSyncing && (
        <div className="flex items-center gap-3 rounded-xl bg-[#ffc01e]/5 border border-[#ffc01e]/15 p-4 text-xs text-[#ffc01e] animate-pulse">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Synchronizing LeetCode stats and submissions. Please hold...</span>
        </div>
      )}
      
      {/* Sync Error Notice */}
      {syncError && !isSyncing && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-500 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{syncError?.message || 'Failed to sync profile. Try again later.'}</span>
        </div>
      )}

      {/* Row 1: Key Stats Summary Grid */}
      <DashboardRow1 profile={profile} weeklyProgress={weeklyProgress} />

      {/* Row 2: Grid for Heatmap and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Large Heatmap on Left */}
        <div className="lg:col-span-3">
          <Heatmap submissionCalendar={profile.submissionCalendar} />
        </div>

        {/* Sidebar on Right */}
        <div className="lg:col-span-1">
          <DashboardSidebar
            profile={profile}
            todayProgress={todayProgress}
            handleForceSync={handleForceSync}
            isSyncing={isSyncing}
          />
        </div>
      </div>

      {/* Row 3: Recent Activity and Charts Sidebar */}
      <DashboardRow3 
        recentSubmissions={profile.recentSubmissions || []}
        submissionCalendar={profile.submissionCalendar || '{}'}
        languages={profile.generatedAnalytics?.usedLanguages || []}
        topics={profile.topicStats || []}
      />

      {/* Row 4: Pattern Progress & Recommendations */}
      <DashboardRow4 
        weakTopics={profile.generatedAnalytics?.weakTopics || []}
        strongTopics={profile.generatedAnalytics?.strongTopics || []}
        patternProgress={profile.generatedAnalytics?.patternProgress || []}
        recommendations={profile.generatedAnalytics?.recommendations || []}
      />
    </div>
  );
};

export default Dashboard;
