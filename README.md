# 🚀 To Task - Modern Fullstack Task Manager
> **From MVP to High-Fidelity SaaS**

"To Task" is a robust Task Management application that started as a simple proof-of-concept and evolved into a production-ready, secure, and visually stunning Fullstack application.

## 💡 The Evolution: Why we changed?

This project represents a journey of technical maturity. We moved beyond a simple "Todo List" to tackle real-world software challenges:

1.  **From Functional to Emotional Design:**
    *   *Before:* Standard white background, generic inputs.
    *   *After:* **"Deep Space" Glassmorphism UI**. We implemented CSS Keyframe animations (Floating Blobs), blur effects, and interactive hover states to create an engaging user experience.

2.  **From Shared to Secure (Multi-tenancy):**
    *   *Before:* All tasks were visible to everyone.
    *   *After:* **JWT Authentication & Data Isolation**. We implemented a secure backend where users can only access their own data, protected by Bcrypt password hashing.

3.  **From JavaScript to TypeScript:**
    *   *Before:* Loose typing and potential runtime errors.
    *   *After:* **Strict Type Safety**. We migrated the frontend to TypeScript to ensure code reliability and better developer experience.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
*   **Core:** React 19 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Custom CSS Modules (Animations)
*   **Design System:** Glassmorphism (Translucent Cards, Blurs)
*   **Icons:** React Icons (Feather)

### **Backend (API)**
*   **Server:** Node.js + Fastify (High Performance)
*   **Database:** PostgreSQL / SQLite (Production/Dev)
*   **Security:** `@fastify/jwt` (Token-based Auth) + `bcryptjs`
*   **Architecture:** RESTful API with Controller/Service separation

---

## ⚙️ Key Features

*   **🎨 Immersive UI:** Dark mode with "Aurora Borealis" animated backgrounds.
*   **🔐 Secure Authentication:** Complete Sign Up / Login flow.
*   **📱 Mobile-First:** Responsive design that adapts "blobs" and layouts to any screen size.
*   **⚡ Optimistic UI:** Instant feedback on task creation and updates.
*   **🛡️ Data Privacy:** Strict row-level security (users see only their tasks).

---

## 📦 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/RafalauriSantos/todo-fullstack-sqlite.git
cd todo-fullstack-sqlite
```

### 2. Install Dependencies

**Backend (Root):**
```bash
npm install
```

**Frontend (Client):**
```bash
cd client
npm install
cd ..
```

### 3. Run the App
```bash
npm run dev
```
The app will open at `http://localhost:5173`
 dev
```

The app will open at `http://localhost:5173`.
e" alt="streak stats" />
<br/>
<sub><i>Let's build the future together. 🚀</i></sub>
</div>
--

Developed by **Rafael Lauri** as a Fullstack competency project.
