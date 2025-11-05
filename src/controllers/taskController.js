import * as Task from "../data/task.js";

export const getTasks = (req, res) => {
  res.json(Task.getAll());
};

export const getTask = (req, res) => {
  const task = Task.getById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
};

export const createTask = (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const newTask = Task.create({ title, completed: completed ?? false });
  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const updated = Task.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json(updated);
};

export const deleteTask = (req, res) => {
  const deleted = Task.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: "Task not found" });

  res.json({ success: true });
};
