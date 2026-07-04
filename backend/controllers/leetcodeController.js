import { dbService } from '../services/dbService.js';
import { fetchLeetCodeData, validateLeetCodeUsername } from '../graphql/leetcodeClient.js';
import { runAnalyticsEngine } from '../services/analyticsEngine.js';

export async function syncProfile(req, res) {
  const userId = req.user.id;
  const force = req.query.force === 'true';
  const startTime = Date.now();

  try {
    const user = await dbService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Get username from request body (onboarding/connection phase) or user's stored onboarding
    const username = req.body.leetcodeUsername || user.onboarding?.leetcodeUsername;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'NoProfileConnected',
        message: 'No LeetCode profile connected. Please run onboarding or provide a username.'
      });
    }

    // Fetch existing profile to check sync cooldown (Rate limit: 1 sync per 10 minutes)
    // For demo purposes, we will bypass if force=true
    const existingProfile = await dbService.findLeetCodeProfile({ userId });
    if (existingProfile && !force) {
      const cooldownMs = 10 * 60 * 1000; // 10 minutes
      const timeSinceLastSync = Date.now() - new Date(existingProfile.lastSynced).getTime();
      
      if (timeSinceLastSync < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSync) / 1000);
        return res.status(429).json({
          success: false,
          error: 'RateLimited',
          message: `Sync cooldown active. Please wait ${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s.`,
          remainingSeconds
        });
      }
    }

    // Validate username on LeetCode first if connecting for the first time
    if (req.body.leetcodeUsername) {
      const isValid = await validateLeetCodeUsername(username);
      if (!isValid) {
        // Log the failure
        await dbService.createSyncLog({
          userId,
          username,
          status: 'failed',
          message: `Username verification failed: ${username} does not exist.`,
          durationMs: Date.now() - startTime
        });

        return res.status(400).json({
          success: false,
          error: 'InvalidUsername',
          message: `The LeetCode username "${username}" could not be found. Please check spelling.`
        });
      }
    }

    // Trigger sync
    console.log(`Syncing profile for ${username} (user ID: ${userId})...`);
    const leetcodeData = await fetchLeetCodeData(username);

    // Save profile to database
    const savedProfile = await dbService.saveLeetCodeProfile(userId, username, {
      ...leetcodeData,
      lastSynced: new Date().toISOString()
    });

    // If username was changed/connected during sync, save it to user onboarding too
    if (req.body.leetcodeUsername) {
      await dbService.updateUser(
        { _id: userId },
        {
          $set: {
            isOnboarded: true,
            'onboarding.leetcodeUsername': username
          }
        }
      );
    }

    // Generate and save analytics
    const generated = runAnalyticsEngine(savedProfile);
    const finalProfile = await dbService.saveLeetCodeProfile(userId, username, {
      generatedAnalytics: generated
    });

    // Log success
    const durationMs = Date.now() - startTime;
    await dbService.createSyncLog({
      userId,
      username,
      status: 'success',
      message: `Profile synced successfully (Total solved: ${leetcodeData.solvedStats?.total}).`,
      durationMs
    });

    res.json({
      success: true,
      message: 'Profile synchronized successfully.',
      profile: finalProfile
    });

  } catch (error) {
    const durationMs = Date.now() - startTime;
    const username = req.body.leetcodeUsername || 'unknown';

    await dbService.createSyncLog({
      userId,
      username,
      status: 'failed',
      message: error.message,
      durationMs
    });

    res.status(500).json({
      success: false,
      error: 'SyncFailed',
      message: `Failed to sync LeetCode profile: ${error.message}`
    });
  }
}

export async function getProfile(req, res) {
  const userId = req.user.id;
  try {
    let profile = await dbService.findLeetCodeProfile({ userId });
    
    if (!profile) {
      return res.status(200).json({
        success: true,
        connected: false,
        profile: null,
        message: 'No LeetCode profile connected.'
      });
    }

    // On-the-fly calculation if missing
    if (!profile.generatedAnalytics) {
      const generated = runAnalyticsEngine(profile);
      profile = await dbService.saveLeetCodeProfile(userId, profile.username, {
        generatedAnalytics: generated
      });
    }

    res.json({
      success: true,
      connected: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'FetchFailed',
      message: `Failed to retrieve profile: ${error.message}`
    });
  }
}

export async function getSyncLogsForUser(req, res) {
  const userId = req.user.id;
  try {
    const logs = await dbService.getSyncLogs({ userId });
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'LogsFetchFailed',
      message: `Failed to retrieve sync logs: ${error.message}`
    });
  }
}
