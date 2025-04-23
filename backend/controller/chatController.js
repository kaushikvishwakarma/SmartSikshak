import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  }).populate("users", "-password");

  if (existingChat) return res.json(existingChat);

  const newChat = await Chat.create({ users: [req.user._id, userId] });
  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
  res.status(201).json(fullChat);
};

export const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user._id })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });
  res.json(chats);
};

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const newMsg = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });
  const populated = await Message.findById(newMsg._id)
    .populate("sender", "name email")
    .populate("chat");
  await Chat.findByIdAndUpdate(chatId, { latestMessage: populated });
  res.status(201).json(populated);
};

export const fetchMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .populate("chat");
  res.json(messages);
};

export const createGroupChat = async (req, res) => {
  const { users, name, subjectId, assignmentId } = req.body;
  const groupChat = await Chat.create({
    name,
    isGroupChat: true,
    users: [...users, req.user._id],
    groupAdmin: req.user._id,
    subjectId,
    assignmentId,
  });
  const fullGroup = await Chat.findById(groupChat._id).populate("users", "-password");
  res.status(201).json(fullGroup);
};

export const postAnnouncement = async (req, res) => {
  const { content, chatId } = req.body;
  const message = await Message.create({
    sender: req.user._id,
    content: `📢 ANNOUNCEMENT: ${content}`,
    chat: chatId,
  });
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  res.status(201).json(message);
};
