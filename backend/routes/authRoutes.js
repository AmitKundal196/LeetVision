import express from 'express';
import { register, login, refresh, logout, oauthMock, saveOnboarding, forgotPassword, resetPassword, googleLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/oauth/google', googleLogin);
router.post('/oauth/mock/:provider', oauthMock);
router.post('/onboarding', authenticateToken, saveOnboarding);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
