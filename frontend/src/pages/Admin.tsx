import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { ServerHealth, SyncLog } from '../types';
import { Shield, Server, Database, Activity, RefreshCw } from 'lucide-react';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'health' | 'users' | 'logs'>('health');
  
  const [health, setHealth] = useState<ServerHealth | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, usersRes, logsRes] = await Promise.all([
        api.get('/admin/health'),
        api.get('/admin/users'),
        api.get('/admin/sync-logs')
      ]);

      if (healthRes.data.success) setHealth(healthRes.data.health);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (logsRes.data.success) setLogs(logsRes.data.logs);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 rounded bg-card border border-border shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 rounded bg-card border border-border shimmer" />
          <div className="h-32 rounded bg-card border border-border shimmer" />
          <div className="h-32 rounded bg-card border border-border shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" /> Admin Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Monitor server environment health, synchronized accounts, and security audit logs.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all duration-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Console</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-semibold space-x-6">
        {(['health', 'users', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'health' ? 'Server Health' : tab === 'users' ? 'Registered Users' : 'Sync Logs'}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div className="mt-4">
        
        {/* Tab 1: Health */}
        {activeTab === 'health' && health && (
          <div className="space-y-6">
            
            {/* Health indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Server Health</span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[#10b981]">ONLINE (HEALTHY)</span>
                    <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
                  </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
                  <Activity className="h-8 w-8 text-[#10b981]" />
                </div>
              </div>

              <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Active Database</span>
                  <span className="text-base font-bold text-foreground">{health.database.type}</span>
                </div>
                <Database className="h-8 w-8 text-[#ffffff]" />
              </div>

              <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-2 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Node Server Memory</span>
                  <span className="text-base font-bold text-foreground">{health.memory.percentage}%</span>
                </div>
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            {/* Detailed System info */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resource Utilization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Operating System</span>
                  <span className="font-semibold text-foreground">{health.system.os} ({health.system.platform} {health.system.arch})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Processor</span>
                  <span className="font-semibold text-foreground">{health.system.cpuModel} ({health.system.cpus} Cores)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Server Uptime</span>
                  <span className="font-semibold text-foreground">{Math.floor(health.uptime.process / 3600)}h {Math.floor((health.uptime.process % 3600) / 60)}m active</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Average Sync latency</span>
                  <span className="font-semibold text-foreground">{health.syncStats.averageLatencyMs} ms</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === 'users' && (
          <div className="glass-panel glass-panel-hover rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Platform Developer Index ({users.length})</h3>
            {users.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No users registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5">User</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">LeetCode profile</th>
                      <th className="py-2.5">Provider</th>
                      <th className="py-2.5">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-accent/20 transition-colors">
                        <td className="py-3 font-semibold text-foreground">{user.name}</td>
                        <td className="py-3 text-muted-foreground">{user.email}</td>
                        <td className="py-3 text-muted-foreground font-medium">
                          {user.leetcodeUsername ? `@${user.leetcodeUsername}` : <span className="text-zinc-600">Not Connected</span>}
                        </td>
                        <td className="py-3 text-muted-foreground capitalize">{user.provider}</td>
                        <td className="py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Logs */}
        {activeTab === 'logs' && (
          <div className="glass-panel glass-panel-hover rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Security & Sync Operations History</h3>
            {logs.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No logs recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5">Timestamp</th>
                      <th className="py-2.5">Username</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Sync runtime</th>
                      <th className="py-2.5">Message / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {logs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-accent/20 transition-colors">
                        <td className="py-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-3 font-semibold text-foreground">@{log.username}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            log.status === 'success' ? 'bg-[#10b981]/10 text-lc-easy' : 'bg-red-500/10 text-lc-hard'
                          }`}>
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">{log.durationMs} ms</td>
                        <td className="py-3 text-muted-foreground truncate max-w-xs" title={log.message}>
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
export default Admin;
