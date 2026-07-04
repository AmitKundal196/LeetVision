import express from 'express';
import { getUsers, getSyncLogs, getServerHealth } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.get('/sync-logs', authenticateToken, getSyncLogs);
router.get('/health', authenticateToken, getServerHealth);

export default router;
