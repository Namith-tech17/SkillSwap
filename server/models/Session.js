import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  teacher_id: {
    type: String,
    required: [true, 'Teacher ID is required'],
    index: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  learner_id: {
    type: String,
    required: [true, 'Learner ID is required'],
    index: true
  },
  learner_name: {
    type: String,
    required: true
  },
  skill_name: {
    type: String,
    required: [true, 'Skill name is required']
  },
  scheduled_time: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  slot_id: {
    type: String
  },
  meeting_mode: {
    type: String,
    default: 'In-Person (Campus Hub)'
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'locked', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed',
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true
});

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
export default Session;
