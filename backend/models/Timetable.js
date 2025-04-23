import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  className: {
    type: String,
    required: true
  },
  room: {
    type: String
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly'],
    default: 'none'
  },
  withZoom: {
    type: Boolean,
    default: false  // 🟢 Teacher can decide if Zoom is needed
  },
  zoomLink: {
    type: String
  },
  zoomStartUrl: {
    type: String
  },
  zoomMeetingId: {
    type: String
  },
  googleEventId: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
