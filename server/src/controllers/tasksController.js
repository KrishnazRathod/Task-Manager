import { Task, STATUSES, PRIORITIES } from "../models/Task.js";
import { asyncHandler } from "../middleware/errorHandler.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function parseDueDate(value) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw httpError(400, "dueDate must be a valid date");
  }
  return date;
}

export const listTasks = asyncHandler(async (req, res) => {
  const { status, q, priority } = req.query;
  const filter = {};

  if (status) {
    if (!STATUSES.includes(status)) {
      throw httpError(400, `status must be one of: ${STATUSES.join(", ")}`);
    }
    filter.status = status;
  }

  if (priority) {
    if (!PRIORITIES.includes(priority)) {
      throw httpError(400, `priority must be one of: ${PRIORITIES.join(", ")}`);
    }
    filter.priority = priority;
  }

  if (q && String(q).trim()) {
    const term = String(q).trim();
    filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw httpError(404, "Task not found");
  res.json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  if (!title || !String(title).trim()) {
    throw httpError(400, "Title is required");
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate: parseDueDate(dueDate),
  });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const allowed = ["title", "description", "status", "priority", "dueDate"];
  const patch = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      patch[key] = key === "dueDate" ? parseDueDate(req.body[key]) : req.body[key];
    }
  }

  if (Object.keys(patch).length === 0) {
    throw httpError(400, "No updatable fields provided");
  }

  const task = await Task.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  });
  if (!task) throw httpError(404, "Task not found");
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw httpError(404, "Task not found");
  res.status(204).send();
});
