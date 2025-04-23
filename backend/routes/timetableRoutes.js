import express from 'express';
import { 
  createTimetable, 
  getAllTimetables, 
  getTimetableByUser, 
  updateTimetable, 
  deleteTimetable,
  getTodaysClasses,
  getSubjectWiseClasses
} from '../controller/timetableController.js';
import { protect } from '../middlewares/authMiddlewares.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// 🧑‍🏫 Only teachers/admin can create timetables
router.post('/', protect, authorizeRoles('teacher', 'admin'), createTimetable);

// 🔁 Update timetable (e.g. change time, recurrence)
router.put('/:id', protect, authorizeRoles('teacher', 'admin'), updateTimetable);

// ❌ Delete timetable
router.delete('/:id', protect, authorizeRoles('teacher', 'admin'), deleteTimetable);

// 📅 Get all timetables (admin/teacher)
router.get('/', protect, authorizeRoles('teacher', 'admin'), getAllTimetables);

// 👤 Get logged-in user’s timetable (student or teacher)
router.get('/me', protect, getTimetableByUser);

// 📆 Today’s classes only
router.get('/today', protect, getTodaysClasses);

// 📚 Subject-wise filter
router.get('/subject/:subjectId', protect, getSubjectWiseClasses);

export default router;
