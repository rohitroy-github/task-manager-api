import request from "supertest";
import app from "../src/app.js";
import { resetTasks } from "../src/data/task.js";
import { jest } from "@jest/globals";

describe("Task CRUD", () => {

  beforeEach(() => {
    jest.resetModules();
      resetTasks();

  });

  it("should create a task with default completed=false", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Learn DevOps" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
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
    await request(app).post("/tasks").send({ title: "Task A" });
    await request(app).post("/tasks").send({ title: "Task B" });

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should get a single task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Test One" });

    const res = await request(app).get(`/tasks/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test One");
  });

  it("should return 404 for non-existent task", async () => {
    const res = await request(app).get("/tasks/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

  it("should update a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Old Title" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ title: "New Title", completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.completed).toBe(true);
  });

  it("should return 404 when updating non-existent task", async () => {
    const res = await request(app)
      .put("/tasks/999")
      .send({ title: "Nothing" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

  it("should delete a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Delete me" });

    const res = await request(app).delete(`/tasks/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 when deleting non-existent task", async () => {
    const res = await request(app).delete("/tasks/987");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });

});
