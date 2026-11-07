
import express from 'express';
import { randomBytes } from 'crypto';
import Skill from '../models/Skill.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Fetch all skills
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const skills = await Skill.find(filter).sort({ createdAt: -1 });

    res.json(skills);
  } catch (error) {
    console.error('Fetch skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET: Fetch one skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({ skill_id: req.params.id });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error('Fetch skill error:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// POST: Create a skill
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { skill_name, category, description } = req.body;

    if (!skill_name?.trim() || !category) {
      return res.status(400).json({
        error: 'skill_name and category are required'
      });
    }

    const newSkill = new Skill({
      skill_id: `sk_${Date.now()}_${randomBytes(3).toString('hex')}`,
      skill_name: skill_name.trim(),
      category,
      description: description || ''
    });

    await newSkill.save();

    res.status(201).json({
      message: 'Skill created successfully',
      skill: newSkill
    });
  } catch (error) {
    console.error('Create skill error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// PUT: Update a skill
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['skill_name', 'category', 'description'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.skill_name !== undefined) {
      if (typeof updates.skill_name !== 'string' || !updates.skill_name.trim()) {
        return res.status(400).json({ error: 'Skill name cannot be empty' });
      }

      updates.skill_name = updates.skill_name.trim();
    }

    const updatedSkill = await Skill.findOneAndUpdate(
      { skill_id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({
      message: 'Skill updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    console.error('Update skill error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// DELETE: Delete a skill
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedSkill = await Skill.findOneAndDelete({
      skill_id: req.params.id
    });

    if (!deletedSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({
      message: 'Skill deleted successfully',
      skill: deletedSkill
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
