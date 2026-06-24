# Development Guide - Authentication System

## Overview

This guide explains how to extend and customize the authentication system for your specific needs.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
├─────────────────────────────────────────────────────────────┤
│  AuthContext  ← State Management                             │
│  useAuth()    ← Consumer Hook                                │
│  ProtectedRoute ← Route Guards                               │
└──────────────┬──────────────────────────────────────────────┘
               │ API Calls (Axios)
               │ JWT in Headers
               ↓
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Node.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Auth Routes  → /api/auth/register                           │
│              → /api/auth/login                               │
│              → /api/auth/verify                              │
│  Middleware   → verifyToken()                                │
│  Storage      → users.json (can replace with DB)            │
└─────────────────────────────────────────────────────────────┘
```

## Common Customizations

### 1. Database Integration

#### Replace JSON Storage with MongoDB

**Backend changes:**

```bash
npm install mongoose
```

Create `backend/models/User.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
```

Update `backend/utils/userStorage.js`:

```javascript
const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const addUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

// ... other functions
```

#### Replace JSON Storage with PostgreSQL

**Backend changes:**

```bash
npm install pg sequelize
npx sequelize-cli init
```

Create `backend/models/user.js` using Sequelize...

### 2. Add Email Verification

**Backend route addition:**

```javascript
const nodemailer = require('nodemailer');

router.post('/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;
  
  // Verify code and update user
  // Send verification email
});
```

**Frontend component update:**

```jsx
const [verificationCode, setVerificationCode] = useState('');

// After registration, show verification form
<input 
  value={verificationCode}
  onChange={(e) => setVerificationCode(e.target.value)}
  placeholder="Enter verification code"
/>
```

### 3. Add Password Reset

**Backend routes:**

```javascript
// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Generate reset token
  // Send email with reset link
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  // Verify token
  // Update password
});
```

**Frontend pages:**

```jsx
// src/pages/ForgotPassword.jsx
// src/pages/ResetPassword.jsx
```

### 4. Add OAuth Integration (Google)

**Backend setup:**

```bash
npm install passport passport-google-oauth20
```

Create `backend/config/passport.js`:

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Find or create user
}));
```

Add routes:

```javascript
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT and redirect
  }
);
```

### 5. Add Two-Factor Authentication

**Backend library:**

```bash
npm install speakeasy qrcode
```

**Route for 2FA setup:**

```javascript
router.post('/2fa/setup', verifyToken, async (req, res) => {
  const secret = speakeasy.generateSecret();
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  
  res.json({ secret: secret.base32, qrCode });
});

router.post('/2fa/verify', verifyToken, async (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token
  });
  
  res.json({ verified });
});
```

### 6. Add Session Management

Track active sessions:

```javascript
// backend/models/Session.js
const sessionSchema = {
  userId: String,
  token: String,
  device: String,
  ipAddress: String,
  createdAt: Date,
  expiresAt: Date
};

router.get('/sessions', verifyToken, async (req, res) => {
  const sessions = await getActiveSessionsForUser(req.user.id);
  res.json(sessions);
});

router.post('/sessions/logout-all', verifyToken, async (req, res) => {
  await invalidateAllUserSessions(req.user.id);
  res.json({ message: 'All sessions logged out' });
});
```

## Testing the Auth System

### Unit Tests (Backend)

```javascript
// backend/tests/auth.test.js
const request = require('supertest');
const app = require('../index');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

### Integration Tests (Frontend)

```javascript
// frontend/src/__tests__/auth.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login Page', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should submit login form', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.click(screen.getByText(/login/i));
  });
});
```

## Performance Optimization

### 1. Token Caching

```javascript
// Avoid re-verifying tokens frequently
const tokenCache = new Map();

const verifyTokenCached = (token) => {
  if (tokenCache.has(token)) {
    return tokenCache.get(token);
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  tokenCache.set(token, decoded);
  
  return decoded;
};
```

### 2. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});

router.post('/login', loginLimiter, async (req, res) => {
  // Login logic
});
```

### 3. JWT Refresh Tokens

```javascript
// Generate both access and refresh tokens
const accessToken = jwt.sign(payload, SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

// Endpoint to refresh access token
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

## Security Best Practices

### 1. Password Policy

```javascript
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password)
  };
  
  return Object.values(requirements).every(req => req);
};
```

### 2. HTTPS Only

```javascript
// Middleware to enforce HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.protocol !== 'https') {
    res.redirect(`https://${req.get('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 3. CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Helmet Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## Debugging Tips

### Backend Debugging

```javascript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Auth Header:', req.headers.authorization);
  next();
});
```

### Frontend Debugging

```javascript
// Add logging to auth API
export const authAPI = {
  login: async (email, password) => {
    console.log('Login attempt:', email);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  }
};
```

## Deployment Considerations

### Environment Variables for Production

```env
# .env.production
JWT_SECRET=<long-random-key>
JWT_EXPIRY=7d
PORT=4000
DATABASE_URL=<production-db-url>
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Backup

```bash
# MongoDB backup
mongodump --db software-evolution-predictor

# PostgreSQL backup
pg_dump database_name > backup.sql
```

## Monitoring & Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { userId: req.user.id });
```

## Resources & References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Support

For issues or questions during development:
1. Check existing documentation
2. Review code comments
3. Run with verbose logging
4. Check network requests in DevTools
