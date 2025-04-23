// routes/studentRoutes.js
import express from 'express';
import {
  getDashboardOverview,
  getAssignmentsForStudent,
  getAttendance,
  getActivities,
  submitAssignmentByStudent,
  getPerformanceSummary,
  getSubjects,
  getSubmissionsByStudent
} from '../controller/studentController.js';
import { protect } from '../middlewares/authMiddlewares.js';
import { isStudent } from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.use(protect, isStudent);

router.get('/dashboard/:id', getDashboardOverview);
router.get('/assignments', getAssignmentsForStudent);
router.get('/attendance', getAttendance);
router.get('/activities', getActivities);
router.post('/submit-assignment',upload.single('file'), submitAssignmentByStudent);
router.get('/performance', getPerformanceSummary);
router.get('/subjects', getSubjects);
router.get('/submissions/:studentId',getSubmissionsByStudent);


export default router;
