import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Submission } from '../types';

interface DashboardRecentActivityProps {
  submissions: Submission[];
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({ submissions }) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Submissions</h3>
        <span className="text-[10px] text-muted-foreground/60 font-semibold">{submissions.length} Synchronized</span>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 border border-dashed border-border rounded-lg">
          <span className="text-xs text-muted-foreground">No submissions yet.</span>
          <span className="text-[10px] text-muted-foreground/60">Connect LeetCode and sync to pull submission history.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="py-2.5">Problem</th>
                <th className="py-2.5">Language</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Stats (RT / MEM)</th>
                <th className="py-2.5">Company Data</th>
                <th className="py-2.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {submissions.map((sub, idx) => {
                return (
                  <tr key={idx} className="hover:bg-accent/20 transition-colors group">
                    {/* Problem Name */}
                    <td className="py-3.5 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          sub.difficulty === 'Easy' ? 'bg-lc-easy' : sub.difficulty === 'Medium' ? 'bg-lc-medium' : sub.difficulty === 'Hard' ? 'bg-lc-hard' : 'bg-muted-foreground/45'
                        }`} />
                        <a 
                          href={`https://leetcode.com/problems/${sub.titleSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1 font-semibold"
                        >
                          {sub.title || '--'}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                        </a>
                      </div>
                    </td>

                    {/* Language Used */}
                    <td className="py-3.5 text-muted-foreground">
                      <span className="rounded bg-accent/40 border border-border px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                        {sub.language || '--'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span className={`font-semibold ${sub.status === 'Accepted' || sub.status.toLowerCase() === 'accepted' ? 'text-lc-easy' : 'text-red-500'}`}>
                        {sub.status || '--'}
                      </span>
                    </td>

                    {/* Runtime & Memory */}
                    <td className="py-3.5 text-muted-foreground">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-foreground font-bold">{sub.runtime || '--'}</span>
                        <span className="text-[9px] text-muted-foreground/80">{sub.memory || '--'}</span>
                      </div>
                    </td>

                    {/* Company Tags (Strictly show 'No Company Data') */}
                    <td className="py-3.5 text-muted-foreground">
                      <span className="text-[10px] text-muted-foreground/60 italic font-medium">
                        No Company Data
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-muted-foreground text-right font-medium">
                      {sub.timestamp ? new Date(Number(sub.timestamp) * 1000).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
