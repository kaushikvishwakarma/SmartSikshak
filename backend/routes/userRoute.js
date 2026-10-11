// routes/userRoutes.js
import express from 'express';
import upload from '../middlewares/multer.js';

import multer from 'multer';
import path from 'path';
import {
  loginUser,
  publicRegister,
  getProfile,
  updateProfile,
  changePassword,
  registerUserByMentor,
  getUserProfile,
  updateUserProfile,
  updateUserRoles,
  uploadProfilePicture,
  updateUserProfileDetails,
  getAllTeachers,
  getAllUsers,
  logout
} from '../controller/userController.js';


import { protect, isMentor } from '../middlewares/authMiddlewares.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { assignClassToTeacher, registerTeacher,getStudentsByClassAndSubject } from '../controller/teacherController.js';

const router = express.Router();

// Public Routes
router.post('/login', loginUser);
router.post('/signup', publicRegister);
router.delete('/logout',logout);

// Protected Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Mentor-only: Register student/teacher
router.post('/mentor/register', protect, isMentor, registerUserByMentor);
router.get('/teachers', protect, isMentor, getAllTeachers);

router.post('/registerteacher',protect, registerTeacher);
router.post('/:teacherId/assign',protect,isMentor, assignClassToTeacher);

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfileDetails);
// router.post('/:id/upload-profile-picture', protect, upload.single('profilePicture'), updateUserProfileDetails);
router.post(
  '/:id/upload-profile-picture',
  protect,
  (req, res, next) => {
    const uploadHandler = upload.single('profilePicture');
    uploadHandler(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: 'Profile picture upload failed', details: err.message });
      }
      next();
    });
  },
  updateUserProfileDetails
);
router.put('/:id/roles', protect, updateUserRoles);//route ke andar hi use kar rakhi hai na middleware functionaliyt yar
router.get('/', protect, authorizeRoles('admin', 'teacher'), getAllUsers);
router.get('/:teacherId/class/:classId/subject/:subjectId/students',protect,getStudentsByClassAndSubject);


export default router;
