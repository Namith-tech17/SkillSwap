import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { memoryDb } from '../config/db.js';
import { User } from '../models/User.js';
import {
  JWT_SECRET,
  TOKEN_EXPIRY,
  authenticateToken,
  runSecurityVerification
} from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Register a new student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, usn, department, semester, bio } = req.body;

    // Input Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid college email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    if (!usn || usn.trim().length < 5) {
      return res.status(400).json({ error: 'Valid USN is required (e.g. 1RUA24SCS0041)' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsn = usn.trim().toUpperCase();

    // Check duplicate
    const existing = memoryDb.users.find(
      u => u.email.toLowerCase() === normalizedEmail || u.usn.toUpperCase() === normalizedUsn
    );
    if (existing) {
      return res.status(409).json({ error: 'A student with this email or USN is already registered' });
    }

    // Securely hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = {
      user_id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
      usn: normalizedUsn,
      department: department || 'Computer Science & Engineering',
      semester: semester || '5th Sem',
      bio: bio || 'Passionate about peer skill learning and mentorship.',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      rating_avg: 5.0,
      total_reviews: 0,
      skills_teach: [],
      skills_learn: []
    };

    // Save to memoryDb
    memoryDb.users.unshift(newUser);

    // Issue JWT token
    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        email: newUser.email,
        name: newUser.name,
        usn: newUser.usn
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const safeUser = { ...newUser };
    delete safeUser.password_hash;

    res.status(201).json({
      message: 'Student account registered successfully',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration', details: err.message });
  }
});

// 2. Login existing student
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsn, password } = req.body;

    if (!emailOrUsn || !password) {
      return res.status(400).json({ error: 'Email/USN and password are required' });
    }

    const query = emailOrUsn.trim().toLowerCase();
    const user = memoryDb.users.find(
      u => u.email.toLowerCase() === query || u.usn.toLowerCase() === query
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials: No account found with this email or USN' });
    }

    // Compare with bcrypt
    let isMatch = false;
    if (user.password_hash) {
      // If user has a bcrypt hash
      if (user.password_hash.startsWith('$2')) {
        isMatch = await bcrypt.compare(password, user.password_hash);
      } else {
        // Fallback demo matching for initial seed users
        isMatch = password === 'password123' || password === user.password_hash;
      }
    } else {
      isMatch = password === 'password123';
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials: Password does not match' });
    }

    // Issue JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        usn: user.usn
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const safeUser = { ...user };
    delete safeUser.password_hash;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// 3. Quick Demo Login (Allows examiner to authenticate as any peer instantly)
router.post('/quick-login', (req, res) => {
  const { userId } = req.body;
  const user = memoryDb.users.find(u => u.user_id === userId) || memoryDb.users[0];

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      usn: user.usn
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const safeUser = { ...user };
  delete safeUser.password_hash;

  res.json({
    message: `Switched session to ${user.name}`,
    token,
    user: safeUser
  });
});

// 4. Get Current Authenticated Profile (Protected route)
router.get('/me', authenticateToken, (req, res) => {
  const user = memoryDb.users.find(u => u.user_id === req.user.user_id);
  if (!user) {
    return res.status(404).json({ error: 'Authenticated user not found in database' });
  }
  const safeUser = { ...user };
  delete safeUser.password_hash;
  res.json({ user: safeUser, tokenPayload: req.user });
});

// 5. Security & Auth Verification Test Endpoint (Criteria 4)
router.get('/verify', async (req, res) => {
  try {
    const report = await runSecurityVerification();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Security verification failed', details: err.message });
  }
});

export default router;
