// models/Subject.js
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
  },
  description: {
    type: String,
  },
  credits: {
    type: Number,
    default: 0,
  },
  semester: {
    type: String,
    enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
  },
  academicSession: {
    type: String,
    required: true, // e.g., "2024-2025"
  },
  classGroup: {
    type: String,
    required: true, // e.g., "B.Tech AIDS III-A"
  },
  assignedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  attendanceTrackingEnabled: {
    type: Boolean,
    default: true,
  },
  assignmentEnabled: {
    type: Boolean,
    default: true,
  },
  evaluationWeightage: {
    internal: { type: Number, default: 30 }, // percent
    external: { type: Number, default: 70 },
  },
  weeklySchedule: [{
    day: { type: String }, // e.g., "Monday"
    startTime: { type: String }, // "10:00 AM"
    endTime: { type: String },   // "11:00 AM"
  }],
}, {
  timestamps: true,
});
export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

