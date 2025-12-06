# 🚀 To Task — Modern Fullstack Task Manager

<div align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=900&color=60A5FA&center=true&vCenter=true&width=480&lines=Hello%2C+I'm+Rafael+Lauri;Building+To+Task+with+AI+Pair+Programming;Node.js+%7C+React+%7C+PostgreSQL+%7C+TypeScript" alt="Typing intro" />
</div>

> From a simple MVP to a high-fidelity SaaS-style app. I am learning fast, pairing with AI, and aiming for a fully remote career. Not a genius (yet), just relentless.

## 💡 Why this evolution
- **Design with emotion:** We left the generic UI and adopted a "Deep Space" Glassmorphism look (blur, gradients, animated blobs) to make the experience memorable.
- **Security first:** Added JWT auth, bcrypt hashing, and per-user data isolation (multi-tenancy) so each person only sees their own tasks.
- **Type safety:** Migrated the frontend to TypeScript to reduce runtime surprises and improve maintainability.
- **Responsiveness:** Tuned the animated background to behave well on mobile and desktop.

## 🛠️ Tech Stack (used in this repo)
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, custom CSS animations (Glassmorphism + blobs), React Router v7, React Icons (Feather)
- **Backend:** Node.js, Fastify, PostgreSQL (prod) / SQLite (dev), `@fastify/jwt`, `bcryptjs`, CORS
- **Tooling/Dev:** Concurrent dev servers, Vercel Analytics snippet, ESBuild/Vite HMR

## ⚙️ Key Features
- 🎨 Dark + Glass UI with animated gradients/blobs and interactive hover states
- 🔐 Auth: Sign Up/Login, JWT-based sessions, bcrypt hashing
- 🛡️ Data privacy: each user accesses only their own tasks
- 📱 Mobile-first: responsive layout and tuned animations for small screens
- ⚡ Optimistic UI for task interactions

## 🧭 About me (quick)
Learning by doing and pairing with AI to ship faster and better. Goal: work remotely, keep leveling up—sky is the limit.

## 📦 How to Run
1) Clone
```bash
git clone https://github.com/RafalauriSantos/todo-fullstack-sqlite.git
cd todo-fullstack-sqlite
```
2) Install deps
```bash
npm install
cd client
npm install
cd ..
```
3) Run (frontend + backend)
```bash
npm run dev
```
The app opens at `http://localhost:5173`
