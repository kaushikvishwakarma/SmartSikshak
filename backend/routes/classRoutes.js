import express from 'express';
import {
  createClass,
  getAllClasses,
  getClassById,
  getClassSubjects,
  updateClass
} from '../controller/classController.js';
import { protect, isMentor } from '../middlewares/authMiddlewares.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// POST /api/classes — create a new class
router.post('/',protect,isMentor, createClass);

// GET /api/classes — get all classes
router.get('/',protect, getAllClasses);

// GET /api/classes/:id — get class by ID
router.get('/:id',protect, getClassById);

// PUT /api/classes/:id — update class by ID
router.put('/:id',protect, updateClass);
router.get('/classsubjects/:classId',protect,getClassSubjects);

export default router;
