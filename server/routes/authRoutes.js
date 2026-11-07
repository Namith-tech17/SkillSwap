
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import {
  JWT_SECRET,
  TOKEN_EXPIRY,
  authenticateToken,
  runSecurityVerification
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Return user details without exposing the password hash.
const getSafeUser = (user) => ({
  user_id: user.user_id,
  name: user.name,
  email: user.email,
  usn: user.usn,
  department: user.department,
  semester: user.semester,
  bio: user.bio,
  avatar: user.avatar,
  rating_avg: user.rating_avg,
  total_reviews: user.total_reviews,
  skills_teach: user.skills_teach,
  skills_learn: user.skills_learn
});

// Generate JWT token.
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
      algorithm: 'HS256'
    }
  );
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      usn,
      department,
      semester
    } = req.body;

    // Validate required fields.
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof usn !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password ||
      !usn.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password and USN are required.'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must contain at least 2 characters.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUSN = usn.trim().toUpperCase();

    // Check whether the email or USN already exists in MongoDB.
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { usn: normalizedUSN }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email or USN already exists.'
      });
    }

    // Hash the password using bcrypt.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the MongoDB user document.
    const newUser = new User({
      user_id: `usr_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      usn: normalizedUSN,
      department:
        typeof department === 'string' && department.trim()
          ? department.trim()
          : 'Computer Science & Engineering',
      semester:
        typeof semester === 'string' && semester.trim()
          ? semester.trim()
          : '5th Sem',
      bio: '',
      skills_teach: [],
      skills_learn: []
    });

    // Save directly to MongoDB Atlas.
    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: getSafeUser(newUser)
    });

  } catch (error) {
    console.error('[Register Error]:', error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email, USN or user ID already exists.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {
    // Supports the frontend's emailOrUsn field.
    const {
      emailOrUsn,
      identifier,
      email,
      password
    } = req.body;

    const rawIdentifier = emailOrUsn || identifier || email || '';

    if (
      typeof rawIdentifier !== 'string' ||
      typeof password !== 'string' ||
      !rawIdentifier.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email/USN and password are required.'
      });
    }

    const loginIdentifier = rawIdentifier.trim();

    // Search MongoDB by email or USN.
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { usn: loginIdentifier.toUpperCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/USN or password.'
      });
    }

    // Verify the submitted password against the bcrypt hash.
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/USN or password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: getSafeUser(user)
    });

  } catch (error) {
    console.error('[Login Error]:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});


// GET CURRENT LOGGED-IN USER
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({
      user_id: userId
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: getSafeUser(user)
    });

  } catch (error) {
    console.error('[Current User Error]:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve user information.'
    });
  }
});


// SECURITY VERIFICATION
router.get('/verify', (req, res) => {
  try {
    const results = runSecurityVerification();

    return res.status(200).json(results);

  } catch (error) {
    console.error('[Security Verification Error]:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Security verification failed.'
    });
  }
});

export default router;
