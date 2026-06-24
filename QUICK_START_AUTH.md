# Quick Start Guide - Authentication System

## Prerequisites
- Node.js (v14 or higher)
- npm

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created)
# Update JWT_SECRET if needed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:4000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

## Test the Authentication

### Option 1: Use Demo Credentials

1. Open frontend in browser: `http://localhost:5173`
2. Click "Login here" if on register page
3. Enter demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
4. Click Login

**Note:** Demo credentials won't exist initially. Create them by registering first.

### Option 2: Create New Account

1. Navigate to `http://localhost:5173/register`
2. Fill in:
   - Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - Confirm Password: Must match
3. Click Register
4. You'll be automatically logged in and redirected to Dashboard

## Features to Explore

### Dashboard
- View welcome message
- See your profile info
- Logout from here

### Sidebar
- Dashboard link
- Overview link
- Repository Analysis link
- User info section
- Logout button

### Protected Routes
- `/dashboard` - User dashboard
- `/` - Overview (protected)
- `/analysis` - Repository analysis (protected)

### Public Routes
- `/login` - Login page
- `/register` - Registration page

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Protected Endpoint Example
- `GET /api/user/dashboard` - Requires valid JWT token

## Common Tasks

### View All Users
Edit `backend/users.json` or:

```bash
cat backend/users.json
```

### Clear All Users (Reset)
```bash
echo "[]" > backend/users.json
```

### Change JWT Secret
Edit `backend/.env`:
```
JWT_SECRET=your_new_secret_key_here
```

### Change Token Expiry
Edit `backend/.env`:
```
JWT_EXPIRY=14d  # Change 7d to 14d for 2 weeks
```

## Troubleshooting

### Port Already in Use
Change port in `backend/.env`:
```
PORT=5000
```

### CORS Errors
- Ensure backend is running
- Check frontend URL is correct
- Verify no firewall blocking requests

### Blank Page
- Check browser console for errors
- Verify both frontend and backend are running
- Clear browser cache and localStorage

### Can't Login
- Verify user exists in `backend/users.json`
- Check email and password are correct
- Clear localStorage: `localStorage.clear()`

## Development Tips

### View Network Requests
- Open browser DevTools (F12)
- Go to Network tab
- Perform login/register
- See API requests and responses

### View Local Storage
- Open browser DevTools (F12)
- Go to Application → Local Storage
- See stored token and user data

### Backend Logs
- Check terminal where `npm run dev` is running
- See all API requests and responses

### Frontend Logs
- Open browser console (F12 → Console)
- See any JavaScript errors

## Next Steps

1. **Customize:** Update styling in `src/styles/`
2. **Extend:** Add more API routes following the pattern
3. **Deploy:** Prepare for production deployment
4. **Database:** Migrate from JSON to real database
5. **Testing:** Add test cases for auth flows

## Files Modified/Created

Backend:
- ✅ `package.json` - Updated dependencies
- ✅ `.env` - Environment variables
- ✅ `index.js` - Integrated auth system
- ✅ `middleware/auth.js` - JWT verification
- ✅ `routes/auth.js` - Auth endpoints
- ✅ `utils/userStorage.js` - User management
- ✅ `users.json` - User database

Frontend:
- ✅ `package.json` - Updated dependencies
- ✅ `src/App.jsx` - Auth routing
- ✅ `src/main.jsx` - Auth provider wrapper
- ✅ `src/api/auth.js` - API utilities
- ✅ `src/context/AuthContext.jsx` - Auth state
- ✅ `src/components/ProtectedRoute.jsx` - Route protection
- ✅ `src/components/Sidebar.jsx` - Updated navigation
- ✅ `src/pages/Login.jsx` - Login page
- ✅ `src/pages/Register.jsx` - Register page
- ✅ `src/pages/Dashboard.jsx` - Dashboard page
- ✅ `src/styles/auth.css` - Auth styles
- ✅ `src/styles/dashboard.css` - Dashboard styles
- ✅ `src/styles.css` - Base styles updated

## Support

For more details, see [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)
