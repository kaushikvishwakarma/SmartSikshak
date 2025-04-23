import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { type: String, required: true }, // e.g., "BTech", "10th", etc.
  section: { type: String }, // e.g., "A", "B"
  academicYear: { type: String }, // e.g., "2024-25"
  
  // Array of subjects offered in this class
  subjects: [
    {
      subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
      subjectName: { type: String, required: true },
      code: { type: String }, // Optional subject code (like CS101)
    }
  ],

  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional reference
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model("Class", classSchema);
