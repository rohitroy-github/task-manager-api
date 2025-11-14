import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "username & Password required" });

  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ error: "User already exists" });

  const user = await User.create({ username, password });
  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    token,
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username & Password both are required" });

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    token,
  });
};
