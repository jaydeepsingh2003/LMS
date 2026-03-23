import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './config/env.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import subjectRoutes from './modules/subjects/subject.routes.js';
import videoRoutes from './modules/videos/video.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import { prisma } from './config/prisma.js';


dotenv.config();

// Environment Diagnostics
if (!process.env.DATABASE_URL) console.warn('⚠️ [CONFIG_WARN]: DATABASE_URL is missing.');
if (!process.env.JWT_ACCESS_SECRET) console.warn('⚠️ [CONFIG_WARN]: JWT_ACCESS_SECRET is missing, using default.');

// Global BigInt serialization fix for Prisma + JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
const port = env.PORT || 5000;

app.use(cors({
  origin: '*', // For debugging, allow all. Change to specific domain in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Root route
app.get('/', (req, res) => {
  res.json({ message: 'LMS API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database connectivity check
app.get('/api/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'connected', message: 'Database is reachable' });
  } catch (error: any) {
    console.error('❌ [DB_CHECK_FAILED]:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// For Vercel Serverless Functions
export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

