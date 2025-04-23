import express from 'express';
import { zoomOAuthCallback } from '../controller/zoomController.js';
import { protect } from '../middlewares/authMiddlewares.js'; // make sure user is logged in

const router = express.Router();

router.get('/callback', protect, zoomOAuthCallback);

export default router;
