import express from 'express';
import { createSubject, getAllSubjects, getSubjectbyId } from '../controller/subjectController.js';
import { protect } from '../middlewares/authMiddlewares.js';



const router = express.Router();

// Get all subjects (available to authenticated users)
router.post('/',protect, createSubject);
router.get('/', protect, getAllSubjects);
router.get('/:id',protect,getSubjectbyId);

export default router;
