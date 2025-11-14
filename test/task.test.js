import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import User from "../src/model/userModel.js";
import Task from "../src/model/taskModel.js";

import { createUserAndToken, createTaskForUser } from "./test.utils.js";

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

const username = process.env.TEST_USER_USERNAME;
const password = process.env.TEST_USER_PASSWORD;

let token, user, task;

describe("User Registration API", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username, password });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username", username);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register if username is missing", async () => {
    const res = await request(app).post("/auth/register").send({ password });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("username & Password required");
  });

  it("should not register if user already exists", async () => {
    await User.create({ username, password });

    const res = await request(app)
      .post("/auth/register")
      .send({ username, password });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });
});

describe("User Login API", () => {
  beforeEach(async () => {
    // Create a user before each test
    await User.create({ username, password });
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username", username);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with invalid username", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "invalidUser", password });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("should fail login with incorrect password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username, password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("should fail when username or password is missing", async () => {
    const res = await request(app).post("/auth/login").send({ username });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Create Task API", () => {
  beforeEach(async () => {
    ({ user, token } = await createUserAndToken());
  });

  it("should create a new task successfully when authenticated", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Learn Supertest",
        description: "Write tests for createTask",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title", "Learn Supertest");
    expect(res.body).toHaveProperty(
      "description",
      "Write tests for createTask"
    );

    // Verify it's linked to the user
    const task = await Task.findById(res.body._id);
    expect(task.user.toString()).toBe(user._id.toString());
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Unauthorized task",
      description: "This should fail",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", "Bearer invalidtoken")
      .send({
        title: "Invalid token task",
        description: "This should also fail",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid token");
  });
});

describe("Update Task API", () => {
  beforeEach(async () => {
    ({ user, token } = await createUserAndToken());
    task = await createTaskForUser(
      user,
      "Initial Task",
      "Original description"
    );
  });

  it("should update a task successfully when authenticated", async () => {
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", task._id.toString());
    expect(res.body).toHaveProperty("title", "Updated Task Title");

    // Verify update persisted in DB
    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe("Updated Task Title");
  });

  it("should return 404 if task does not belong to the user", async () => {
    const { user: anotherUser, token: anotherToken } = await createUserAndToken(
      "otheruser",
      "password"
    );

    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${anotherToken}`)
      .send({ title: "Hacked Update" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found or unauthorized");
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send({ title: "No Auth Update" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .set("Authorization", "Bearer invalidtoken")
      .send({ title: "Invalid Token Update" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid token");
  });
});

describe("Delete Task API", () => {
  beforeEach(async () => {
    ({ user, token } = await createUserAndToken());
  });

  it("should delete a task successfully", async () => {
    const task = await createTaskForUser(user, "Task to delete");

    const res = await request(app)
      .delete(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task deleted");

    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });

  it("should return 404 if task not found or unauthorized", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/tasks/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found or unauthorized");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).delete("/tasks/1234567890abcdef");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  it("should return 401 if token is invalid", async () => {
    const task = await createTaskForUser(user, "Task with invalid token");

    const res = await request(app)
      .delete(`/tasks/${task._id}`)
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid token");
  });
});

describe("Fetch Task API", () => {
  beforeEach(async () => {
    // Create user and generate JWT
    user = await User.create({ username, password });
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Create sample tasks for that user
    await Task.create([
      { title: "Task 1", description: "Test task one", user: user._id },
      { title: "Task 2", description: "Test task two", user: user._id },
    ]);
  });

  it("should fetch all tasks for the authenticated user", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("description");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  it("should fetch a specific task by ID", async () => {
    const task = await Task.findOne({ title: "Task 1" });

    const res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", task._id.toString());
    expect(res.body).toHaveProperty("title", "Task 1");
  });

  it("should return 404 if task not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/tasks/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

  it("should return 401 if no token is provided", async () => {
    const task = await Task.findOne();
    const res = await request(app).get(`/tasks/${task._id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });
});
