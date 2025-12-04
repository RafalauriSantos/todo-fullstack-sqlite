# 🚀 React & Node Fullstack Task Manager

A modern, robust Task Management application built to demonstrate **Client-Server Architecture**, **RESTful API** principles, and **Real-time Data Persistence**.

This project has evolved into a decoupled Fullstack application using **React** for the frontend and **Node.js** for the backend.

## 🛠️ Tech Stack

### **Back-end (API)**

- **Node.js & Fastify:** High-performance server (Port 3000)
- **SQLite (`better-sqlite3`):** SQL Database for real persistence
- **RESTful API:** Clean endpoints for CRUD operations

### **Front-end (Client)**

- **React.js (Vite):** Modern UI running on Port 5173
- **Hooks:** Uses `useState` and `useEffect` for state management
- **Fetch API:** Asynchronous communication with the backend

## ⚙️ Key Features

- ✅ **Decoupled Architecture:** Frontend and Backend run independently but communicate seamlessly
- ✅ **Complete CRUD:**
  - ✅ **Create:** Add new tasks via POST
  - ✅ **Read:** List all tasks via GET
  - ✅ **Update:** Toggle task status (Done/Pending) via PATCH
  - ✅ **Delete:** Remove tasks via DELETE
- ✅ **Smart UI:** Optimistic updates (UI updates instantly) and dynamic rendering
- ✅ **Developer Experience:** Runs both servers with a single command using `concurrently`

## 📦 How to Run

Since this project uses a Client-Server structure, you need to install dependencies for both folders.

### 1. Clone the repository

```bash
git clone https://github.com/RafalauriSantos/todo-fullstack-sqlite.git
cd todo-fullstack-sqlite
```

### 2. Install Back-end Dependencies (Root)

```bash
npm install
```

### 3. Install Front-end Dependencies (Client)

```bash
cd client
npm install
cd ..
```

### 4. Run the Application 🚀

This command will start both the Node server and React client simultaneously:

```bash
npm run dev
```

| Service             | URL                   |
| ------------------- | --------------------- |
| 🖥️ **Front-end**    | http://localhost:5173 |
| ⚙️ **Back-end API** | http://localhost:3000 |

---

Developed by **Rafael Lauri** as a Fullstack competency project.
