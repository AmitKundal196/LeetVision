import React, { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Brush
} from 'recharts';
import type { ContestHistoryItem, LanguageStat, TopicStat } from '../types';

const EASY_COLOR = '#10b981';
const MEDIUM_COLOR = '#ffc01e';
const HARD_COLOR = '#ef4743';

const EmptyChart: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    <div className="flex h-[180px] flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-background/20">
      <span className="text-xs font-semibold text-foreground">No Data Available</span>
      <span className="text-[9px] text-muted-foreground/60 mt-1">{desc}</span>
    </div>
  </div>
);

// 1. Weekly Solved Trend Chart
export const WeeklySolvedTrendChart: React.FC<{ submissionCalendar: string }> = ({ submissionCalendar }) => {
  const data = useMemo(() => {
    try {
      const cal = JSON.parse(submissionCalendar || '{}');
      if (Object.keys(cal).length === 0) return [];
      const weeksData = Array.from({ length: 8 }, (_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (7 * (7 - idx)));
        return { name: `Wk -${7 - idx}`, submissions: 0, startTs: d.getTime() / 1000 - 302400, endTs: d.getTime() / 1000 + 302400 };
      });
      Object.entries(cal).forEach(([ts, val]) => {
        const timestamp = parseInt(ts);
        weeksData.forEach(w => {
          if (timestamp >= w.startTs && timestamp < w.endTs) w.submissions += Number(val);
        });
      });
      return weeksData;
    } catch { return []; }
  }, [submissionCalendar]);

  if (data.length === 0 || data.every(w => w.submissions === 0)) {
    return <EmptyChart title="Weekly Solved Trend" desc="No weekly submission records found." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Solved Trend</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Bar dataKey="submissions" fill="#52525b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 2. Monthly Solved Trend Chart
export const MonthlySolvedTrendChart: React.FC<{ submissionCalendar: string }> = ({ submissionCalendar }) => {
  const data = useMemo(() => {
    try {
      const cal = JSON.parse(submissionCalendar || '{}');
      if (Object.keys(cal).length === 0) return [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const aggregation = months.map(m => ({ name: m, submissions: 0 }));
      const currentYear = new Date().getFullYear();
      Object.entries(cal).forEach(([ts, val]) => {
        const date = new Date(parseInt(ts) * 1000);
        if (date.getFullYear() === currentYear) aggregation[date.getMonth()].submissions += Number(val);
      });
      return aggregation.every(d => d.submissions === 0) ? [] : aggregation;
    } catch { return []; }
  }, [submissionCalendar]);

  if (data.length === 0) {
    return <EmptyChart title="Monthly Solved Trend" desc="No monthly submissions for the current year." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Solved Trend</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Area type="monotone" dataKey="submissions" stroke="#a1a1aa" strokeWidth={1.5} fillOpacity={1} fill="url(#colorMonth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 3. Difficulty Distribution Chart
export const DifficultyDistributionChart: React.FC<{ easy: number; medium: number; hard: number }> = ({ easy, medium, hard }) => {
  if (easy === 0 && medium === 0 && hard === 0) {
    return <EmptyChart title="Difficulty Distribution" desc="No solved problems statistics found." />;
  }

  const data = [
    { name: 'Easy', value: easy, color: EASY_COLOR },
    { name: 'Medium', value: medium, color: MEDIUM_COLOR },
    { name: 'Hard', value: hard, color: HARD_COLOR }
  ].filter(d => d.value > 0);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty Distribution</h4>
      <div className="h-[180px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
              {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 4. Submission Timeline Chart
export const SubmissionTimelineChart: React.FC<{ submissionCalendar: string }> = ({ submissionCalendar }) => {
  const data = useMemo(() => {
    try {
      const cal = JSON.parse(submissionCalendar || '{}');
      if (Object.keys(cal).length === 0) return [];
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000;
        const dayEnd = dayStart + 86400;
        let count = 0;
        Object.entries(cal).forEach(([ts, val]) => {
          const itemTs = parseInt(ts);
          if (itemTs >= dayStart && itemTs < dayEnd) count += Number(val);
        });
        return { name: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), solved: count };
      });
    } catch { return []; }
  }, [submissionCalendar]);

  if (data.length === 0 || data.every(d => d.solved === 0)) {
    return <EmptyChart title="Submission Timeline" desc="No submissions recorded in the last 30 days." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submission Timeline (30 Days)</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTimeline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Area type="monotone" dataKey="solved" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTimeline)" />
            <Brush dataKey="name" height={20} stroke="#52525b" fill="#09090b" tickFormatter={() => ''} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 5. Contest Rating History Chart
export const ContestRatingHistoryChart: React.FC<{ history: ContestHistoryItem[] }> = ({ history }) => {
  if (!history || history.length === 0) {
    return <EmptyChart title="Contest Rating History" desc="No contest history synced." />;
  }

  const data = history.map(item => ({
    name: item.contestTitle.replace('Weekly Contest ', 'W').replace('Biweekly Contest ', 'B'),
    rating: item.rating
  }));

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contest Rating History</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorContest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc01e" stopOpacity={0.06}/>
                <stop offset="95%" stopColor="#ffc01e" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Area type="monotone" dataKey="rating" stroke="#ffc01e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorContest)" />
            <Brush dataKey="name" height={20} stroke="#52525b" fill="#09090b" tickFormatter={() => ''} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 6. Language Usage Chart
export const LanguageUsageChart: React.FC<{ languages: LanguageStat[] }> = ({ languages }) => {
  const data = useMemo(() => {
    return (languages || []).filter(l => l.problemsSolved > 0).map(l => ({ name: l.languageName, solved: l.problemsSolved }));
  }, [languages]);

  if (data.length === 0) {
    return <EmptyChart title="Language Usage" desc="No language statistics yet. Sync your profile." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language Usage</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <XAxis type="number" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Bar dataKey="solved" fill="#3f3f46" radius={[0, 3, 3, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 7. Topic Distribution Chart
export const TopicDistributionBarChart: React.FC<{ topics: TopicStat[] }> = ({ topics }) => {
  const data = useMemo(() => {
    return (topics || [])
      .filter(t => t.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 7)
      .map(t => ({ name: t.tagName, solved: t.problemsSolved }));
  }, [topics]);

  if (data.length === 0) {
    return <EmptyChart title="Topic Distribution" desc="No topic data." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic Distribution</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={8} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Bar dataKey="solved" fill="#27272a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 8. Problem Growth Chart
export const ProblemGrowthChart: React.FC<{ total: number; submissionCalendar: string }> = ({ total, submissionCalendar }) => {
  const data = useMemo(() => {
    try {
      const cal = JSON.parse(submissionCalendar || '{}');
      if (Object.keys(cal).length === 0) return [];
      const counts = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000;
        const dayEnd = dayStart + 86400;
        let count = 0;
        Object.entries(cal).forEach(([ts, val]) => {
          const itemTs = parseInt(ts);
          if (itemTs >= dayStart && itemTs < dayEnd) count += Number(val);
        });
        return count;
      });
      let current = total;
      const growth = [];
      for (let i = 29; i >= 0; i--) {
        growth.unshift({ count: current });
        current -= counts[i];
      }
      return growth.map((g, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - idx));
        return { name: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), solved: g.count };
      });
    } catch { return []; }
  }, [total, submissionCalendar]);

  if (data.length === 0 || total === 0) {
    return <EmptyChart title="Problem Growth" desc="No synchronized progress recorded." />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cumulative Problem Growth</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Line type="monotone" dataKey="solved" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 9. Acceptance Trend Chart
export const AcceptanceTrendChart: React.FC<{ acceptanceRate: number }> = ({ acceptanceRate }) => {
  if (acceptanceRate === 0) {
    return <EmptyChart title="Acceptance Rate Trend" desc="No submissions history synchronized." />;
  }

  const data = [
    { name: 'Acceptance', rate: acceptanceRate, fill: EASY_COLOR },
    { name: 'Average', rate: 52.4, fill: '#52525b' }
  ];

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acceptance Trend Comparison</h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
            <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '6px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
