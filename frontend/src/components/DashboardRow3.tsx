import React from 'react';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { 
  SubmissionTimelineChart, 
  LanguageUsageChart, 
  TopicDistributionBarChart 
} from './AnalyticsCharts';

interface DashboardRow3Props {
  recentSubmissions: any[];
  submissionCalendar: string;
  languages: { languageName: string; problemsSolved: number }[];
  topics: any[];
}

export const DashboardRow3: React.FC<DashboardRow3Props> = ({ 
  recentSubmissions = [], 
  submissionCalendar = '{}', 
  languages = [], 
  topics = [] 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Synchronized Event Logs</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Accepted Problems Table */}
        <div className="lg:col-span-2">
          <DashboardRecentActivity submissions={recentSubmissions} />
        </div>

        {/* Charts Sidebar Stack */}
        <div className="space-y-6">
          <SubmissionTimelineChart submissionCalendar={submissionCalendar} />
          <LanguageUsageChart languages={languages} />
          <TopicDistributionBarChart topics={topics} />
        </div>
      </div>
    </div>
  );
};
export default DashboardRow3;
