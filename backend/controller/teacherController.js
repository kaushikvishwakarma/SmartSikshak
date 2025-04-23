import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
import AssignmentAi from '../models/AiAssignment.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import cloudinary from 'cloudinary';
import getDataUri from '../config/datauri.js';
import { GeminiClient } from '../config/geminiClient.js'; // Your custom Gemini API wrapper
import bcrypt from 'bcrypt';


// GET /api/teacher/dashboard
export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const subjects = await Subject.find({ assignedTeachers: teacherId });
  const assignments = await Assignment.find({ givenBy: teacherId });
  const totalAttendanceMarked = await Attendance.countDocuments({ markedBy: teacherId });

  res.json({
    totalSubjects: subjects.length,
    totalAssignments: assignments.length,
    totalAttendanceMarked,
  });
});

export const getTeacherAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ teacherId: req.user._id })
    .populate('subjectId classId');
  res.json(assignments);
});

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      subjectId,
      classId,
    
      startDate,
      dueDate,
    } = req.body;
    const teacherId=req.user?._id;

    const attachments = req.files?.map(file => file.path) || [];

    const newAssignment = new Assignment({
      title,
      description,
      questions,
      subjectId,
      classId,
      teacherId,
      startDate,
      dueDate,
      attachments,
    });

    await newAssignment.save();
    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get assignments by a specific teacher
export const getAssignmentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const assignments = await Assignment.find({ teacherId })
      .populate('subjectId classId');

    res.status(200).json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentAi.find({ assignmentId })
      .populate('studentId', 'name email');
    res.status(200).json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update an assignment
export const updateAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, questions } = req.body;

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  if (assignment.teacherId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  // Update fields
  assignment.title = title || assignment.title;
  assignment.description = description || assignment.description;
  assignment.dueDate = dueDate || assignment.dueDate;
  assignment.questions = typeof questions === 'string' ? questions : JSON.stringify(questions);

  // Handle new file uploads
  if (req.files?.length) {
    const newAttachments = await Promise.all(
      req.files.map(async (file) => {
        const fileUri = getDataUri(file);
        if (!fileUri) throw new Error("Failed to process uploaded file");

        const result = await cloudinary.v2.uploader.upload(fileUri, {
          folder: 'teacher-assistant/assignments',
        });

        return result.secure_url;
      })
    );
    assignment.attachments.push(...newAttachments);
  }

  await assignment.save();
  res.json({ message: 'Assignment updated', assignment });
});

// Get submissions for an assignment (redundant version, now using AssignmentAi only)
export const getAssignmentSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await AssignmentAi.find({ assignmentId: assignmentId }).populate('studentId', 'name email');
  if (!submissions) return res.status(404).json({ message: 'No submissions found' });
  res.json(submissions);
});
// POST /api/teacher/attendance/:subjectId
export const markAttendance = asyncHandler(async (req, res) => {
  const { entries, mode, session, date, period } = req.body; // entries = [{ studentId, status }]
  const subjectId = req.params.subjectId;
  const subject = await Subject.findById(subjectId);

  if (!subject) return res.status(404).json({ message: 'Subject not found' });

  const attendanceRecords = await Promise.all(entries.map(async (entry) => {
    return await Attendance.create({
      student: entry.studentId,
      subject: subjectId,
      academicSession: subject.academicSession,
      semester: subject.semester,
      date,
      period,
      status: entry.status,
      session,
      mode,
      markedBy: req.user._id,
    });
  }));

  res.status(201).json({ message: 'Attendance marked', records: attendanceRecords });
});

// GET /api/teacher/students
export const getAssignedStudents = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ assignedTeachers: req.user._id }).populate('enrolledStudents', 'name email');
  const studentsSet = new Set();

  subjects.forEach(subject => {
    subject.enrolledStudents.forEach(student => studentsSet.add(JSON.stringify(student)));
  });

  const students = Array.from(studentsSet).map(s => JSON.parse(s));
  res.json(students);
});

// POST /api/teacher/evaluate/:submissionId
// POST /api/teacher/evaluate/:submissionId
// POST /api/teacher/evaluate/:submissionId
export const evaluateSubmissionManually = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { totalMarks } = req.body;

  const assignment = await Assignment.findOne({ 'submissions._id': submissionId });
  if (!assignment) return res.status(404).json({ message: 'Submission not found' });

  const submission = assignment.submissions.id(submissionId);

  if (!submission || !submission.file) {
    return res.status(400).json({ message: 'No file found for this submission.' });
  }

  const result = await GeminiClient.evaluateAnswer({
    fileUrl: submission.file,  // cloudinary URL
    totalMarks: totalMarks || 10
  });

  if (!result || result.success === false) {
    return res.status(500).json({
      message: 'Evaluation failed',
      error: result.error || 'Unknown error from AI service'
    });
  }

  submission.marks = result.score;
  submission.suggestions = result.feedback;
  await assignment.save();

  res.json({
    message: 'Evaluation complete',
    score: result.score,
    feedback: result.feedback
  });
});


export const getStudentsByClassAndSubject = async (req, res) => {
  try {
    const { teacherId, classId, subjectId } = req.params;
    const { date } = req.query;

    // Parse date or default to today's date (start of the day for consistency)
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0); // normalize to start of the day

    // 1. Verify Teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.usertype !== 'teacher') {
      return res.status(404).json({ error: 'Teacher not found or unauthorized' });
    }

    // 2. Check if teacher is assigned to this class and subject
    const isAssigned = teacher.teachingAssignments?.some(
      (ta) =>
        ta.classId?.toString() === classId &&
        ta.subjectId?.toString() === subjectId
    );
    if (!isAssigned) {
      return res.status(403).json({ error: 'Unauthorized: not assigned to this class and subject' });
    }

    // 3. Get all students in the class
    const students = await User.find({ usertype: 'student', classId: classId });

    // 4. Find existing attendance for this class/subject/date
    const existingAttendance = await Attendance.findOne({
      markedBy: teacherId,
      class: classId,
      subject: subjectId,
      date: attendanceDate
    });

    // 5. Build attendance map
    const attendanceMap = {};
    if (existingAttendance) {
      for (const record of existingAttendance.attendance) {
        attendanceMap[record.student.toString()] = {
          status: record.status,
          note: record.remarks,
        };
      }
    }

    // 6. Build student list with historical % and today's attendance (if any)
    const studentList = students.map((student) => ({
      _id: student._id,
      name: student.name,
      attendancePercentage: student.attendance?.[subjectId]?.percentage || 0,
      status: attendanceMap[student._id.toString()]?.status || '',
      note: attendanceMap[student._id.toString()]?.note || '',
    }));

    // 7. Respond with student attendance info
    return res.json({
      students: studentList,
      attendanceId: existingAttendance?._id || null,
      date: attendanceDate,
    });

  } catch (error) {
    console.error('Error in getStudentsByClassAndSubject:', error);
    res.status(500).json({ error: 'Server error fetching student attendance data' });
  }
};


// export const getStudentsByClassAndSubject = async (req, res) => {
//   try {
//     const { teacherId, classId, subjectId } = req.params;
    

   

//     // 1. Verify Teacher
//     const teacher = await User.findById(teacherId);
//     if (!teacher || teacher.usertype !== 'teacher') {
//       return res.status(404).json({ error: 'Teacher not found or unauthorized' });
//     }

//     // 2. Check if teacher is assigned to this class and subject
//     const isAssigned = teacher.teachingAssignments?.some(
//       (ta) =>
//         ta.classId?.toString() === classId &&
//         ta.subjectId?.toString() === subjectId
//     );
//     if (!isAssigned) {
//       return res.status(403).json({ error: 'Unauthorized: not assigned to this class and subject' });
//     }

//     // 3. Get all students from that class
//     const students = await User.find({ usertype: 'student', class: classId });

//     // 4. Check if attendance already marked
//     const existingAttendance = await Attendance.findOne({
//       markedBy: teacherId,
//       class: classId,
//       subject: subjectId,
      
//     });

//     // 5. Build attendance map if exists
//     const attendanceMap = {};
//     if (existingAttendance) {
//       for (const record of existingAttendance.attendance) {
//         attendanceMap[record.student.toString()] = {
//           status: record.status,
//           note: record.remarks,
//         };
//       }
//     }

//     // 6. Build student list with previous % and today’s attendance (if any)
//     const studentList = students.map((student) => ({
//       _id: student._id,
//       name: student.name,
//       attendancePercentage: student.attendance?.[subjectId]?.percentage || 0,
//       status: attendanceMap[student._id.toString()]?.status || '',
//       note: attendanceMap[student._id.toString()]?.note || '',
//     }));

//     // 7. Respond with student data and existing attendance ID
//     return res.json({
//       students: studentList,
//       attendanceId: existingAttendance?._id || null,
//     });

//   } catch (error) {
//     console.error('Error in getStudentsByClassAndSubject:', error);
//     res.status(500).json({ error: 'Server error fetching student attendance data' });
//   }
// };

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, address, usertype = 'teacher', ...rest } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashed,
      mobileNumber,
      address,
      usertype,
      ...rest
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Assign a subject-class combo to a teacher
export const assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, subjectName, classId, className, schedule } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.usertype !== 'teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    teacher.teachingAssignments.push({ subjectId, subjectName, classId, className, schedule });
    await teacher.save();

    res.status(200).json({ message: 'Assignment added', assignments: teacher.teachingAssignments });
  } catch (err) {
    res.status(500).json({ error: 'Assignment failed' });
  }
};
export const getClassesForTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  // Assuming you store class-subject mapping in User model under 'teachingAssignments'
  const teacher = await User.findById(teacherId).populate('teachingAssignments.classId');

  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

  // Extract unique class objects from teachingAssignments
  const classMap = new Map();
  teacher.teachingAssignments.forEach(({ classId: cls }) => {
    if (cls && !classMap.has(cls._id.toString())) {
      classMap.set(cls._id.toString(), cls);
    }
  });

  const uniqueClasses = Array.from(classMap.values());

  res.json({ success: true, classes: uniqueClasses });
});
export const getAssignedClasses = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the teacher with their assigned classes and subjects
    const teacher = await User.findById(teacherId).populate({
      path: 'teachingAssignments.class',
      model: 'Class',
    }).populate({
      path: 'teachingAssignments.subject',
      model: 'Subject',
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher.teachingAssignments);
  } catch (error) {
    console.error("Error fetching assigned classes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

