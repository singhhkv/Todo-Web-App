# Quick Start - To-Do App

This is a rapid setup guide to get the To-Do App running immediately.

## ⚡ Prerequisites Check

Run these commands to verify you have everything:

```bash
node --version   # Should be v16+
npm --version    # Should be v8+
psql --version   # Should be v13+
```

## 🗄️ Database Setup (2 minutes)

### Option 1: Using psql Command Line
```bash
psql -U postgre
```
Then in psql:
```sql
CREATE DATABASE todo_app_db;
\q
```

### Option 2: Using pgAdmin
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `todo_app_db`
4. Save

## 🚀 Installation (5 minutes)

### 1. Backend Setup
```bash
cd To-Do-App/backend
npm install
npm run migrate
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
```

**Keep this terminal open!**

### 2. Frontend Setup (New Terminal)
```bash
cd To-Do-App/frontend
npm install
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

## 🎯 Test It!

1. Open http://localhost:5173
2. Click "Sign up"
3. Enter email and password
4. Check backend console for verification link (looks like: `http://localhost:5173/verify-email/abc123...`)
5. Copy the link and open in browser
6. Click "Go to Login"
7. Login with your credentials
8. Create a board
9. Add some todos
10. Drag and drop them!
11. Toggle dark mode

## 📧 Email Setup (Optional)

If you want real emails instead of console logging:

1. **Get Gmail App Password**:
   - Visit: https://myaccount.google.com/apppasswords
   - Generate password

2. **Update backend/.env**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. **Restart backend**

## 🐛 Quick Troubleshooting

**Port already in use?**
```bash
# Change backend/.env PORT to 5001
# Change frontend/.env VITE_API_URL to http://localhost:5001/api
```

**Database connection error?**
- Make sure PostgreSQL is running
- Verify credentials in `backend/.env`:
  ```
  DB_USER=postgre
  DB_PASSWORD=varun
  ```

**Frontend errors?**
```bash
cd frontend
rm -rf node_modules
npm install
```

## 📁 File Structure

### Backend (.env)
All credentials are already set:
- Database: `todo_app_db`
- Username: `postgre`
- Password: `varun`

### Frontend (.env)
API URL is already set:
- `VITE_API_URL=http://localhost:5000/api`

## ✅ You're Done!

The app should now be running with:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 🎨 Features to Try

1. **Authentication**
   - Sign up → Verify email → Login
   - Forgot password flow

2. **Boards**
   - Create multiple boards
   - Switch between boards
   - Delete boards

3. **Todos**
   - Add todos with priorities (Low/Medium/High)
   - Set due dates
   - Mark as complete
   - Drag and drop to reorder
   - Edit and delete

4. **UI**
   - Toggle dark mode
   - Responsive on mobile
   - Filter by All/Active/Completed

## 📤 Next Steps

When ready to submit:
1. Review SETUP_GUIDE.md for detailed instructions
2. Test all features
3. Push to GitHub

Need help? Check SETUP_GUIDE.md for detailed troubleshooting!
