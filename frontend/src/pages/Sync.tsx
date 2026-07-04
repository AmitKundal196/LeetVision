import React, { useState, useEffect } from 'react';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import api from '../services/api';
import type { SyncLog } from '../types';
import { RefreshCw, CheckCircle, XCircle, Clock, Server, AlertTriangle } from 'lucide-react';

export const Sync: React.FC = () => {
  const { profile, connected, isLoading, isSyncing, sync, refetch, syncError } = useLeetCodeProfile();
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [dbType, setDbType] = useState('MongoDB');
  const [dbConnected, setDbConnected] = useState(true);
  const [bgSync, setBgSync] = useState(() => localStorage.getItem('background_sync') === 'true');
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogsAndHealth = async () => {
    setLoadingLogs(true);
    try {
      const logsRes = await api.get('/leetcode/sync-logs');
      if (logsRes.data?.success) setLogs(logsRes.data.logs || []);

      const healthRes = await api.get('/admin/health');
      if (healthRes.data?.success && healthRes.data.health) {
        setDbType(healthRes.data.health.database.type);
        setDbConnected(healthRes.data.health.database.connected);
      }
    } catch (e) {
      console.warn('Failed to fetch sync log metadata', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogsAndHealth();
  }, [profile]);

  const handleManualSync = async () => {
    try {
      await sync({ force: true });
      refetch();
      fetchLogsAndHealth();
    } catch (e) {}
  };

  const toggleBgSync = () => {
    const nextVal = !bgSync;
    setBgSync(nextVal);
    localStorage.setItem('background_sync', String(nextVal));
  };

  const lastLog = logs[0];
  const lastError = syncError?.message || (lastLog?.status === 'failed' ? lastLog.message : '');

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl animate-fade-in">
        <div className="h-14 w-64 bg-card border border-border rounded-lg shimmer animate-delay-100" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-delay-200">
          {[1, 2, 3].map(i => <div key={i} className="h-32 glass-panel rounded-2xl shimmer" />)}
        </div>
        <div className="h-20 glass-panel rounded-2xl shimmer animate-delay-300" />
        <div className="h-64 glass-panel rounded-2xl shimmer animate-delay-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sync Center</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Manage and audit LeetCode synchronization pipelines.</p>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in animate-delay-100">
        {/* Status card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Connection Status</span>
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <CheckCircle className="h-5 w-5 text-lc-easy" />
                <span className="text-sm font-semibold text-foreground">Linked: {profile?.username}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-semibold text-foreground">Disconnected</span>
              </>
            )}
          </div>
          {connected && (
            <a 
              href={`https://leetcode.com/${profile?.username}`}
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-zinc-500 hover:text-foreground font-semibold block underline"
            >
              View Public LeetCode Profile
            </a>
          )}
        </div>

        {/* Database Status card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Database Engine</span>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{dbType}</span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-border text-muted-foreground">
            {dbConnected ? 'Active Connection' : 'Service Offline'}
          </span>
        </div>

        {/* Background Sync card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-colors">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Background Polling</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Auto Background Sync</span>
            <button 
              onClick={toggleBgSync}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                bgSync ? 'bg-white' : 'bg-zinc-800'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                bgSync ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'
              }`} />
            </button>
          </div>
          <p className="text-[9px] text-muted-foreground">
            {bgSync ? 'Syncing profile every 12 hours in the background.' : 'Background sync deactivated. Trigger manually.'}
          </p>
        </div>
      </div>

      {/* Sync Error Notice */}
      {lastError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/5 border border-red-500/15 p-4 text-xs text-red-500 max-w-3xl">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-foreground">Last Sync Process Encountered an Error</h4>
            <p className="text-red-500/80 leading-relaxed font-semibold">{lastError}</p>
          </div>
        </div>
      )}

      {/* Manual Sync Trigger Section */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in animate-delay-200">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Synchronize profile details</h3>
          <p className="text-[10px] text-muted-foreground">Force-refreshes problem lists, calendars, and submission timelines from LeetCode.</p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="rounded-lg bg-white text-black px-4 py-2 text-xs font-bold hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronizing Stats...' : 'Run Pipeline Sync'}
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4 animate-fade-in animate-delay-300">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Sync Logs & Audits</h3>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{logs.length} logged events</span>
        </div>

        {loadingLogs && logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Retrieving logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground font-medium">No synchronization runs logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold">
                  <th className="py-2">Status</th>
                  <th className="py-2">Message</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-accent/10 transition-colors">
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        log.status === 'success' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-foreground/90 max-w-[320px] truncate">{log.message}</td>
                    <td className="py-3 text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {log.durationMs}ms</span>
                    </td>
                    <td className="py-3 text-muted-foreground text-right">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sync;
