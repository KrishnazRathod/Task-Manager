import mongoose from "mongoose";

const STATUSES = ["todo", "in_progress", "done"];
const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title must be 200 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be 2000 characters or fewer"],
      default: "",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "todo",
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ title: "text", description: "text" });

export const Task = mongoose.model("Task", taskSchema);
export { STATUSES, PRIORITIES };
