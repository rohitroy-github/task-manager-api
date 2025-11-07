import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Task from "../src/model/taskModel.js";

describe("Task CRUD (Mongo)", () => {

  // ✅ Clear DB before every test
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  // ✅ Close DB after test run
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a task with default completed=false", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Learn DevOps" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Learn DevOps");
    expect(res.body.completed).toBe(false);
  });

  it("should not create a task without title", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });

  it("should get all tasks", async () => {
    await Task.create({ title: "Task A" });
    await Task.create({ title: "Task B" });

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should get a single task", async () => {
    const created = await Task.create({ title: "Test One" });

    const res = await request(app).get(`/tasks/${created._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test One");
  });

  it("should return 404 for non-existent task", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/tasks/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

  it("should update a task", async () => {
    const created = await Task.create({ title: "Old Title" });

    const res = await request(app)
      .put(`/tasks/${created._id}`)
      .send({ title: "New Title", completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.completed).toBe(true);
  });

  it("should return 404 when updating non-existent task", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ title: "Nothing" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

  it("should delete a task", async () => {
    const created = await Task.create({ title: "Delete me" });

    const res = await request(app).delete(`/tasks/${created._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 when deleting non-existent task", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });
});
