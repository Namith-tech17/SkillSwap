import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, memoryDb, runDatabaseVerification, dbState } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { optionalAuth, authenticateToken } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
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

// Slot unlock expiration cleaner (checks every 5 seconds for expired locks > 60 seconds)
setInterval(() => {
  const now = Date.now();
  memoryDb.available_slots.forEach(slot => {
    if (slot.status === 'locked' && slot.locked_at) {
      const elapsed = (now - new Date(slot.locked_at).getTime()) / 1000;
      if (elapsed > 60) {
        slot.status = 'available';
        slot.locked_by = null;
        slot.locked_at = null;
        console.log(`[Auto-Unlock] Slot ${slot.slot_id} lock expired and was released.`);
      }
    }
  });
}, 5000);

// Helper default user
const DEFAULT_USER_ID = 'usr_1';

/* ==========================================================
   MOUNT AUTHENTICATION & SECURITY ROUTES (Task 4)
   ========================================================== */
app.use('/api/auth', authRoutes);

/* ==========================================================
   DATABASE VERIFICATION & TESTING ENDPOINT (Task 3)
   ========================================================== */
app.get('/api/database/verify', async (req, res) => {
  try {
    const report = await runDatabaseVerification();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Database verification failed', details: err.message });
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
    team: ['Hemanth B Y (1RUA24SCS0041)', 'C Namith Jain (1RUA24SCS0021)', 'N Gnana Prakash (1RUA24SCS0062)'],
    databaseMode: dbState.connectionType,
    security: 'JWT (HMAC-SHA256) + bcrypt (10 rounds)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req, res) => {
  const activeUsers = memoryDb.users.length;
  const totalSkills = memoryDb.skills.length;
  const activeSessions = memoryDb.sessions.filter(s => s.status === 'confirmed').length;
  const completedSessions = memoryDb.sessions.filter(s => s.status === 'completed').length;
  const avgRating = (
    memoryDb.feedback.reduce((sum, f) => sum + f.rating, 0) / (memoryDb.feedback.length || 1)
  ).toFixed(1);

  res.json({
    activeMatchesNow: 5,
    studentsRegistered: 212 + activeUsers,
    skillsExchanged: 64 + totalSkills,
    ratingAvg: avgRating || 4.8,
    responseTimeAvg: '< 2 min',
    activeSessions,
    completedSessions
  });
});

// 2. Skills Catalog
app.get('/api/skills', (req, res) => {
  res.json(memoryDb.skills);
});

app.post('/api/skills', optionalAuth, (req, res) => {
  const { skill_name, category, description } = req.body;
  if (!skill_name || !category) {
    return res.status(400).json({ error: 'skill_name and category are required' });
  }
  const newSkill = {
    skill_id: `sk_${Date.now()}`,
    skill_name,
    category,
    description: description || 'Peer-taught skill exchange module'
  };
  memoryDb.skills.push(newSkill);
  res.status(201).json(newSkill);
});

// 3. Users & Profiles
app.get('/api/users', (req, res) => {
  const safeUsers = memoryDb.users.map(u => {
    const safe = { ...u };
    delete safe.password_hash;
    return safe;
  });
  res.json(safeUsers);
});

app.get('/api/users/current', optionalAuth, (req, res) => {
  const userId = req.user?.user_id || DEFAULT_USER_ID;
  const user = memoryDb.users.find(u => u.user_id === userId) || memoryDb.users[0];
  const safe = { ...user };
  delete safe.password_hash;
  res.json(safe);
});

app.get('/api/users/:id', (req, res) => {
  const user = memoryDb.users.find(u => u.user_id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const safe = { ...user };
  delete safe.password_hash;
  res.json(safe);
});

// Update Profile & Skills
app.put('/api/users/:id', optionalAuth, (req, res) => {
  const user = memoryDb.users.find(u => u.user_id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, bio, department, semester, skills_teach, skills_learn } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (department) user.department = department;
  if (semester) user.semester = semester;
  if (Array.isArray(skills_teach)) user.skills_teach = skills_teach;
  if (Array.isArray(skills_learn)) user.skills_learn = skills_learn;

  const safe = { ...user };
  delete safe.password_hash;
  res.json({ message: 'Profile updated successfully', user: safe });
});

// 4. Intelligent Skill Matching Engine
app.get('/api/matches', optionalAuth, (req, res) => {
  const userId = req.query.userId || req.user?.user_id || DEFAULT_USER_ID;
  const currentUser = memoryDb.users.find(u => u.user_id === userId) || memoryDb.users[0];

  const myTeachSkills = (currentUser.skills_teach || []).map(s => s.skill_name.toLowerCase());
  const myLearnSkills = (currentUser.skills_learn || []).map(s => s.skill_name.toLowerCase());

  const matches = [];

  memoryDb.users.forEach(peer => {
    if (peer.user_id === currentUser.user_id) return;

    const peerTeachSkills = (peer.skills_teach || []).map(s => s.skill_name.toLowerCase());
    const peerLearnSkills = (peer.skills_learn || []).map(s => s.skill_name.toLowerCase());

    const peerCanTeachMe = peer.skills_teach.filter(s =>
      myLearnSkills.some(l => l.includes(s.skill_name.toLowerCase()) || s.skill_name.toLowerCase().includes(l))
    );

    const iCanTeachPeer = currentUser.skills_teach.filter(s =>
      peerLearnSkills.some(l => l.includes(s.skill_name.toLowerCase()) || s.skill_name.toLowerCase().includes(l))
    );

    let matchType = 'Complementary';
    let compatibility = 70;

    if (peerCanTeachMe.length > 0 && iCanTeachPeer.length > 0) {
      matchType = 'Mutual Match (Two-Way Swap)';
      compatibility = 98;
    } else if (peerCanTeachMe.length > 0) {
      matchType = 'Mentor Match (Can Teach You)';
      compatibility = 85;
    } else if (iCanTeachPeer.length > 0) {
      matchType = 'Mentee Match (Wants Your Skill)';
      compatibility = 80;
    } else {
      compatibility = 60;
    }

    const safePeer = { ...peer };
    delete safePeer.password_hash;

    matches.push({
      match_id: `match_${currentUser.user_id}_${peer.user_id}`,
      peer: safePeer,
      matchType,
      compatibility,
      canTeachMe: peerCanTeachMe,
      wantsFromMe: iCanTeachPeer,
      status: 'active'
    });
  });

  matches.sort((a, b) => b.compatibility - a.compatibility);
  res.json(matches);
});

// 5. Booking Slots & Slot Locking Mechanism
app.get('/api/slots', (req, res) => {
  const teacherId = req.query.teacher_id;
  let slots = memoryDb.available_slots;
  if (teacherId) {
    slots = slots.filter(s => s.teacher_id === teacherId);
  }
  res.json(slots);
});

// Lock a slot for 60 seconds (prevents concurrent double booking)
app.post('/api/slots/lock', optionalAuth, (req, res) => {
  const { slot_id } = req.body;
  const user_id = req.body.user_id || req.user?.user_id || DEFAULT_USER_ID;
  const slot = memoryDb.available_slots.find(s => s.slot_id === slot_id);

  if (!slot) {
    return res.status(404).json({ error: 'Slot not found' });
  }

  const now = Date.now();
  if (slot.status === 'booked') {
    return res.status(409).json({ error: 'Slot is already booked' });
  }

  if (slot.status === 'locked' && slot.locked_by !== user_id) {
    const elapsed = (now - new Date(slot.locked_at).getTime()) / 1000;
    if (elapsed < 60) {
      return res.status(423).json({
        error: 'Slot is currently locked by another peer',
        remainingSeconds: Math.ceil(60 - elapsed)
      });
    }
  }

  slot.status = 'locked';
  slot.locked_by = user_id;
  slot.locked_at = new Date().toISOString();

  res.json({
    message: 'Slot locked successfully for 60 seconds',
    slot,
    lockExpiresInSeconds: 60
  });
});

// Unlock a slot
app.post('/api/slots/unlock', optionalAuth, (req, res) => {
  const { slot_id } = req.body;
  const user_id = req.body.user_id || req.user?.user_id || DEFAULT_USER_ID;
  const slot = memoryDb.available_slots.find(s => s.slot_id === slot_id);
  if (slot && slot.locked_by === user_id && slot.status === 'locked') {
    slot.status = 'available';
    slot.locked_by = null;
    slot.locked_at = null;
  }
  res.json({ message: 'Slot unlocked', slot });
});

// 6. Sessions (Booking, Listing, Completion)
app.get('/api/sessions', (req, res) => {
  res.json(memoryDb.sessions);
});

app.post('/api/sessions/book', optionalAuth, (req, res) => {
  const {
    slot_id,
    teacher_id,
    skill_name,
    scheduled_time,
    meeting_mode,
    notes
  } = req.body;

  const learner_id = req.body.learner_id || req.user?.user_id || DEFAULT_USER_ID;

  if (!teacher_id || !learner_id || !skill_name) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  const teacher = memoryDb.users.find(u => u.user_id === teacher_id);
  const learner = memoryDb.users.find(u => u.user_id === learner_id);

  if (slot_id) {
    const slot = memoryDb.available_slots.find(s => s.slot_id === slot_id);
    if (slot) {
      slot.status = 'booked';
      slot.locked_by = null;
    }
  }

  const newSession = {
    session_id: `ses_${Date.now()}`,
    teacher_id,
    teacher_name: teacher ? teacher.name : 'Peer Mentor',
    learner_id,
    learner_name: learner ? learner.name : 'Student Learner',
    skill_name,
    scheduled_time: scheduled_time || 'Next Available Slot',
    meeting_mode: meeting_mode || 'In-Person (Campus Hub)',
    notes: notes || 'Peer skill session initiated.',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  memoryDb.sessions.unshift(newSession);

  // Auto-generate notification message in peer chat
  const newMsg = {
    message_id: `msg_${Date.now()}`,
    peer_id: teacher_id === learner_id ? teacher_id : (teacher_id === DEFAULT_USER_ID ? learner_id : teacher_id),
    sender_id: 'system',
    sender_name: 'SkillSwap Scheduler',
    text: `🎉 Skill swap session scheduled for "${skill_name}" at ${newSession.scheduled_time} (${newSession.meeting_mode}).`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  memoryDb.messages.push(newMsg);

  res.status(201).json({ message: 'Session booked successfully', session: newSession });
});

// Mark session completed
app.put('/api/sessions/:id/complete', optionalAuth, (req, res) => {
  const session = memoryDb.sessions.find(s => s.session_id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.status = 'completed';
  session.completed_at = new Date().toISOString();

  res.json({ message: 'Session marked as completed', session });
});

// 7. Messages (In-App Chat)
app.get('/api/messages/:peerId', (req, res) => {
  const peerId = req.params.peerId;
  const conversation = memoryDb.messages.filter(m => m.peer_id === peerId);
  res.json(conversation);
});

app.post('/api/messages', optionalAuth, (req, res) => {
  const { peer_id, text } = req.body;
  const sender_id = req.body.sender_id || req.user?.user_id || DEFAULT_USER_ID;
  const sender_name = req.body.sender_name || req.user?.name || 'Hemanth B Y';

  if (!peer_id || !text) {
    return res.status(400).json({ error: 'peer_id and text are required' });
  }

  const newMsg = {
    message_id: `msg_${Date.now()}`,
    peer_id,
    sender_id,
    sender_name,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  memoryDb.messages.push(newMsg);
  res.status(201).json(newMsg);
});

// 8. Feedback & Ratings
app.get('/api/feedback', (req, res) => {
  res.json(memoryDb.feedback);
});

app.post('/api/feedback', optionalAuth, (req, res) => {
  const { session_id, teacher_id, rating, comment, skill_name } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  const numRating = Number(rating);
  if (numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  const currentUser = memoryDb.users.find(u => u.user_id === (req.user?.user_id || DEFAULT_USER_ID)) || memoryDb.users[0];
  const newFeedback = {
    feedback_id: `fb_${Date.now()}`,
    session_id: session_id || 'manual',
    teacher_id: teacher_id || 'usr_2',
    given_by_id: currentUser.user_id,
    given_by_name: currentUser.name,
    skill_name: skill_name || 'Skill Exchange',
    rating: numRating,
    comment,
    created_at: new Date().toISOString()
  };

  memoryDb.feedback.unshift(newFeedback);

  // Recalculate teacher avg rating
  const targetUser = memoryDb.users.find(u => u.user_id === newFeedback.teacher_id);
  if (targetUser) {
    const teacherReviews = memoryDb.feedback.filter(f => f.teacher_id === targetUser.user_id);
    const avg = teacherReviews.reduce((sum, r) => sum + r.rating, 0) / teacherReviews.length;
    targetUser.rating_avg = parseFloat(avg.toFixed(2));
    targetUser.total_reviews = teacherReviews.length;
  }

  res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SkillSwap Express Backend running on http://localhost:${PORT}`);
  console.log(`   RV University - CS3301 Full Stack Development`);
  console.log(`   Database Mode: ${dbState.connectionType}`);
  console.log(`   Security: JWT Auth + Bcrypt Hashing Enabled`);
  console.log(`=======================================================`);
});
