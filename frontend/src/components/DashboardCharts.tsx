import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import type { LanguageStat, TopicStat } from '../types';

const PIE_COLORS = ['#39d353', '#06b6d4', '#ffc01e', '#a1a1aa'];

// --- LANGUAGE PIE CHART ---
interface LanguageChartProps {
  languages: LanguageStat[];
}

export const LanguageDistributionChart: React.FC<LanguageChartProps> = ({ languages }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center glass-panel glass-panel-hover rounded-2xl p-6 text-center">
        <span className="text-xs text-muted-foreground">No language statistics yet.</span>
        <span className="text-[10px] text-muted-foreground/60 mt-1">Sync your profile to aggregate compiler details.</span>
      </div>
    );
  }

  const data = languages.map(l => ({ name: l.languageName, value: l.problemsSolved }));

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Languages Solved</h3>
      <div className="flex h-[180px] items-center justify-between gap-4">
        <div className="h-full w-[45%]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e1e24', borderRadius: '8px' }}
                itemStyle={{ color: '#fafafa', fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                <span className="font-medium text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value} Qs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- TOPIC RADAR CHART ---
interface TopicChartProps {
  topics: TopicStat[];
}

export const TopicDistributionChart: React.FC<TopicChartProps> = ({ topics }) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center glass-panel glass-panel-hover rounded-2xl p-6 text-center">
        <span className="text-xs text-muted-foreground">No topic data available.</span>
        <span className="text-[10px] text-muted-foreground/60 mt-1">Connect profile to display topic metrics.</span>
      </div>
    );
  }

  // Pick top 6 topics to make the radar map readable and aesthetic
  const data = [...topics]
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 6)
    .map(t => ({
      subject: t.tagName,
      A: t.problemsSolved,
    }));

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic Index Distribution</h3>
      <div className="h-[180px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1e1e24" />
            <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={9} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} stroke="#52525b" fontSize={7} />
            <Radar name="Solved" dataKey="A" stroke="#ffffff" fill="#ffffff" fillOpacity={0.07} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
