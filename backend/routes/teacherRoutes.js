import express from 'express';
import {
  getTeacherDashboard,
  getTeacherAssignments,
  createAssignment,
  updateAssignment,
  getAssignmentSubmissions,
  markAttendance,
  getAssignedStudents,
  evaluateSubmissionManually,
  getClassesForTeacher,
} from '../controller/teacherController.js';

import { protect} from '../middlewares/authMiddlewares.js';
import { uploadMultiple } from '../middlewares/multer.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
// import { getTeacherWithTeachingAssignments } from '../controller/Getteaching.js';

const router = express.Router();

// Protect all routes and ensure only 'teacher' role
router.use(protect);
router.use(authorizeRoles('teacher'));

// Dashboard
router.get('/dashboard', getTeacherDashboard);

// Assignments
router.get('/assignments', getTeacherAssignments);
router.post('/assignments', uploadMultiple, createAssignment);
router.put('/assignments/:id', uploadMultiple, updateAssignment);
router.get('/classes',getClassesForTeacher);

// Submissions
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);

// Attendance
router.post('/attendance/:subjectId', markAttendance);

// Students
router.get('/students', getAssignedStudents);

// Evaluation
router.post('/evaluate/:submissionId', evaluateSubmissionManually);
router.get('/assignclasses/:teacherId',getClassesForTeacher);
// router.get('/getdetail/teaching/:teacherId',getTeacherWithTeachingAssignments);

export default router;
