import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  peer_id: {
    type: String,
    required: true,
    index: true
  },
  sender_id: {
    type: String,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true
  },
  timestamp: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;
