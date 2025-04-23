import express from 'express';
import { protect } from '../middlewares/authMiddlewares.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import {
  predictStudentPerformance,
  // getAllPredictionsForStudent,
  // deletePredictionById
} from '../controller/predictionController.js';

const router = express.Router();

// 🔮 Predict performance using AI (teacher/mentor only)
router.post('/:studentId', protect, authorizeRoles('teacher', 'mentor', 'admin'), predictStudentPerformance);

// 📊 Get all predictions of a student (accessible by student + teachers/mentors)
// router.get('/:studentId', protect, getAllPredictionsForStudent);

// ❌ Delete a specific prediction (optional - admin only)
// router.delete('/:predictionId', protect, authorizeRoles('admin'), deletePredictionById);

export default router;
