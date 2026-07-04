import express from 'express';
import { syncProfile, getProfile, getSyncLogsForUser } from '../controllers/leetcodeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', authenticateToken, syncProfile);
router.get('/profile', authenticateToken, getProfile);
router.get('/sync-logs', authenticateToken, getSyncLogsForUser);

export default router;
