import express from 'express';
import { getAttendanceByDate, getAttendanceForLastNDays, markBulkAttendance, updateAttendanceById,RecentAttendance} from '../controller/attendanceController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// POST /api/teachers/attendance
router.post('/teachermark',protect, markBulkAttendance);


// Route to get attendance for a specific date
router.get('/bydate', getAttendanceByDate);
router.put('/update/:id',updateAttendanceById);
router.get('/recent/:studentId',RecentAttendance);

// Route to get attendance for last N days
router.get('/lastdays/:classId/:subjectId',getAttendanceForLastNDays);

export default router;
