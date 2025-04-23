// routes/performanceRoutes.js
import express from 'express';
import { predictStudentPerformance } from '../controller/performanceController.js';
import { protect } from '../middlewares/authMiddlewares.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// Only teacher/admin can predict
router.get('/predict/:studentId', protect, authorizeRoles('teacher', 'admin'), predictStudentPerformance);

export default router;
