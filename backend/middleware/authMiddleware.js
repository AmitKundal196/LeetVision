import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Token Required',
      message: 'You must sign in to access this resource.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_access_key_123_leetvision_ai', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'TokenExpired',
          message: 'Your session has expired. Please refresh your token.'
        });
      }
      return res.status(403).json({
        success: false,
        error: 'InvalidToken',
        message: 'Your login session is invalid. Please sign in again.'
      });
    }

    req.user = user;
    next();
  });
}
