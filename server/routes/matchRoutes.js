
import express from 'express';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_USER_ID = 'usr_1';

// GET SKILL MATCHES
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId =
      req.query.userId ||
      req.user?.user_id ||
      req.user?.userId ||
      DEFAULT_USER_ID;

    // Retrieve all users from MongoDB.
    const users = await User.find()
      .select('-password_hash')
      .lean();

    // Find the current user.
    const currentUser =
      users.find(u => u.user_id === userId) ||
      users[0];

    if (!currentUser) {
      return res.status(404).json({
        error: 'No users found for matching'
      });
    }

    const myLearnSkills = (currentUser.skills_learn || [])
      .map(s => s.skill_name.toLowerCase());

    const matches = [];

    // Compare the current user's skills with other users.
    users.forEach(peer => {
      if (peer.user_id === currentUser.user_id) return;

      const peerLearnSkills = (peer.skills_learn || [])
        .map(s => s.skill_name.toLowerCase());

      const peerCanTeachMe = (peer.skills_teach || []).filter(s =>
        myLearnSkills.some(
          l =>
            l.includes(s.skill_name.toLowerCase()) ||
            s.skill_name.toLowerCase().includes(l)
        )
      );

      const iCanTeachPeer = (currentUser.skills_teach || []).filter(s =>
        peerLearnSkills.some(
          l =>
            l.includes(s.skill_name.toLowerCase()) ||
            s.skill_name.toLowerCase().includes(l)
        )
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

      matches.push({
        match_id: `match_${currentUser.user_id}_${peer.user_id}`,
        peer,
        matchType,
        compatibility,
        canTeachMe: peerCanTeachMe,
        wantsFromMe: iCanTeachPeer,
        status: 'active'
      });
    });

    // Sort matches by highest compatibility.
    matches.sort((a, b) => b.compatibility - a.compatibility);

    res.json(matches);

  } catch (error) {
    console.error('[Matching Engine Error]:', error.message);

    res.status(500).json({
      error: 'Unable to retrieve skill matches'
    });
  }
});

export default router;
