// models/PerformancePrediction.js
import mongoose from 'mongoose';

const performancePredictionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendancePercentage: Number,
  averageMarks: Number,
  prediction: String,
}, { timestamps: true });

export default mongoose.models.PerformancePrediction || mongoose.model('PerformancePrediction', performancePredictionSchema);