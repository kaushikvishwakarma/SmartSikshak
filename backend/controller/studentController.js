// controllers/studentController.js
// controllers/studentController.js
import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/datauri.js';
import upload from '../middlewares/multer.js';
import User from '../models/User.js';
import AssignmentAi from "../models/AiAssignment.js";


// GET /api/student/dashboard
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const [assignments, subjects, attendanceRecords] = await Promise.all([
    Assignment.find({ 'submissions.student': studentId }),
    Subject.find({ enrolledStudents: studentId }),
    Attendance.find({ student: studentId })
  ]);

  const totalLectures = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;

  const attendanceSummary = {
    totalLectures,
    presentCount,
    percentage: totalLectures ? ((presentCount / totalLectures) * 100).toFixed(2) : 0,
  };

  const grades = assignments.map(a => {
    const sub = a.submissions.find(s => s.student.toString() === studentId.toString());
    return {
      title: a.title,
      marks: sub?.marks || 0,
      rank: sub?.rank || 0,
    };
  });

  res.json({ subjects: subjects.length, assignments: assignments.length, attendance: attendanceSummary, grades });
});


export const getAssignmentsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const classId = student.classId;

    const assignments = await Assignment.find({
      classId: classId,
    }).populate("subjectId teacherId");

    res.status(200).json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const submitAssignmentByStudent = async (req, res) => {
  const studentId = req.user._id;
  try {
    const { assignmentId } = req.body;
    const file = req.file;

    const assignment = await Assignment.findById(assignmentId);
    const student = await User.findById(studentId);

    if (!assignment || !student) {
      return res.status(404).json({ error: "Assignment or Student not found" });
    }

    // ✅ Check if already submitted
    const existingSubmission = await AssignmentAi.findOne({
      assignmentId,
      studentId,
    });

    if (existingSubmission) {
      return res.status(400).json({ error: "Assignment already submitted" });
    }

    // ✅ Cloudinary upload logic
    const fileUri = getDataUri(file);

    if (!fileUri || !fileUri.content) {
      return res.status(400).json({ error: "File processing failed" });
    }

    const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "raw",
      folder: "teacher-assistant/assignments",
      public_id: `${studentId}_${assignmentId}`,
      overwrite: true,
    });
    // const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
    //   resource_type: "auto", // ✅ detects it's a PDF and makes it viewable
    //   folder: "teacher-assistant/assignments",
    //   public_id: `${studentId}_${assignmentId}`,
    //   overwrite: true,
    // });


    // const fileUri = getDataUri(file);

    // const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
    //   resource_type: "raw", // because it's a PDF
    //   folder: "teacher-assistant/assignments",
    //   public_id: `${studentId}_${assignmentId}`,
    //   overwrite: true,
    // });

    const submission = new AssignmentAi({
      assignmentId,
      studentId,
      subject: assignment.subjectId,
      classId: assignment.classId,
      pdfUrl: uploadResult.secure_url,
      status: "submitted",
    });

    await submission.save();

    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: err.message });
  }
};



// GET /api/student/attendance
export const getAttendance = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const records = await Attendance.find({ student: studentId }).populate('subject', 'name code');

  const subjectWise = {};
  records.forEach(r => {
    const code = r.subject.code;
    if (!subjectWise[code]) subjectWise[code] = { subject: r.subject.name, total: 0, present: 0 };
    subjectWise[code].total++;
    if (r.status === 'present') subjectWise[code].present++;
  });

  const overall = {
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    percentage: records.length ? ((records.filter(r => r.status === 'present').length / records.length) * 100).toFixed(2) : 0,
  };

  res.json({ overall, subjectWise });
});

// GET /api/student/activities
export const getActivities = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const attendanceLogs = await Attendance.find({ student: studentId, 'logs.0': { $exists: true } })
    .select('date logs')
    .sort({ date: -1 });

  const activities = attendanceLogs.map(r => ({
    date: r.date,
    logs: r.logs,
  }));

  res.json({ activities });
});



// GET /api/student/performance
export const getPerformanceSummary = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const assignments = await Assignment.find({ 'submissions.student': studentId });

  const result = assignments.map(a => {
    const sub = a.submissions.find(s => s.student.toString() === studentId.toString());
    return {
      title: a.title,
      marks: sub?.marks || 0,
      suggestions: sub?.suggestions || '',
      rank: sub?.rank || 0,
    };
  });

  const totalMarks = result.reduce((sum, r) => sum + r.marks, 0);
  const average = result.length ? (totalMarks / result.length).toFixed(2) : 0;

  res.json({ average, details: result });
});

// GET /api/student/subjects
export const getSubjects = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const subjects = await Subject.find({ enrolledStudents: studentId }).select('name code semester academicSession');
  res.json(subjects);
});
export const getSubmissionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const submissions = await AssignmentAi.find({ studentId })
      .populate({
        path: "assignmentId",
        populate: [
          { path: "subjectId", select: "name code" },

        ],
      })
      .populate("subject", "name code");

    res.status(200).json({ success: true, submissions });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
