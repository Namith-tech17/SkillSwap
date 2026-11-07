import express from 'express';
import { randomUUID } from 'crypto';

import Message from '../models/Message.js';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_USER_ID = 'usr_1';

// GET /api/messages/:peerId - Fetch conversation messages
router.get('/:peerId', optionalAuth, async (req, res) => {
  try {
    const conversation = await Message.find({
      peer_id: req.params.peerId
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json(conversation);
  } catch (error) {
    console.error('Fetch messages error:', error);

    res.status(500).json({
      error: 'Failed to fetch messages'
    });
  }
});

// POST /api/messages - Send a message
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { peer_id, text } = req.body;

    if (
      !peer_id ||
      typeof text !== 'string' ||
      !text.trim()
    ) {
      return res.status(400).json({
        error: 'peer_id and text are required'
      });
    }

    const sender_id =
      req.body.sender_id ||
      req.user?.user_id ||
      req.user?.userId ||
      DEFAULT_USER_ID;

    // Get the sender's actual name from MongoDB.
    const sender = await User.findOne({
      user_id: sender_id
    }).select('name').lean();

    const sender_name =
      req.body.sender_name ||
      sender?.name ||
      req.user?.name ||
      'SkillSwap User';

    const newMessage = new Message({
      message_id: `msg_${randomUUID()}`,
      peer_id,
      sender_id,
      sender_name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);

    res.status(500).json({
      error: 'Failed to send message'
    });
  }
});

export default router;