import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  feedback_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  session_id: {
    type: String,
    required: true,
    index: true
  },
  teacher_id: {
    type: String,
    required: true,
    index: true
  },
  given_by_id: {
    type: String,
    required: true
  },
  given_by_name: {
    type: String,
    required: true
  },
  skill_name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [5, 'Comment must be at least 5 characters']
  }
}, {
  timestamps: true
});

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
