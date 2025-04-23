// config/notification.js
import Notification from '../models/notification.model.js'; // A Mongoose model for saving notifications
import User from '../models/user.model.js';

export const sendNotificationToUsers = async ({ role, title, message }) => {
  // Find all users of that role
  const users = await User.find({ role });

  const notifications = users.map(user => ({
    user: user._id,
    title,
    message,
    timestamp: new Date()
  }));

  // Save all notifications to DB
  await Notification.insertMany(notifications);
};
