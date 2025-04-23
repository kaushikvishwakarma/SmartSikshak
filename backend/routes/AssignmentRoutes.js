import express from 'express';
import upload from '../middlewares/multer.js';
import { uploadAssignment,evaluateAssignment } from '../controller/AssignmentController.js';

const router = express.Router();

router.post('/upload', upload.single('pdf'), uploadAssignment);
router.post('/evaluate/:id', evaluateAssignment);

export default router;
