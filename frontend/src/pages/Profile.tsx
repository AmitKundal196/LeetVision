import React from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import { useAuth } from '../store/AuthContext';
import { User, MapPin, Award, Code } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile, connected, isLoading } = useLeetCodeProfile();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="h-14 w-64 bg-card border border-border rounded-lg shimmer animate-delay-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-delay-200">
          <div className="lg:col-span-1 space-y-6">
            <div className="h-[380px] rounded-2xl glass-panel shimmer" />
            <div className="h-[120px] rounded-2xl glass-panel shimmer" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl glass-panel shimmer" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[200px] rounded-2xl glass-panel shimmer" />
              <div className="h-[200px] rounded-2xl glass-panel shimmer" />
            </div>
            <div className="h-[220px] rounded-2xl glass-panel shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!connected || !profile) {
    return (
      <div className="text-center py-16 glass-panel glass-panel-hover rounded-2xl max-w-xl mx-auto mt-12">
        <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground">No Profile Connected</h3>
        <p className="text-xs text-muted-foreground mt-1">Please connect your LeetCode profile on the dashboard to access your candidate card.</p>
      </div>
    );
  }

  const { profileDetails, badges, languageStats, solvedStats, recentSubmissions } = profile;
  const filteredLanguages = (languageStats || []).filter(l => l.problemsSolved > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Developer Space</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Your verified candidate card and performance stats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Premium Digital Developer Card */}
        <div className="lg:col-span-1 space-y-6 animate-fade-in animate-delay-100">
          <div className="relative rounded-2xl border border-zinc-800 bg-black overflow-hidden shadow-2xl p-6 flex flex-col justify-between min-h-[380px] border-t-zinc-600">
            {/* Holographic glowing orb background */}
            <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-6 z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">Candidate Pass</span>
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={profileDetails.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                  alt="avatar"
                  className="h-16 w-16 rounded-xl border border-zinc-800 bg-zinc-900 object-cover"
                />
                <div>
                  <h2 className="text-base font-bold text-foreground truncate max-w-[150px]">
                    {profileDetails.realName || user?.name || profile.username}
                  </h2>
                  <span className="text-xs text-zinc-500 font-semibold block">@{profile.username}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-900 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Global Rank</span>
                  <span className="font-bold text-foreground">#{profile.ranking.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Solved Rate</span>
                  <span className="font-bold text-foreground">{solvedStats.total} Questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target company</span>
                  <span className="font-bold text-foreground">{user?.onboarding?.targetCompany || 'Tech Companies'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-zinc-600 uppercase tracking-wider block font-bold">LeetVision ID</span>
                  <code className="text-[9px] text-zinc-400 font-mono">LV-{profile.userId.substring(0, 8).toUpperCase()}</code>
                </div>
                {/* Simulated Barcode */}
                <div className="h-6 w-24 bg-zinc-900 flex gap-0.5 px-1 py-0.5 rounded items-center">
                  {[1,3,2,1,4,2,3,1,2,2,1].map((w, idx) => (
                    <div key={idx} className="bg-zinc-500 h-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Bio Details */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Bio details</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              {profileDetails.aboutMe || 'No biography details synchronized from LeetCode.'}
            </p>
            {profileDetails.countryName && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <MapPin className="h-4 w-4" />
                <span>{profileDetails.countryName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Performance & Timelines */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in animate-delay-200">
          
          {/* LeetCode & Goal Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Solved Rate</span>
              <div className="text-xl font-extrabold text-foreground">{solvedStats.total} / {solvedStats.totalQuestions}</div>
              <p className="text-[9px] text-muted-foreground font-semibold">E: {solvedStats.easy} • M: {solvedStats.medium} • H: {solvedStats.hard}</p>
            </div>
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Acceptance Rate</span>
              <div className="text-xl font-extrabold text-foreground">{profile.acceptanceRate}%</div>
            </div>
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-bold text-[#ffc01e] uppercase tracking-widest block">Daily Goal</span>
              <div className="text-xl font-extrabold text-foreground">{user?.onboarding?.dailyGoal || 3} solved</div>
            </div>
          </div>

          {/* Languages and Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Languages actually used */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <Code className="h-4 w-4" /> Language Proficiencies
              </h3>
              {filteredLanguages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No compile history detected.</p>
              ) : (
                <div className="space-y-3">
                  {filteredLanguages.map((l, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{l.languageName}</span>
                        <span className="text-muted-foreground">{l.problemsSolved} solved</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white"
                          style={{ 
                            width: `${(l.problemsSolved / Math.max(...filteredLanguages.map(x => x.problemsSolved), 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Earned Credentials */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4" /> Credentials
              </h3>
              {badges.length === 0 ? (
                <p className="text-xs text-muted-foreground">No credentials synchronized yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                  {badges.map((b, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-2 rounded-lg border border-border bg-background space-y-1 hover:bg-accent/10 transition-colors">
                      <img
                        src={b.icon || 'https://assets.leetcode.com/static_assets/marketing/2026-50.png'}
                        alt={b.name}
                        className="h-8 w-8 object-contain drop-shadow"
                        onError={(e) => { e.currentTarget.src = 'https://assets.leetcode.com/static_assets/marketing/2026-50.png'; }}
                      />
                      <h4 className="text-[9px] font-bold text-foreground leading-tight truncate w-full">{b.name}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Submissions Timeline</h3>
            {recentSubmissions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent submissions found.</p>
            ) : (
              <div className="relative border-l border-border pl-4 ml-2 space-y-6 max-h-[220px] overflow-y-auto pr-1">
                {recentSubmissions.slice(0, 5).map((sub, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700 border border-card group-hover:bg-foreground transition-colors" />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{sub.title}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {sub.timestamp ? new Date(Number(sub.timestamp) * 1000).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex gap-3">
                        <span>Language: {sub.language || '--'}</span>
                        <span>Status: <span className={sub.status === 'Accepted' || sub.status.toLowerCase() === 'accepted' ? 'text-lc-easy font-bold' : 'text-red-500 font-bold'}>{sub.status || '--'}</span></span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
