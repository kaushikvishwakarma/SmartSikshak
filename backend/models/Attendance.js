// models/Attendance.js
import mongoose from 'mongoose';

const attendanceLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  comment: String,
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  academicSession: {
    type: String,
    required: true,
  },
  semester: String,

  date: {
    type: Date,
    required: true,
  },
  period: Number,

  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'leave'],
    default: 'present',
  },
  session: {
    type: String,
    enum: ['morning', 'afternoon', 'full-day'],
    default: 'full-day',
  },
  mode: {
    type: String,
    enum: ['manual', 'automated'],
    default: 'automated',
  },
  source: {
    type: String,
    enum: ['face-recognition', 'manual-entry', 'rfid', 'app-checkin'],
  },
  faceRecognitionConfidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  reason: String,
  location: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    _id: false,
  },
  remarks: String,
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  logs: [attendanceLogSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

