import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  slot_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  teacher_id: {
    type: String,
    required: true,
    index: true
  },
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'locked', 'booked'],
    default: 'available',
    index: true
  },
  locked_by: {
    type: String,
    default: null
  },
  locked_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const Slot = mongoose.models.Slot || mongoose.model('Slot', SlotSchema);
export default Slot;
