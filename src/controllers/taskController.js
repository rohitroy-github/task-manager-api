import Task from "../model/taskModel.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
};

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = await Task.create(req.body);
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json({ success: true, message: "Task deleted" });
};
