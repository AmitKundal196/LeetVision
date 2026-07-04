import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leetcodeRoutes from './routes/leetcodeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initCronJobs } from './cron/cronJobs.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // In production, replace with actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/admin', adminRoutes);

// Base route healthcheck
app.get('/api/healthz', (req, res) => {
  res.json({
    success: true,
    message: 'LeetVision AI Backend Server is running.',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('LeetVision AI API Server');
  });
}

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'RouteNotFound',
    message: `Requested route ${req.method} ${req.url} does not exist.`
  });
});

// Global Exception error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Exception:', err);
  res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

// Bootstrap server
async function bootstrap() {
  // Connect to DB (will gracefully fall back to local JSON if MongoDB is not reachable)
  await connectDB();

  // Start cron jobs
  initCronJobs();

  const tryListen = (portToTry) => {
    const server = app.listen(portToTry, () => {
      console.log(`🚀 LeetVision AI Server is running on port ${portToTry} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${portToTry} is occupied. Retrying on port ${portToTry + 1}...`);
        tryListen(Number(portToTry) + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  };
  tryListen(PORT);
}

bootstrap().catch(err => {
  console.error('Fatal bootstrapping error:', err);
  process.exit(1);
});
