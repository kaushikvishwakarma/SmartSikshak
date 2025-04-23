import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  accessChat,
  fetchChats,
  sendMessage,
  fetchMessages,
  createGroupChat,
  postAnnouncement,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, accessChat); // one-to-one chat
router.get("/", protect, fetchChats); // all chats for a user
router.post("/message", protect, sendMessage); // send message
router.get("/:chatId/messages", protect, fetchMessages); // fetch messages
router.post("/group", protect, createGroupChat); // group chat (subject/assignment)
router.post("/announcement", protect, postAnnouncement); // teacher pushes announcement

export default router;
