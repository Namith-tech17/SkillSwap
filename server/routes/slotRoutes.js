
import express from 'express';
import { randomBytes } from 'crypto';
import Slot from '../models/Slot.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const LOCK_DURATION = 60 * 1000;

// Get authenticated user's ID from JWT.
const getUserId = (req) => req.user?.userId || req.user?.user_id;

// GET: Fetch all slots
// Optional filters: ?day=Monday&status=available&teacher_id=...
router.get('/', async (req, res) => {
  try {
    // Automatically release expired locks.
    const expiryTime = new Date(Date.now() - LOCK_DURATION);

    await Slot.updateMany(
      {
        status: 'locked',
        locked_at: { $lte: expiryTime }
      },
      {
        $set: {
          status: 'available',
          locked_by: null,
          locked_at: null
        }
      }
    );

    const filter = {};

    if (req.query.day) filter.day = req.query.day;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.teacher_id) filter.teacher_id = req.query.teacher_id;

    const slots = await Slot.find(filter).sort({ createdAt: -1 });

    res.status(200).json(slots);
  } catch (error) {
    console.error('Fetch slots error:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// POST: Lock a slot for 60 seconds
router.post('/lock', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { slot_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    if (!slot_id) {
      return res.status(400).json({ error: 'slot_id is required' });
    }

    const now = new Date();
    const expiryTime = new Date(Date.now() - LOCK_DURATION);

    // Atomic update prevents simultaneous locking by different users.
    const slot = await Slot.findOneAndUpdate(
      {
        slot_id,
        $or: [
          { status: 'available' },
          {
            status: 'locked',
            locked_at: { $lte: expiryTime }
          },
          {
            status: 'locked',
            locked_by: userId
          }
        ]
      },
      {
        $set: {
          status: 'locked',
          locked_by: userId,
          locked_at: now
        }
      },
      { new: true }
    );

    if (!slot) {
      const existingSlot = await Slot.findOne({ slot_id });

      if (!existingSlot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      if (existingSlot.status === 'booked') {
        return res.status(409).json({ error: 'Slot is already booked' });
      }

      return res.status(423).json({
        error: 'Slot is currently locked by another peer',
        remainingSeconds: existingSlot.locked_at
          ? Math.max(
              0,
              Math.ceil(
                (LOCK_DURATION -
                  (Date.now() - new Date(existingSlot.locked_at).getTime())) / 1000
              )
            )
          : 0
      });
    }

    res.status(200).json({
      message: 'Slot locked successfully for 60 seconds',
      slot,
      lockExpiresInSeconds: 60
    });
  } catch (error) {
    console.error('Lock slot error:', error);
    res.status(500).json({ error: 'Failed to lock slot' });
  }
});

// POST: Unlock a slot
router.post('/unlock', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { slot_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    if (!slot_id) {
      return res.status(400).json({ error: 'slot_id is required' });
    }

    const slot = await Slot.findOneAndUpdate(
      {
        slot_id,
        status: 'locked',
        locked_by: userId
      },
      {
        $set: {
          status: 'available',
          locked_by: null,
          locked_at: null
        }
      },
      { new: true }
    );

    if (!slot) {
      const existingSlot = await Slot.findOne({ slot_id });

      if (!existingSlot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      return res.status(409).json({
        error: 'Slot is not locked by you'
      });
    }

    res.status(200).json({
      message: 'Slot unlocked successfully',
      slot
    });
  } catch (error) {
    console.error('Unlock slot error:', error);
    res.status(500).json({ error: 'Failed to unlock slot' });
  }
});

// GET: Fetch one slot
router.get('/:id', async (req, res) => {
  try {
    const slot = await Slot.findOne({ slot_id: req.params.id });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    res.status(200).json(slot);
  } catch (error) {
    console.error('Fetch slot error:', error);
    res.status(500).json({ error: 'Failed to fetch slot' });
  }
});

// POST: Create an availability slot
router.post('/', authenticateToken, async (req, res) => {
  try {
    const teacherId = getUserId(req);
    const { day, time } = req.body;

    if (!teacherId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    if (
      typeof day !== 'string' || !day.trim() ||
      typeof time !== 'string' || !time.trim()
    ) {
      return res.status(400).json({
        error: 'Valid day and time are required'
      });
    }

    const existingSlot = await Slot.findOne({
      teacher_id: teacherId,
      day: day.trim(),
      time: time.trim()
    });

    if (existingSlot) {
      return res.status(409).json({
        error: 'You already have a slot for this day and time'
      });
    }

    const newSlot = new Slot({
      slot_id: `slot_${Date.now()}_${randomBytes(3).toString('hex')}`,
      teacher_id: teacherId,
      day: day.trim(),
      time: time.trim(),
      status: 'available'
    });

    await newSlot.save();

    res.status(201).json({
      message: 'Availability slot created successfully',
      slot: newSlot
    });
  } catch (error) {
    console.error('Create slot error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'A slot with this ID already exists'
      });
    }

    res.status(500).json({ error: 'Failed to create slot' });
  }
});

// PUT: Update an availability slot
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const teacherId = getUserId(req);
    const { day, time } = req.body;

    if (!teacherId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    const slot = await Slot.findOne({ slot_id: req.params.id });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.teacher_id !== teacherId) {
      return res.status(403).json({
        error: 'You can only update your own slots'
      });
    }

    if (slot.status !== 'available') {
      return res.status(409).json({
        error: 'Only available slots can be updated'
      });
    }

    const updates = {};

    if (day !== undefined) {
      if (typeof day !== 'string' || !day.trim()) {
        return res.status(400).json({ error: 'Day cannot be empty' });
      }
      updates.day = day.trim();
    }

    if (time !== undefined) {
      if (typeof time !== 'string' || !time.trim()) {
        return res.status(400).json({ error: 'Time cannot be empty' });
      }
      updates.time = time.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Provide day or time to update'
      });
    }

    const duplicate = await Slot.findOne({
      teacher_id: teacherId,
      day: updates.day ?? slot.day,
      time: updates.time ?? slot.time,
      slot_id: { $ne: slot.slot_id }
    });

    if (duplicate) {
      return res.status(409).json({
        error: 'Another slot already exists for this day and time'
      });
    }

    Object.assign(slot, updates);
    await slot.save();

    res.status(200).json({
      message: 'Availability slot updated successfully',
      slot
    });
  } catch (error) {
    console.error('Update slot error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to update slot' });
  }
});

// DELETE: Delete an availability slot
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const teacherId = getUserId(req);

    if (!teacherId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    const slot = await Slot.findOne({ slot_id: req.params.id });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.teacher_id !== teacherId) {
      return res.status(403).json({
        error: 'You can only delete your own slots'
      });
    }

    if (slot.status !== 'available') {
      return res.status(409).json({
        error: 'Locked or booked slots cannot be deleted'
      });
    }

    await Slot.deleteOne({ _id: slot._id });

    res.status(200).json({
      message: 'Availability slot deleted successfully',
      slot
    });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

export default router;
