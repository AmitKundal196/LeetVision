import React, { useState, useEffect } from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import api from '../services/api';
import { Terminal, Database, Code, FileText, Settings } from 'lucide-react';

export const Debug: React.FC = () => {
  const { profile, connected } = useLeetCodeProfile();
  const [activeTab, setActiveTab] = useState<'profile' | 'analytics' | 'logs' | 'patterns'>('profile');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/leetcode/sync-logs');
        if (res.data?.success) setLogs(res.data.logs || []);
      } catch (e) {
        console.warn('Failed to fetch sync logs for debugger', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [profile]);

  if (!connected || !profile) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center p-8 border border-border bg-card rounded-xl">
        <Terminal className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Debugger Offline</h3>
        <p className="text-xs text-muted-foreground mt-1">Connect your LeetCode profile on the dashboard to access developer metrics.</p>
      </div>
    );
  }

  const PATTERN_MAPPING = {
    'Two Pointer': ['two-pointers', 'array'],
    'Sliding Window': ['sliding-window'],
    'Binary Search': ['binary-search'],
    'Hashing': ['hash-table'],
    'Prefix Sum': ['prefix-sum'],
    'Linked List': ['linked-list'],
    'DFS': ['depth-first-search'],
    'BFS': ['breadth-first-search'],
    'Trees': ['tree'],
    'Graphs': ['graph'],
    'Heap': ['heap'],
    'Greedy': ['greedy'],
    'Backtracking': ['backtracking'],
    'Dynamic Programming': ['dynamic-programming'],
    'Bit Manipulation': ['bit-manipulation'],
    'Math': ['math'],
    'Sorting': ['sorting'],
    'Recursion': ['recursion']
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Terminal className="h-5 w-5 text-red-500" /> Developer Sandbox
        </h1>
        <p className="text-xs text-muted-foreground">Inspect raw MongoDB documents and cached pipeline analytics.</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-px">
        {(['profile', 'analytics', 'logs', 'patterns'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-red-500 text-foreground bg-red-500/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-4 space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Database className="h-3.5 w-3.5" /> Collection: leetcodeprofiles (Raw Document)
            </span>
            <pre className="text-[10px] font-mono p-4 rounded-lg bg-black text-emerald-400 overflow-x-auto max-h-[500px]">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-4 space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Code className="h-3.5 w-3.5" /> Subdocument: generatedAnalytics (Cached Analytics Payload)
            </span>
            <pre className="text-[10px] font-mono p-4 rounded-lg bg-black text-blue-400 overflow-x-auto max-h-[500px]">
              {JSON.stringify(profile.generatedAnalytics, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4 space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> Collection: synclogs (Last 100 entries)
            </span>
            {loading ? (
              <div className="p-4 text-xs text-muted-foreground">Loading sync audit logs...</div>
            ) : (
              <pre className="text-[10px] font-mono p-4 rounded-lg bg-black text-amber-400 overflow-x-auto max-h-[500px]">
                {JSON.stringify(logs, null, 2)}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="p-4 space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Settings className="h-3.5 w-3.5" /> Service Config: patternEngine.js
            </span>
            <div className="p-4 bg-black rounded-lg space-y-3 font-mono text-xs max-h-[500px] overflow-y-auto">
              {Object.entries(PATTERN_MAPPING).map(([pattern, tags]) => (
                <div key={pattern} className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-foreground font-bold">{pattern}</span>
                  <span className="text-zinc-500">Maps to tag slugs: {tags.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debug;
