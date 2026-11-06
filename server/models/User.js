import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SkillTeachSchema = new mongoose.Schema({
  skill_id: { type: String, required: true },
  skill_name: { type: String, required: true },
  proficiency_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  description: { type: String, default: '' }
}, { _id: false });

const SkillLearnSchema = new mongoose.Schema({
  skill_id: { type: String, required: true },
  skill_name: { type: String, required: true },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  notes: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'College email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password_hash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  usn: {
    type: String,
    required: [true, 'University Seat Number (USN) is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    default: 'Computer Science & Engineering'
  },
  semester: {
    type: String,
    default: '5th Sem'
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  rating_avg: {
    type: Number,
    min: 0,
    max: 5,
    default: 5.0
  },
  total_reviews: {
    type: Number,
    default: 0
  },
  skills_teach: [SkillTeachSchema],
  skills_learn: [SkillLearnSchema]
}, {
  timestamps: true
});

// Helper method to compare password with bcrypt
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
