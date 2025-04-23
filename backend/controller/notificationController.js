import Notification from "../models/Notification.js";
import { io } from "../socket/socket.js";

export const sendNotification = async (req, res) => {
  const {  title, body } = req.body;

  const notification = await Notification.create({
    user: req.user._id,
    title,
    body,
  });

  // Emit real-time notification
  if (global.users && global.users[userId]) {
    io.to(global.users[userId]).emit("notification", notification);
  }

  res.status(201).json({ message: "Notification sent", notification });
};

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markRead = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  res.json(notification);
};
