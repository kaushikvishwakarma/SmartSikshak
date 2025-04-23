import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import PerformancePrediction from '../models/PerformanceModel.js';
import { predictUsingGemini } from '../config/gemini.js';

export const predictStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendanceRecords = await Attendance.find({ student: studentId });
    const totalClasses = attendanceRecords.length;
    const attended = attendanceRecords.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses ? (attended / totalClasses) * 100 : 0;

    const assignments = await Assignment.find({ 'submissions.student': studentId });
    let studentSubmissions = [];

    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(
        sub => sub.student.toString() === studentId
      );
      if (submission) studentSubmissions.push(submission);
    });

    const averageAssignmentMarks = studentSubmissions.length
      ? studentSubmissions.reduce((acc, curr) => acc + (curr.marks || 0), 0) / studentSubmissions.length
      : 0;

    const prompt = `
      A student has ${attendancePercentage.toFixed(2)}% attendance and an average assignment score of ${averageAssignmentMarks.toFixed(2)}.
      Based on this data, predict the student's performance in final exams and suggest improvements.
    `;

    const aiPrediction = await predictUsingGemini(prompt);

    // ✅ Check if today's prediction already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let predictionDoc = await PerformancePrediction.findOne({
      student: studentId,
      createdAt: { $gte: today }
    });

    if (!predictionDoc) {
      predictionDoc = new PerformancePrediction({
        student: studentId,
        attendancePercentage: attendancePercentage.toFixed(2),
        averageMarks: averageAssignmentMarks.toFixed(2),
        prediction: aiPrediction
      });
      await predictionDoc.save();
    }

    return res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      attendance: {
        total: totalClasses,
        present: attended,
        percentage: attendancePercentage.toFixed(2),
      },
      assignments: {
        totalSubmissions: studentSubmissions.length,
        averageMarks: averageAssignmentMarks.toFixed(2),
      },
      aiPrediction,
      stored: true,
      recordId: predictionDoc._id,
    });
  } catch (err) {
    console.error('Performance Prediction Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};