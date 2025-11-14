import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import User from "../src/model/userModel.js";
import Task from "../src/model/taskModel.js";

let mongoServer;

/**
 * Runs once before all test suites.
 * - Starts an in-memory MongoDB instance (no real DB needed)
 * - Sets JWT secret for tests
 * - Establishes a fresh Mongoose connection
 */
beforeAll(async () => {
  // Spin up a temporary in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database instance
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

/**
 * Runs after each individual test.
 * - Clears every collection to ensure tests run in isolation
 * - Makes sure no test data leaks into another test
 */
afterEach(async () => {
  // Get all active collections in the in-memory DB
  const collections = mongoose.connection.collections;

  // Wipe each collection fully
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  // Extra safety: explicitly clear specific models
  await User.deleteMany({});
  await Task.deleteMany({});
});

/**
 * Runs once after all tests complete.
 * - Closes Mongoose connection
 * - Shuts down the in-memory MongoDB instance
 */
afterAll(async () => {
  // Close DB connection
  await mongoose.disconnect();

  // Stop the in-memory MongoDB server
  await mongoServer.stop();
});
