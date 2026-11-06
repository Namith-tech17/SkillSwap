import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  skill_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  skill_name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Programming',
      'Design',
      'Music & Arts',
      'Creative Arts',
      'Data Science',
      'Business',
      'Soft Skills'
    ],
    index: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export default Skill;
