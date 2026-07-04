import os from 'os';
import { dbService } from '../services/dbService.js';
import { getIsMongoConnected } from '../config/db.js';

export async function getUsers(req, res) {
  try {
    const users = await dbService.getAllUsers();
    // Sanitize user details before sending
    const sanitizedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      isOnboarded: u.isOnboarded,
      leetcodeUsername: u.onboarding?.leetcodeUsername || '',
      createdAt: u.createdAt
    }));
    res.json({ success: true, users: sanitizedUsers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getSyncLogs(req, res) {
  try {
    const logs = await dbService.getSyncLogs({});
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getServerHealth(req, res) {
  try {
    const isMongoConnected = getIsMongoConnected();
    const systemUptime = os.uptime();
    const processUptime = process.uptime();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercentage = ((usedMem / totalMem) * 100).toFixed(2);

    const loadAverage = os.loadavg ? os.loadavg() : [0, 0, 0];
    const cpus = os.cpus() || [];

    // Calculate average sync duration from logs
    const recentLogs = await dbService.getSyncLogs({});
    const successfulSyncs = recentLogs.filter(l => l.status === 'success');
    const averageSyncDuration = successfulSyncs.length > 0
      ? Math.round(successfulSyncs.reduce((acc, log) => acc + log.durationMs, 0) / successfulSyncs.length)
      : 0;

    res.json({
      success: true,
      health: {
        status: 'healthy',
        database: {
          type: isMongoConnected ? 'MongoDB Atlas' : 'Local Fallback (JSON File)',
          connected: isMongoConnected
        },
        system: {
          os: os.type(),
          platform: os.platform(),
          arch: os.arch(),
          cpus: cpus.length,
          cpuModel: cpus[0]?.model || 'Unknown',
          loadAverage
        },
        uptime: {
          system: systemUptime,
          process: processUptime
        },
        memory: {
          total: totalMem,
          free: freeMem,
          used: usedMem,
          percentage: parseFloat(memUsagePercentage)
        },
        syncStats: {
          totalLogsCount: recentLogs.length,
          successCount: successfulSyncs.length,
          failureCount: recentLogs.length - successfulSyncs.length,
          averageLatencyMs: averageSyncDuration
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
