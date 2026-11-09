
import 'dotenv/config';

import express from 'express';

import cors from 'cors';

import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';

import { connectDB, runDatabaseVerification, dbState } from './config/db.js';

import User from './models/User.js';

import Skill from './models/Skill.js';

import Session from './models/Session.js';

import Feedback from './models/Feedback.js';

import authRoutes from './routes/authRoutes.js';

import skillRoutes from './routes/skillRoutes.js';

import slotRoutes from './routes/slotRoutes.js';

import sessionRoutes from './routes/sessionRoutes.js';

import messageRoutes from './routes/messageRoutes.js';

import feedbackRoutes from './routes/feedbackRoutes.js';

import userRoutes from './routes/userRoutes.js';

import matchRoutes from './routes/matchRoutes.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

// connect it to Data Base

await connectDB();

// Middleware

app.use(cors());

app.use(express.json());

// Request logger middleware

app.use((req, res, next) => {

  const timestamp = new Date().toLocaleTimeString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  next();

});

/* ==========================================================

   MOUNT AUTHENTICATION & SECURITY ROUTES

   ========================================================== */

app.use('/api/auth', authRoutes);

/* ==========================================================

   MOUNT SKILLS CRUD ROUTES

   ========================================================== */

app.use('/api/skills', skillRoutes);

app.use('/api/slots', slotRoutes);

app.use('/api/sessions', sessionRoutes);

app.use('/api/messages', messageRoutes);

app.use('/api/feedback', feedbackRoutes);

app.use('/api/users', userRoutes);

app.use('/api/matches', matchRoutes);

/* ==========================================================

   DATABASE VERIFICATION & TESTING ENDPOINT

   ========================================================== */

app.get('/api/database/verify', async (req, res) => {

  try {

    const report = await runDatabaseVerification();

    res.json(report);

  } catch (err) {

    res.status(500).json({

      error: 'Database verification failed',

      details: err.message

    });

  }

});

/* ==========================================================

   PLATFORM REST ENDPOINTS

   ========================================================== */

// 1. Health & Platform Stats

app.get('/api/health', (req, res) => {

  res.json({

    status: 'online',

    platform: 'SkillSwap API Server',

    university: 'RV University - CS3301 Full Stack Development',

    team: [

      'Hemanth B Y (1RUA24SCS0041)',

      'C Namith Jain (1RUA24SCS0021)',

      'N Gnana Prakash (1RUA24SCS0062)'

    ],

    databaseMode: dbState.connectionType,

    security: 'JWT (HMAC-SHA256) + bcrypt (10 rounds)',

    timestamp: new Date().toISOString()

  });

});

app.get('/api/stats', async (req, res) => {

  try {

    const [

      totalUsers,

      totalSkills,

      activeSessions,

      completedSessions,

      feedbackStats

    ] = await Promise.all([

      User.countDocuments(),

      Skill.countDocuments(),

      Session.countDocuments({ status: 'confirmed' }),

      Session.countDocuments({ status: 'completed' }),

      Feedback.aggregate([

        {

          $group: {

            _id: null,

            averageRating: { $avg: '$rating' }

          }

        }

      ])

    ]);

    const avgRating = feedbackStats.length > 0

      ? Number(feedbackStats[0].averageRating.toFixed(1))

      : 0;

    res.json({

      activeMatchesNow: 5,

      studentsRegistered: totalUsers,

      skillsExchanged: totalSkills,

      ratingAvg: avgRating,

      responseTimeAvg: '< 2 min',

      activeSessions,

      completedSessions

    });

  } catch (error) {

    console.error('[Stats API Error]:', error.message);

    res.status(500).json({

      error: 'Unable to retrieve platform statistics'

    });

  }

});

// 4. Slot CRUD and locking routes are handled by ./routes/slotRoutes.js

// 5. Session routes are handled by ./routes/sessionRoutes.js

// 404 handler

app.use((req, res) => {

  res.status(404).json({ error: 'API route not found' });

});

// Global error handler

app.use((err, req, res, next) => {

  console.error('Unhandled server error:', err);

  res.status(500).json({

    error: 'Internal Server Error',

    message: err.message

  });

});

app.listen(PORT, '0.0.0.0', () => {

  console.log('=======================================================');

  console.log(`🚀 SkillSwap Express Backend running on http://localhost:${PORT}`);

  console.log('   RV University - CS3301 Full Stack Development');

  console.log(`   Database Mode: ${dbState.connectionType}`);

  console.log('   Security: JWT Auth + Bcrypt Hashing Enabled');

  console.log('=======================================================');

});
