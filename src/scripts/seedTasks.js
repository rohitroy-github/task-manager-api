// bulkInsertTasks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../model/taskModel.js";

dotenv.config();

// ✅ 25 random tasks
const sampleTitles = [
  "Fix login authentication bug",
  "Implement JWT refresh token rotation",
  "Add pagination to product listing",
  "Optimize database query for dashboard",
  "Improve API request validation middleware",
  "Add unit tests for user service",
  "Upgrade Node.js version and dependencies",
  "Add logging using Winston",
  "Implement rate limiting for public endpoints",
  "Add dark mode support",
  "Build CI/CD pipeline",
  "Refactor controller structure",
  "Write integration tests",
  "Fix memory leak issue",
  "Implement Redis caching",
  "Migrate DB to new schema",
  "Create role-based access control",
  "Improve error handling responses",
  "Implement search functionality",
  "Fix UI alignment issues in dashboard",
  "Implement forgot-password flow",
  "Add analytics event tracking",
  "Improve Lighthouse performance score",
  "Add swagger API documentation",
  "Code cleanup: remove dead code",
];

const sampleDescriptions = [
  "Required for next sprint",
  "Needs developer review",
  "High priority",
  "Low priority",
  "Part of user request",
  "Assigned to backend team",
  "Check performance impact",
  "Depends on ticket #52",
  "Needs cross-team coordination",
  "Expected by next release",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function insertTasks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Task.deleteMany({});
    console.log("🧹 Previous tasks cleared.");

    const tasks = [];

    for (let i = 0; i < 25; i++) {
      tasks.push({
        title: randomItem(sampleTitles),
        description: randomItem(sampleDescriptions),
        completed: Math.random() > 0.7, // ~30% true
      });
    }

    const result = await Task.insertMany(tasks);
    console.log(`✅ Inserted ${result.length} tasks`);

    mongoose.connection.close();
    console.log("🔌 DB connection closed");
  } catch (err) {
    console.error("❌ Error inserting tasks:", err);
  }
}

insertTasks();
