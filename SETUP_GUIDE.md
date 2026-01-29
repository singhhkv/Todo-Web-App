# To-Do App - Complete Setup Guide

This guide will walk you through setting up and running the To-Do App from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [PostgreSQL Setup](#postgresql-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Email Configuration](#email-configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** v16+ and npm v8+
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **PostgreSQL** v13+
  - Download: https://www.postgresql.org/download/
  - Verify: `psql --version`

- **Git** (for submitting to GitHub)
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Optional
- **Gmail account** for sending emails
- **Postman** or **Thunder Client** for API testing

---

## PostgreSQL Setup

### Step 1: Install PostgreSQL
If not already installed, download and install PostgreSQL from the official website.

### Step 2: Create Database
Open PostgreSQL command line (psql) or pgAdmin and execute:

```sql
CREATE DATABASE todo_app_db;
```

### Step 3: Verify Connection
Test your connection with these credentials:
- **Host**: localhost
- **Port**: 5432 (default)
- **Database**: todo_app_db
- **Username**: postgre
- **Password**: varun

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd To-Do-App/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express
- pg (PostgreSQL client)
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemailer
- express-validator
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

The `.env` file is already created with your PostgreSQL credentials. Verify it contains:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app_db
DB_USER=postgre
DB_PASSWORD=varun

JWT_SECRET=todo-app-secret-key-2026-change-in-production
JWT_EXPIRES_IN=24h

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=To-Do App <your-gmail@gmail.com>

FRONTEND_URL=http://localhost:5173
```

> **Note**: Email configuration is optional for testing. Emails will be logged to console if not configured.

### Step 4: Run Database Migrations
```bash
npm run migrate
```

This creates all necessary tables:
- users
- boards
- todos
- tokens

You should see:
```
✅ Users table created
✅ Boards table created
✅ Todos table created
✅ Tokens table created
✅ Indexes created
🎉 All migrations completed successfully!
```

### Step 5: Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
📍 API URL: http://localhost:5000/api
🏥 Health check: http://localhost:5000/api/health
```

### Step 6: Test Backend
Open browser and visit: http://localhost:5000/api/health

You should see:
```json
{
  "success": true,
  "message": "To-Do App API is running!",
  "timestamp": "2026-01-30T00:00:00.000Z"
}
```

---

## Frontend Setup

### Step 1: Open New Terminal
Keep the backend running and open a new terminal.

### Step 2: Navigate to Frontend Directory
```bash
cd To-Do-App/frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install:
- react & react-dom
- react-router-dom
- @dnd-kit packages (drag-drop)
- axios
- tailwindcss
- vite
- lucide-react (icons)
- react-hot-toast
- date-fns

### Step 4: Verify Environment
The `.env` file should contain:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend Server
```bash
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 6: Open Application
Visit http://localhost:5173 in your browser.

---

## Email Configuration

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update Backend .env**
   ```env
   EMAIL_USER=your-actual-gmail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password from step 2
   EMAIL_FROM=To-Do App <your-actual-gmail@gmail.com>
   ```

4. **Restart Backend**
   ```bash
   # Stop backend (Ctrl+C)
   npm run dev
   ```

### Option 2: Console Logging (No Email Setup)

If you skip email configuration, all emails will be logged to the backend console. You'll see:

```
📧 ========== EMAIL (Console Mode) ==========
To: user@example.com
Subject: Verify Your Email - To-Do App
Body:
[Email HTML content with verification link]
==========================================
```

Simply copy the verification link from the console and paste it in your browser.

---

## Running the Application

### Starting Both Servers

**Terminal 1 (Backend):**
```bash
cd To-Do-App/backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd To-Do-App/frontend
npm run dev
```

### Stopping Servers
Press `Ctrl+C` in each terminal to stop the servers.

---

## Testing

### 1. User Registration Flow

1. **Open** http://localhost:5173
2. **Click** "Sign up"
3. **Fill form:**
   - Email: test@example.com
   - Password: test123456
   - Confirm Password: test123456
4. **Click** "Create Account"
5. **Check:**
   - If email configured: Check your inbox
   - If console mode: Check backend terminal for verification link
6. **Copy verification link** and paste in browser
7. **You should see:** "Email Verified!" message

### 2. Login Flow

1. **Click** "Go to Login"
2. **Enter credentials:**
   - Email: test@example.com
   - Password: test123456
3. **Click** "Sign In"
4. **You should be redirected** to Dashboard

### 3. Board Management

1. **Click** the "+" button next to "Boards"
2. **Enter board name:** "Work Tasks"
3. **Enter description:** "My work-related tasks"
4. **Click** "Create Board"
5. **Board appears** in sidebar

### 4. Todo Management

1. **Select a board** from sidebar
2. **Click** "Add Todo" button
3. **Fill form:**
   - Title: "Complete project documentation"
   - Description: "Write comprehensive README"
   - Priority: High
   - Due Date: Tomorrow's date
4. **Click** "Create Todo"
5. **Todo appears** in list with red "high" badge

### 5. Drag and Drop

1. **Create 3-4 todos**
2. **Click and hold** on a todo
3. **Drag** it to a new position
4. **Release** to drop
5. **Refresh page** - order should persist

### 6. Dark Mode

1. **Click** moon/sun icon in navbar
2. **Theme switches** smoothly
3. **Refresh page** - preference persists

### 7. Password Reset

1. **Logout** (click user menu → Logout)
2. **Click** "Forgot password?"
3. **Enter email** and submit
4. **Check console/email** for reset link
5. **Click link** and set new password
6. **Login** with new password

---

## Troubleshooting

### Backend Issues

**Problem: "Connection refused" or database error**
- **Solution**: Make sure PostgreSQL is running
  ```bash
  # Windows
  # Check Services for "postgresql-x64-XX"
  
  # Test connection
  psql -U postgre -d todo_app_db
  ```

**Problem: "Port 5000 already in use"**
- **Solution**: Change port in backend `.env`
  ```env
  PORT=5001
  ```
  Also update frontend `.env`:
  ```env
  VITE_API_URL=http://localhost:5001/api
  ```

**Problem: Migrations fail**
- **Solution**: Drop and recreate database
  ```sql
  DROP DATABASE todo_app_db;
  CREATE DATABASE todo_app_db;
  ```
  Then run migrations again.

### Frontend Issues

**Problem: "Failed to fetch" or CORS error**
- **Solution**: Ensure backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Restart both servers

**Problem: Blank page or build errors**
- **Solution**: Clear cache and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

**Problem: Drag and drop not working**
- **Solution**: Check if @dnd-kit packages are installed
  ```bash
  npm list @dnd-kit/core
  ```

### Email Issues

**Problem: Emails not sending**
- **Solution**: Check backend console for "Email service ready" message
- Verify Gmail app password is correct (no spaces)
- Ensure 2-Step Verification is enabled

**Problem: "Invalid credentials" error**
- **Solution**: Regenerate Gmail app password
- Update `.env` and restart backend

---

## Building for Production

### Backend
```bash
cd backend
npm start  # Uses node instead of nodemon
```

### Frontend
```bash
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

---

## GitHub Submission

### 1. Initialize Git
```bash
cd To-Do-App
git init
```

### 2. Add Files
```bash
git add .
git commit -m "Initial commit: Full-stack To-Do App"
```

### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Name: "To-Do-App" or "Full-Stack-Todo-Application"
3. Make it **Public**
4. **Don't** initialize with README (we have one)

### 4. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 5. Verify
Visit your repository URL and ensure all files are present.

---

## Next Steps

After setup:
1. ✅ Test all features thoroughly
2. ✅ Take screenshots for README
3. ✅ Review code for any issues
4. ✅ Ensure .env files are in .gitignore
5. ✅ Submit GitHub repository link

---

## Support

For issues or questions during setup:
1. Check error messages carefully
2. Review this guide step-by-step
3. Check backend console for detailed errors
4. Verify all prerequisites are installed

---

**Happy coding! 🚀**
