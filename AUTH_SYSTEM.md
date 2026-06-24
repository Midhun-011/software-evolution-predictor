# Authentication System Documentation

## Overview

A complete JWT-based authentication system has been added to the Software Evolution Predictor application. This includes secure user registration, login, and protected routes.

## Backend Implementation

### New Files Created

#### 1. **Backend Dependencies** (`backend/package.json`)
Added authentication libraries:
- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `dotenv` - Environment variable management
- `uuid` - Unique user ID generation

#### 2. **Environment Configuration** (`backend/.env`)
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d
PORT=4000
```

#### 3. **User Storage** (`backend/utils/userStorage.js`)
Simple JSON-based user persistence system that:
- Reads/writes users from `users.json`
- Finds users by email and ID
- Manages user data

#### 4. **Authentication Middleware** (`backend/middleware/auth.js`)
`verifyToken` middleware that:
- Validates JWT tokens from Authorization header
- Adds user data to request object
- Protects routes from unauthorized access

#### 5. **Auth Routes** (`backend/routes/auth.js`)
Three main endpoints:

**POST `/api/auth/register`**
- Accepts: `name`, `email`, `password`, `confirmPassword`
- Validates input and password strength (min 6 chars)
- Hashes password with bcryptjs
- Returns JWT token and user data

**POST `/api/auth/login`**
- Accepts: `email`, `password`
- Validates credentials
- Returns JWT token and user data

**GET `/api/auth/verify`**
- Accepts: Bearer token in Authorization header
- Returns: Valid user data or error

#### 6. **Updated Main Server** (`backend/index.js`)
- Added dotenv configuration
- Integrated auth middleware and routes
- Protected `/api/user/dashboard` route as example

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Frontend Implementation

### New Files Created

#### 1. **Frontend Dependencies** (`frontend/package.json`)
Added:
- `axios` - HTTP client for API calls

#### 2. **Auth API Utilities** (`frontend/src/api/auth.js`)
Functions for:
- `register()` - User registration
- `login()` - User login
- `logout()` - Clear auth tokens
- `verify()` - Verify current session
- `getToken()` - Get stored JWT token
- `getUser()` - Get stored user data

#### 3. **Auth Context** (`frontend/src/context/AuthContext.jsx`)
React Context for global auth state:
- `user` - Current authenticated user
- `loading` - Loading state during auth check
- `error` - Error messages
- Methods: `login()`, `register()`, `logout()`
- Hook: `useAuth()` for accessing auth context

#### 4. **Protected Route Component** (`frontend/src/components/ProtectedRoute.jsx`)
Guards routes that require authentication:
- Redirects to login if not authenticated
- Shows loading state while verifying
- Renders protected component if authenticated

#### 5. **Login Page** (`frontend/src/pages/Login.jsx`)
Features:
- Email and password input fields
- Form validation
- Error message display
- Link to registration page
- Demo credentials display
- Loading state during login

**Demo Credentials:**
```
Email: demo@example.com
Password: demo123
```

#### 6. **Registration Page** (`frontend/src/pages/Register.jsx`)
Features:
- Name, email, password, confirm password fields
- Password strength validation (min 6 chars)
- Password match validation
- Error message display
- Link to login page
- Loading state during registration

#### 7. **Dashboard Page** (`frontend/src/pages/Dashboard.jsx`)
Features:
- Welcome message with user name and email
- Logout button
- Features overview
- Integrated sidebar

#### 8. **Updated Sidebar** (`frontend/src/components/Sidebar.jsx`)
Enhanced with:
- Dashboard navigation link
- User info display (name and email)
- Logout button
- Sticky footer with user details

#### 9. **Updated Main App** (`frontend/src/App.jsx`)
Features:
- Auth state checking and loading display
- Conditional rendering: auth pages vs app pages
- Public routes: `/login`, `/register`
- Protected routes: `/dashboard`, `/`, `/analysis`
- Auto-redirect based on auth status

#### 10. **Auth Styles** (`frontend/src/styles/auth.css`)
Modern authentication UI with:
- Gradient backgrounds
- Smooth animations
- Form styling
- Error message styling
- Responsive design

#### 11. **Dashboard Styles** (`frontend/src/styles/dashboard.css`)
Dashboard-specific styling:
- Header layout
- Card grid layout
- User info display
- Logout button styling

#### 12. **Updated Base Styles** (`frontend/src/styles.css`)
Enhanced with:
- Improved sidebar layout
- User info section
- Logout button styling
- Better responsive design

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Application Flow

### Authentication Flow

1. **User Visits Application**
   - App checks for existing JWT token in localStorage
   - If valid token exists, user is automatically logged in
   - If no token or invalid token, user is redirected to login

2. **User Registration**
   - User fills registration form (name, email, password)
   - Frontend validates inputs locally
   - Backend validates and hashes password
   - User is automatically logged in on success
   - JWT token is stored in localStorage

3. **User Login**
   - User enters email and password
   - Backend validates credentials
   - JWT token is returned and stored
   - User is redirected to dashboard

4. **Accessing Protected Routes**
   - JWT token is automatically included in API requests
   - Backend middleware validates token
   - User can access protected resources

5. **User Logout**
   - JWT token is removed from localStorage
   - User is redirected to login page
   - Session is terminated

### API Communication

All protected API requests include the JWT token:
```
Authorization: Bearer <JWT_TOKEN>
```

## Security Features

1. **Password Hashing**
   - Passwords are hashed using bcryptjs (10 rounds)
   - Never stored in plain text

2. **JWT Tokens**
   - Tokens expire after 7 days (configurable)
   - Can be revoked by clearing localStorage
   - Signed with secret key

3. **Protected Routes**
   - Server-side middleware validates all tokens
   - Frontend guards routes with ProtectedRoute component

4. **Environment Variables**
   - Sensitive data in .env file
   - Not committed to repository (add to .gitignore)

5. **CORS Protection**
   - CORS middleware configured
   - Only allows requests from configured origins

## File Structure

```
backend/
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── routes/
│   └── auth.js                 # Authentication routes
├── utils/
│   └── userStorage.js          # User data management
├── index.js                    # Updated main server
├── .env                        # Environment variables
└── users.json                  # User database

frontend/
├── src/
│   ├── api/
│   │   └── auth.js             # Auth API calls
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── components/
│   │   ├── ProtectedRoute.jsx  # Protected route wrapper
│   │   └── Sidebar.jsx         # Updated with user info
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Dashboard page
│   │   ├── Overview.jsx        # (existing)
│   │   └── RepositoryAnalysis.jsx # (existing)
│   ├── styles/
│   │   ├── auth.css            # Auth pages styling
│   │   ├── dashboard.css       # Dashboard styling
│   │   └── styles.css          # Updated base styles
│   └── App.jsx                 # Updated with auth routing
```

## Usage Examples

### Register New User
```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

### Login
```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Access Protected Route
```bash
GET http://localhost:4000/api/user/dashboard
Authorization: Bearer <JWT_TOKEN>
```

## Next Steps / Improvements

1. **Database Integration**
   - Replace JSON file with MongoDB or PostgreSQL
   - Add user model with Mongoose/Sequelize

2. **Enhanced Security**
   - Implement refresh tokens
   - Add rate limiting
   - Email verification
   - Password reset functionality

3. **User Management**
   - Edit profile functionality
   - Change password
   - Delete account

4. **Advanced Features**
   - OAuth integration (Google, GitHub)
   - Two-factor authentication
   - Session management
   - Audit logging

5. **Testing**
   - Unit tests for auth functions
   - Integration tests for routes
   - E2E tests for auth flow

## Troubleshooting

**"Token is not valid" error**
- Check JWT_SECRET matches between backend and frontend
- Verify token hasn't expired
- Clear localStorage and re-login

**CORS errors**
- Ensure frontend URL is in CORS configuration
- Check backend is running on correct port

**Password validation fails**
- Password must be at least 6 characters
- Passwords must match in registration

**User already exists**
- Try with a different email address
- Check users.json for existing entries

## Support

For issues or questions about the authentication system, refer to the code comments and implementation files.
