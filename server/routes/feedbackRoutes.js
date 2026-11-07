import express from 'express';
import { randomUUID } from 'crypto';

import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/feedback - Fetch all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(feedback);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST /api/feedback - Submit feedback
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      session_id,
      teacher_id,
      rating,
      comment,
      skill_name
    } = req.body;

    if (!session_id || !teacher_id || !rating || !comment || !skill_name) {
      return res.status(400).json({
        error: 'Session, teacher, rating, comment and skill are required'
      });
    }

    const numRating = Number(rating);

    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5 stars'
      });
    }

    if (typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({
        error: 'Comment must be at least 5 characters'
      });
    }

    const given_by_id =
      req.user?.user_id ||
      req.user?.userId ||
      req.body.given_by_id ||
      'usr_1';

    const user = await User.findOne({ user_id: given_by_id })
      .select('name')
      .lean();

    const given_by_name =
      user?.name ||
      req.body.given_by_name ||
      'SkillSwap User';

    const newFeedback = new Feedback({
      feedback_id: `fb_${randomUUID()}`,
      session_id,
      teacher_id,
      given_by_id,
      given_by_name,
      skill_name,
      rating: numRating,
      comment: comment.trim()
    });

    await newFeedback.save();

    // Recalculate teacher average rating
    const teacherReviews = await Feedback.find({ teacher_id });

    const avg =
      teacherReviews.reduce((sum, review) => sum + review.rating, 0) /
      teacherReviews.length;

    await User.updateOne(
      { user_id: teacher_id },
      {
        $set: {
          rating_avg: Number(avg.toFixed(2)),
          total_reviews: teacherReviews.length
        }
      }
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });

  } catch (error) {
    console.error('Submit feedback error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to submit feedback'
    });
  }
});

export default router;