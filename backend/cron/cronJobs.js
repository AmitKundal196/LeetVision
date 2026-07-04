import cron from 'node-cron';
import { dbService } from '../services/dbService.js';
import { fetchLeetCodeData } from '../graphql/leetcodeClient.js';

export function initCronJobs() {
  console.log('⏰ Initializing background cron jobs...');

  // Run a background sync every 12 hours
  // Cron expression: 0 */12 * * *
  cron.schedule('0 */12 * * *', async () => {
    console.log('⏰ Starting background LeetCode synchronization cron job...');
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;

    try {
      const users = await dbService.getAllUsers();
      const onboardedUsers = users.filter(u => u.isOnboarded && u.onboarding?.leetcodeUsername);

      console.log(`⏰ Found ${onboardedUsers.length} onboarded profiles to synchronize.`);

      for (const user of onboardedUsers) {
        const username = user.onboarding.leetcodeUsername;
        try {
          const syncStart = Date.now();
          console.log(`⏰ Background syncing for user: ${username}...`);
          
          const leetcodeData = await fetchLeetCodeData(username);
          await dbService.saveLeetCodeProfile(user._id, username, {
            ...leetcodeData,
            lastSynced: new Date().toISOString()
          });

          await dbService.createSyncLog({
            userId: user._id,
            username,
            status: 'success',
            message: `Background cron sync successful. Total Solved: ${leetcodeData.solvedStats?.total}`,
            durationMs: Date.now() - syncStart
          });
          successCount++;
        } catch (err) {
          console.error(`⏰ Failed to background sync ${username}:`, err.message);
          await dbService.createSyncLog({
            userId: user._id,
            username,
            status: 'failed',
            message: `Background sync failed: ${err.message}`,
            durationMs: 0
          });
          failureCount++;
        }
      }

      console.log(`⏰ Cron sync complete. Success: ${successCount}, Failures: ${failureCount}, Time: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
    } catch (err) {
      console.error('⏰ Error during background cron execution:', err);
    }
  });

  // Also schedule a quick 1-minute notification check to verify the system logs are working during development
  cron.schedule('0 * * * *', () => {
    console.log('💓 System Cron Healthcheck: Server is alive and cron scheduler is active.');
  });
}
