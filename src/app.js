import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { connectDB } from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use("/tasks", taskRoutes);

export default app;
