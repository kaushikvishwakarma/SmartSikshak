import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: String,
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }, // for subject-based group
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }, // for assignment-based group
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
