
import express from 'express';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_USER_ID = 'usr_1';

// Remove password hash before returning user information.
const getSafeUser = (user) => {
  if (!user) return null;

  const safe = user.toObject ? user.toObject() : { ...user };
  delete safe.password_hash;

  return safe;
};

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password_hash')
      .lean();

    res.json(users);
  } catch (error) {
    console.error('[Get Users Error]:', error.message);
    res.status(500).json({ error: 'Unable to retrieve users' });
  }
});

// GET CURRENT USER
router.get('/current', optionalAuth, async (req, res) => {
  try {
    const userId =
      req.user?.user_id ||
      req.user?.userId ||
      DEFAULT_USER_ID;

    let user = await User.findOne({ user_id: userId });

    // Preserve the previous fallback behavior.
    if (!user) {
      user = await User.findOne().sort({ createdAt: 1 });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(getSafeUser(user));
  } catch (error) {
    console.error('[Get Current User Error]:', error.message);
    res.status(500).json({ error: 'Unable to retrieve current user' });
  }
});

// GET USER BY ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      user_id: req.params.id
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(getSafeUser(user));
  } catch (error) {
    console.error('[Get User Error]:', error.message);
    res.status(500).json({ error: 'Unable to retrieve user' });
  }
});

// UPDATE PROFILE & SKILLS
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      user_id: req.params.id
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      name,
      bio,
      department,
      semester,
      skills_teach,
      skills_learn
    } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (semester) user.semester = semester;

    if (Array.isArray(skills_teach)) {
      user.skills_teach = skills_teach;
    }

    if (Array.isArray(skills_learn)) {
      user.skills_learn = skills_learn;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: getSafeUser(user)
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Unable to update profile' });
  }
});

export default router;
