import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_access_key_123_leetvision_ai';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_123_leetvision_ai';

// Helper to generate tokens
function generateTokens(user, rememberMe = false) {
  const payload = { id: user._id, email: user.email, name: user.name };
  const refreshExpiry = rememberMe ? '30d' : '7d';
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: refreshExpiry });
  
  return { accessToken, refreshToken };
}

export async function register(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const existingUser = await dbService.findUser({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbService.createUser({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      provider: 'email',
      isOnboarded: false
    });

    const { accessToken, refreshToken } = generateTokens(user);
    await dbService.updateUser({ _id: user._id }, { $set: { refreshToken } });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
        onboarding: user.onboarding
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Registration failed: ${error.message}` });
  }
}

export async function login(req, res) {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const user = await dbService.findUser({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (user.provider !== 'email') {
      const providerName = user.provider.charAt(0).toUpperCase() + user.provider.slice(1);
      return res.status(401).json({ success: false, error: `This email is registered via ${providerName}. Please sign in with ${providerName}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user, rememberMe);
    await dbService.updateUser({ _id: user._id }, { $set: { refreshToken, rememberMe: !!rememberMe } });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
        onboarding: user.onboarding
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Login failed: ${error.message}` });
  }
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'Refresh token is required.' });
  }

  try {
    const user = await dbService.findUser({ refreshToken });
    if (!user) {
      return res.status(403).json({ success: false, error: 'Invalid or expired refresh token.' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, error: 'Invalid or expired refresh token.' });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, user.rememberMe);
      
      // Update new refresh token in database (token rotation)
      dbService.updateUser({ _id: user._id }, { $set: { refreshToken: newRefreshToken } })
        .then(() => {
          res.json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
          });
        })
        .catch(err => {
          res.status(500).json({ success: false, error: `Token rotation failed: ${err.message}` });
        });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Token refresh failed: ${error.message}` });
  }
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await dbService.updateUser({ refreshToken }, { $set: { refreshToken: '' } });
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: `Logout failed: ${error.message}` });
  }
}

export async function oauthMock(req, res) {
  const { provider } = req.params; // 'google' or 'github'
  const email = req.body.email || `${provider}_test_user@leetvision.ai`;
  // Make the name realistic by parsing the email prefix (e.g., 'amitkundal1998' -> 'Amitkundal 1998')
  const emailPrefix = email.split('@')[0];
  const name = req.body.name || emailPrefix.replace(/([0-9]+)/g, ' $1').replace(/^./, str => str.toUpperCase());
  const avatarUrl = provider === 'github' ? 'https://github.com/identicons/github.png' : 'https://lh3.googleusercontent.com/a/default-user=s96-c';

  try {
    let user = await dbService.findUser({ email });
    if (!user) {
      user = await dbService.createUser({
        email,
        name,
        provider,
        avatarUrl,
        isOnboarded: false
      });
    } else {
      // Force onboarding reset for demo purposes so they don't see wrong details
      user = await dbService.updateUser(
        { _id: user._id }, 
        { $set: { isOnboarded: false, 'onboarding.leetcodeUsername': '' } }
      );
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await dbService.updateUser({ _id: user._id }, { $set: { refreshToken } });

    res.json({
      success: true,
      message: `OAuth login simulated via ${provider}.`,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
        onboarding: user.onboarding,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `OAuth Simulation failed: ${error.message}` });
  }
}

export async function saveOnboarding(req, res) {
  const { leetcodeUsername, targetCompany, preferredLanguage, dailyGoal, interviewDate } = req.body;
  const userId = req.user.id;

  if (!leetcodeUsername) {
    return res.status(400).json({ success: false, error: 'LeetCode Username is required.' });
  }

  try {
    // Save onboarding details to user
    const updatedUser = await dbService.updateUser(
      { _id: userId },
      {
        $set: {
          isOnboarded: true,
          onboarding: {
            leetcodeUsername,
            targetCompany: targetCompany || '',
            preferredLanguage: preferredLanguage || 'JavaScript',
            dailyGoal: parseInt(dailyGoal) || 3,
            interviewDate: interviewDate ? new Date(interviewDate) : null
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Onboarding completed successfully.',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        isOnboarded: updatedUser.isOnboarded,
        onboarding: updatedUser.onboarding
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Onboarding failed: ${error.message}` });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

  try {
    const user = await dbService.findUser({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    // In a real app, generate a reset token and email it here.
    // For demo purposes, we'll just simulate a successful email send.
    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, error: `Failed to process request: ${error.message}` });
  }
}

export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ success: false, error: 'Email and new password are required.' });

  try {
    const user = await dbService.findUser({ email });
    if (!user) {
      // Return success to prevent email enumeration, but we won't change anything
      return res.json({ success: true, message: 'Password has been reset successfully.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password and ensure they can log in via email now
    await dbService.updateUser(
      { _id: user._id },
      { $set: { password: hashedPassword, provider: 'email' } }
    );

    res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: `Failed to reset password: ${error.message}` });
  }
}
