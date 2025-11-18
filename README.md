# 🚀 Task Manager API

A robust, authenticated RESTful API for personal task management. It provides secure endpoints for user registration, login, and full CRUD operations on tasks, ensuring private data access using JSON Web Tokens (JWT) for all protected routes.

---

## 🔐 Authentication Endpoints (`/api/auth`)

| Route               | Method | Description                           | Access |
|---------------------|--------|---------------------------------------|--------|
| `/api/auth/register` | POST   | Creates a new user account.           | Public |
| `/api/auth/login`    | POST   | Authenticates user & returns a token. | Public |

---

## 📝 Task Management Endpoints (`/api/tasks`)

| Route            | Method | Description                            | Access                       |
|------------------|--------|----------------------------------------|------------------------------|
| `/api/tasks`      | GET    | Fetches all tasks for the authenticated user. | Private (Requires Token) |
| `/api/tasks`      | POST   | Creates a new task.                    | Private (Requires Token) |
| `/api/tasks/:id`  | GET    | Fetches a specific task by ID.         | Private (Requires Token) |
| `/api/tasks/:id`  | PUT    | Updates an existing task by ID.        | Private (Requires Token) |
| `/api/tasks/:id`  | DELETE | Deletes a task by ID.                  | Private (Requires Token) |

---

## 🛠️ Technology Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (or similar NoSQL)  
- **Authentication:** JSON Web Tokens (JWT)

---

## 📦 Installation & Setup

### **Prerequisites**
Ensure Node.js and npm are installed.

### **Quick Start**
```bash
git clone https://github.com/rohitroy-github/task-manager-api.git
cd task-manager-api
npm install
npm start
```

## 🏃 Available Scripts

| Script                | Command            | Description                                   |
|-----------------------|---------------------|-----------------------------------------------|
| Start (Production)    | `npm run dev`       | Starts the server in production mode.         |
| Run Tests             | `npm run tests`     | Executes the full test suite.                 |
| Clear Data            | `npm run clear`     | **Danger:** Removes all database records.     |
| Feed Data             | `npm run feed`      | Seeds the database with dummy data.           |
