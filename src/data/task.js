let tasks = [];
let nextId = 1;

export function getAll() {
  return tasks;
}

export function getById(id) {
  return tasks.find(t => t.id === id);
}

export function create(task) {
  const newTask = { id: nextId++, ...task };
  tasks.push(newTask);
  return newTask;
}

export function update(id, updatedTask) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updatedTask };
  return tasks[index];
}

export function remove(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

export const resetTasks = () => {
  tasks = [];
};