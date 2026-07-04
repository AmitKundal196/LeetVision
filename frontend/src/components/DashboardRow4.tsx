import React from 'react';
import { Target, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

interface DashboardRow4Props {
  weakTopics: { name: string; slug: string; solved: number }[];
  strongTopics: { name: string; slug: string; solved: number }[];
  patternProgress: { 
    name: string; 
    slug: string; 
    solved: number; 
    percentage: number; 
    recommendedQuestion: { title: string; titleSlug: string; difficulty: string } 
  }[];
  recommendations: { title: string; titleSlug: string; difficulty: string; tag: string; pattern: string }[];
}

export const DashboardRow4: React.FC<DashboardRow4Props> = ({ 
  weakTopics = [], 
  strongTopics = [], 
  patternProgress = [], 
  recommendations = [] 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pattern Progress & Deep Dives</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Weak Topics */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertCircle className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Weak Topics</h4>
          </div>
          <div className="space-y-3">
            {weakTopics.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No Weak Topics found.</p>
            ) : (
              weakTopics.slice(0, 3).map(t => (
                <div key={t.slug} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="text-muted-foreground text-[10px]">{t.solved} solved</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Strong Topics */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#06b6d4]">
            <TrendingUp className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Strong Topics</h4>
          </div>
          <div className="space-y-3">
            {strongTopics.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No solved problem records yet.</p>
            ) : (
              strongTopics.slice(0, 3).map(t => (
                <div key={t.slug} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="text-[#06b6d4] text-[10px] font-bold">{t.solved} solved</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Pattern Progress Preview */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Pattern Progress</h4>
          </div>
          <div className="space-y-3">
            {patternProgress.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No pattern data synced.</p>
            ) : (
              patternProgress.slice(0, 3).map(p => (
                <div key={p.slug} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-foreground">{p.name} <span className="text-muted-foreground ml-1">({p.solved} solved)</span></span>
                    <span className="text-muted-foreground">{p.percentage}% of total</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${p.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Recommended Problems */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#ffc01e]">
            <BookOpen className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Target Recommendations</h4>
          </div>
          <div className="space-y-2.5">
            {recommendations.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No recommendations yet.</p>
            ) : (
              recommendations.slice(0, 3).map(prob => (
                <div key={prob.titleSlug} className="text-xs flex flex-col gap-0.5">
                  <a
                    href={`https://leetcode.com/problems/${prob.titleSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:underline truncate text-foreground block max-w-[170px]"
                  >
                    {prob.title}
                  </a>
                  <span className="text-[9px] text-muted-foreground">
                    Topic: {prob.pattern || prob.tag} • <span className={prob.difficulty === 'Easy' ? 'text-lc-easy' : prob.difficulty === 'Medium' ? 'text-[#ffc01e]' : 'text-lc-hard'}>{prob.difficulty}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardRow4;
