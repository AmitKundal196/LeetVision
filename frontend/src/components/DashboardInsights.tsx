import React from 'react';
import { Sparkles, TrendingUp, Flame, AlertCircle } from 'lucide-react';

interface DashboardInsightsProps {
  insights: string[];
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({ insights = [] }) => {
  if (insights.length === 0) return null;

  const renderedList = insights.map((text) => {
    let Icon = Sparkles;
    let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15';

    const lower = text.toLowerCase();
    if (lower.includes('streak') || lower.includes('active days')) {
      Icon = Flame;
      color = 'text-orange-500 bg-orange-500/10 border-orange-500/15';
    } else if (lower.includes('untouched') || lower.includes('left') || lower.includes('no submissions')) {
      Icon = AlertCircle;
      color = 'text-rose-500 bg-rose-500/10 border-rose-500/15';
    } else if (lower.includes('productive') || lower.includes('hour') || lower.includes('ratio')) {
      Icon = TrendingUp;
      color = 'text-blue-500 bg-blue-500/10 border-blue-500/15';
    }

    return { Icon, color, text };
  });

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-medium">Developer Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderedList.slice(0, 3).map((item, idx) => {
          const Icon = item.Icon;
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-150 hover:-translate-y-0.5 ${item.color}`}
            >
              <Icon className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed text-foreground/90">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DashboardInsights;
