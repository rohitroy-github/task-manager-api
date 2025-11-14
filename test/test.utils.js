import jwt from "jsonwebtoken";
import User from "../src/model/userModel.js";
import Task from "../src/model/taskModel.js";

/**
 * Creates a new user and returns both user + auth token
 */
export async function createUserAndToken(
  username = "rohitroy",
  password = "password"
) {
  const user = await User.create({ username, password });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
  return { user, token };
}

/**
 * Creates a task for a given user
 */
export async function createTaskForUser(
  user,
  title = "Sample Task",
  description = "Test desc"
) {
  return await Task.create({ title, description, user: user._id });
}
