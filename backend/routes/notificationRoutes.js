import express from 'express';
import { sendNotification, getNotifications, markRead } from '../controller/notificationController.js';
import { protect} from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/',protect, sendNotification);
router.put('/:id/mark-read', protect, markRead);

export default router;
