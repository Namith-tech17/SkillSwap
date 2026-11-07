
import express from 'express';
import mongoose from 'mongoose';

import Session from '../models/Session.js';
import Slot from '../models/Slot.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const getUserId = (req) => req.user?.user_id || req.user?.userId;

// GET /api/sessions - Fetch sessions
router.get('/', optionalAuth, async (req, res) => {
  try {
    const sessions = await Session.find()
      .sort({ created_at: -1 })
      .lean();

    res.json(sessions);
  } catch (error) {
    console.error('Fetch sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST /api/sessions/book - Book a session
router.post('/book', authenticateToken, async (req, res) => {
  const {
    slot_id,
    teacher_id,
    skill_name,
    scheduled_time,
    meeting_mode,
    notes
  } = req.body;

  const learner_id = getUserId(req);

  if (!learner_id || !teacher_id || !skill_name || !slot_id) {
    return res.status(400).json({
      error: 'Learner ID, teacher ID, skill name and slot ID are required'
    });
  }

  if (teacher_id === learner_id) {
    return res.status(400).json({
      error: 'You cannot book your own teaching slot'
    });
  }

  const dbSession = await mongoose.startSession();

  try {
    let bookedSession;

    await dbSession.withTransaction(async () => {
      // Verify that the slot is locked by the logged-in learner.
      const slot = await Slot.findOne({
        slot_id,
        teacher_id,
        status: 'locked',
        locked_by: learner_id
      }).session(dbSession);

      if (!slot) {
        throw new Error('SLOT_NOT_LOCKED_BY_LEARNER');
      }

      // Fetch teacher and learner from MongoDB.
      const teacher = await User.findOne({
        user_id: teacher_id
      }).session(dbSession);

      const learner = await User.findOne({
        user_id: learner_id
      }).session(dbSession);

      if (!teacher || !learner) {
        throw new Error('USER_NOT_FOUND');
      }

      // Change the slot from locked to booked.
      const updatedSlot = await Slot.findOneAndUpdate(
        {
          slot_id,
          teacher_id,
          status: 'locked',
          locked_by: learner_id
        },
        {
          $set: {
            status: 'booked',
            locked_by: null,
            locked_at: null
          }
        },
        {
          new: true,
          session: dbSession
        }
      );

      if (!updatedSlot) {
        throw new Error('SLOT_BOOKING_CONFLICT');
      }

      // Create the session in MongoDB.
      const newSession = new Session({
        session_id: `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        teacher_id,
        teacher_name: teacher.name,
        learner_id,
        learner_name: learner.name,
        skill_name,
        scheduled_time: scheduled_time || `${slot.day} - ${slot.time}`,
        slot_id,
        meeting_mode: meeting_mode || 'In-Person (Campus Hub)',
        notes: notes || 'Peer skill session initiated.',
        status: 'confirmed'
      });

      await newSession.save({ session: dbSession });

      bookedSession = newSession;
    });

    res.status(201).json({
      message: 'Session booked successfully',
      session: bookedSession
    });

  } catch (error) {
    console.error('Session booking error:', error);

    if (error.message === 'SLOT_NOT_LOCKED_BY_LEARNER') {
      return res.status(409).json({
        error: 'This slot is not locked by you or is no longer available'
      });
    }

    if (error.message === 'SLOT_BOOKING_CONFLICT') {
      return res.status(409).json({
        error: 'This slot has already been booked or changed'
      });
    }

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: 'Teacher or learner account not found'
      });
    }

    res.status(500).json({
      error: 'Failed to book session'
    });
  } finally {
    await dbSession.endSession();
  }
});

// PUT /api/sessions/:id/complete - Complete a session
router.put('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);

    const session = await Session.findOneAndUpdate(
      {
        session_id: req.params.id,
        status: 'confirmed',
        $or: [
          { teacher_id: userId },
          { learner_id: userId }
        ]
      },
      {
        $set: {
          status: 'completed',
          completed_at: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!session) {
      const existingSession = await Session.findOne({
        session_id: req.params.id
      });

      if (!existingSession) {
        return res.status(404).json({
          error: 'Session not found'
        });
      }

      if (
        existingSession.teacher_id !== userId &&
        existingSession.learner_id !== userId
      ) {
        return res.status(403).json({
          error: 'You are not authorized to complete this session'
        });
      }

      return res.status(409).json({
        error: 'Session is not currently confirmed'
      });
    }

    res.json({
      message: 'Session marked as completed',
      session
    });

  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({
      error: 'Failed to complete session'
    });
  }
});

export default router;
