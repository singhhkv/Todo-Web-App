<div align="center">

  <h1>📝 To Do App</h1>
  
  <p>
    A stunning, full-stack task management application featuring a modern <b>Glassmorphism UI</b>, 
    drag-and-drop organization, and robust security. Built for productivity and aesthetics.
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

<br />

## ✨ Features

- **🎨 Stunning Glassmorphism UI**: A premium dark-mode aesthetic with blurred glass effects, vibrant gradients, and smooth animations.
- **🔐 Secure Authentication**: Complete auth system including Login, Signup, Email Verification, and Password Reset (JWT-based).
- **📋 Kanban-Style Boards**: Create multiple boards to organize different projects or categories.
- **🖐️ Drag & Drop**: Intuitively reorder tasks using `@dnd-kit` for smooth performance.
- **⚡ Real-time Updates**: Instant interactions for creating, editing, and deleting tasks.
- **🏷️ Priority & Due Dates**: Manage tasks with High/Medium/Low priorities and deadline tracking.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (custom configuration for glass effects)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Drag & Drop**: @dnd-kit/core
- **Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js & Express.js
- **Database**: PostgreSQL (relational data integrity)
- **ORM**: Raw SQL / `pg` library for optimized queries
- **Auth**: JSON Web Tokens (JWT) & bcrypt
- **Email**: Nodemailer (for verification & resets)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### **Prerequisites**
- Node.js (v16+)
- PostgreSQL installed and running

### **1. Clone the Repository**
```bash
git clone https://github.com/singhhkv/todo-app.git
cd todo-app
```

### **2. Database Setup**
Create a PostgreSQL database and run the initialization script.
```sql
CREATE DATABASE todo_db;
```
*Tip: Use the schema provided in `backend/database/*.sql` to set up tables.*

### **3. Backend Setup**
```bash
cd backend
npm install

# Configure Environment Variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```
Start the server:
```bash
npm start
```
*Server runs on port `5000` by default.*

### **4. Frontend Setup**
Open a new terminal:
```bash
cd frontend
npm install

# Configure Environment Variables
# Create .env file if needed, main config is in vite.config.js
```
Start the development server:
```bash
npm run dev
```
*App runs on `http://localhost:5173`.*

---

## 🔑 Environment Variables

### **Backend (`backend/.env`)**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Authenticate user & get token |
| **POST** | `/api/auth/register` | Create a new account |
| **GET** | `/api/boards` | Get all user boards |
| **POST** | `/api/tasks` | Create a new task (body: `boardId`, `title`, etc.) |
| **PUT** | `/api/todos/:id` | Update task status or details |
| **DELETE** | `/api/todos/:id` | Drop a task |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built by <b>Karanveer Singh</b></p>
</div>
