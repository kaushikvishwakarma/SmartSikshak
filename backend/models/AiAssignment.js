import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  assignmentId:{type:mongoose.Schema.Types.ObjectId,ref:"Assignment"},
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional, if you're linking to students
    required: true,
  },
  subject: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "submitted",
    enum: ["submitted", "evaluated", "pending"],
  },
  evaluation: {
    questions: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],
    summary: {
      overallScore: Number,
      remark: {
        type: String,
        // enum: ["Excellent", "Good", "Average", "Needs Improvement", "Poor"]
      },
      strengths: [String],
      improvements: [String],
    },
  },
}, {
  timestamps: true // adds createdAt and updatedAt
});

export default mongoose.model('AssignmentAi', assignmentSchema);
