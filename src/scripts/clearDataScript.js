// scripts/clearData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";

dotenv.config();

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI);
    console.log("✅ MongoDB connected.");

    const taskResult = await Task.deleteMany({});
    console.log(
      `🗑️ Cleared Tasks collection — deleted ${taskResult.deletedCount}`
    );

    const userResult = await User.deleteMany({});
    console.log(
      `🗑️ Cleared Users collection — deleted ${userResult.deletedCount}`
    );

    await mongoose.connection.close();
    console.log("❌ DB disconnected.");
  } catch (err) {
    console.error("❌ Error while clearing database:", err);
  }
}

clearDatabase();
