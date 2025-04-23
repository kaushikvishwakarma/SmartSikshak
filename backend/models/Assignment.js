import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [String],
  attachments: [String], // array of file URLs
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  dueDate: Date,
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
