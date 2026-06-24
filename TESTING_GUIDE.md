# Testing & Validation Guide

## Pre-Deployment Checklist

### ✅ Backend Verification

- [ ] Dependencies installed: `npm install` in backend directory
- [ ] .env file created with JWT_SECRET
- [ ] Server starts: `npm run dev`
- [ ] No console errors on startup
- [ ] Port 4000 is accessible

### ✅ Frontend Verification

- [ ] Dependencies installed: `npm install` in frontend directory
- [ ] Dev server starts: `npm run dev`
- [ ] No console errors on startup
- [ ] Vite running on http://localhost:5173

## Manual Testing

### Test 1: Registration Flow

**Steps:**
1. Go to http://localhost:5173/register
2. Fill in form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "TestPass123"
   - Confirm Password: "TestPass123"
3. Click Register

**Expected Results:**
- ✅ Form validates (password min 6 chars)
- ✅ No errors during submission
- ✅ Redirected to dashboard
- ✅ Welcome message shows correct name
- ✅ Token saved in localStorage
- ✅ User data saved in localStorage

**Check localStorage:**
```javascript
// Open DevTools Console and run:
console.log(localStorage.getItem('token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Test 2: Login Flow

**Steps:**
1. Logout from previous session (if logged in)
2. Clear localStorage: `localStorage.clear()`
3. Go to http://localhost:5173/login
4. Fill in form:
   - Email: "testuser@example.com"
   - Password: "TestPass123"
5. Click Login

**Expected Results:**
- ✅ Form submits successfully
- ✅ Redirected to dashboard
- ✅ Same user info displayed
- ✅ Token in localStorage
- ✅ Can access protected pages

### Test 3: Protected Routes

**Steps:**
1. Logged in, go to http://localhost:5173/
2. Should see Overview page
3. Go to http://localhost:5173/analysis
4. Should see Repository Analysis page
5. Go to http://localhost:5173/dashboard
6. Should see Dashboard page

**Expected Results:**
- ✅ All pages load without errors
- ✅ Sidebar shows user info
- ✅ No auth redirects
- ✅ Logout button visible

### Test 4: Unauthorized Access

**Steps:**
1. Clear localStorage: `localStorage.clear()`
2. Try direct access to http://localhost:5173/
3. Try direct access to http://localhost:5173/dashboard
4. Try direct access to http://localhost:5173/analysis

**Expected Results:**
- ✅ Redirected to /login
- ✅ Cannot see protected content
- ✅ Must login to access

### Test 5: Logout Flow

**Steps:**
1. Logged in and on dashboard
2. Click "Logout" button
3. Check browser location
4. Try accessing protected route

**Expected Results:**
- ✅ Redirected to /login
- ✅ localStorage cleared
- ✅ Token removed
- ✅ User data removed
- ✅ Cannot access protected pages

### Test 6: Form Validation

**Registration Validation:**

| Input | Expected Result |
|-------|-----------------|
| Empty fields | Show error: "All fields are required" |
| Password < 6 chars | Show error: "Password must be at least 6 characters" |
| Passwords don't match | Show error: "Passwords do not match" |
| Existing email | Show error: "Email already in use" |
| Valid inputs | Registration successful |

**Login Validation:**

| Input | Expected Result |
|-------|-----------------|
| Empty email | Show error: "Email and password are required" |
| Empty password | Show error: "Email and password are required" |
| Wrong password | Show error: "Invalid email or password" |
| Non-existent email | Show error: "Invalid email or password" |
| Valid credentials | Login successful |

### Test 7: Session Persistence

**Steps:**
1. Login successfully
2. Refresh browser page (F5)
3. Wait for loading to complete
4. Check if still logged in

**Expected Results:**
- ✅ Brief loading state appears
- ✅ Session automatically restored
- ✅ User data appears
- ✅ No need to re-login

### Test 8: Error Handling

**Test Network Error:**
1. Stop backend server
2. Try to login/register
3. Should show error message

**Test Invalid Token:**
```javascript
// In DevTools Console:
localStorage.setItem('token', 'invalid.token.here');
```
Then refresh page - should redirect to login

## API Testing

### Using cURL

**Test Registration:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

**Test Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Test Verify Token:**
```bash
curl -X GET http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Using Postman

1. **Create Collection:** "Auth Tests"

2. **Register Test:**
   - Method: POST
   - URL: http://localhost:4000/api/auth/register
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "testuser@example.com",
     "password": "TestPass123",
     "confirmPassword": "TestPass123"
   }
   ```

3. **Login Test:**
   - Method: POST
   - URL: http://localhost:4000/api/auth/login
   - Body (JSON):
   ```json
   {
     "email": "testuser@example.com",
     "password": "TestPass123"
   }
   ```

4. **Save token from response** to environment variable
   - Copy token from response
   - Set environment variable: `{{token}}`

5. **Verify Token:**
   - Method: GET
   - URL: http://localhost:4000/api/auth/verify
   - Headers:
     - Key: Authorization
     - Value: Bearer {{token}}

## Browser DevTools Inspection

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Perform login:
   - Request to `/api/auth/login`
   - Response includes token
   - Token stored in localStorage

### Check Storage

1. DevTools → Application → Local Storage
2. Verify entries:
   - `token` - JWT token
   - `user` - User JSON object

### Check Console

1. DevTools → Console
2. No red error messages
3. Authentication flow logs visible

## Performance Testing

### Load Testing

```bash
# Using Apache Bench
ab -n 100 -c 10 -p payload.json http://localhost:4000/api/auth/login

# Using hey (Go tool)
hey -n 100 -c 10 -m POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' \
  http://localhost:4000/api/auth/login
```

### Response Time

Should be < 200ms for:
- Registration
- Login
- Token verification

## Security Testing

### SQL Injection (N/A - JSON storage)
- Existing system uses JSON, not database
- When migrating to DB, use parameterized queries

### XSS Prevention
- All user input validated
- React escapes by default
- No `dangerouslySetInnerHTML` used

### CSRF Protection
- Token stored in localStorage
- CORS configured
- Same-site cookies (when deployed)

### Password Security
- Minimum 6 characters (configurable)
- Hashed with bcryptjs
- Never returned to frontend
- Never logged

## Test Scenarios

### Scenario 1: New User Journey
```
1. User visits app → redirected to /login
2. User clicks "Register here" → goes to /register
3. User fills registration form → validates
4. User submits → backend creates user, returns token
5. User auto-logged in → redirected to /dashboard
6. User sees welcome message with their name
✓ Success
```

### Scenario 2: Returning User
```
1. User visits app → browser has valid token
2. App verifies token → successful
3. User auto-logged in → sent to /dashboard
4. User sees their dashboard
5. User can access all features
✓ Success
```

### Scenario 3: Failed Login Recovery
```
1. User enters wrong password → shows error
2. User corrects password → can login
3. User successfully logs in
✓ Success
```

### Scenario 4: Session Timeout
```
1. User logged in
2. Time passes (> 7 days if not extended)
3. Token expires
4. User tries action → gets 401 error
5. App redirects to login
6. User logs in again
✓ Success (as designed)
```

## Troubleshooting Tests

### Issue: "Cannot connect to server"
```bash
# Check if backend is running
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Restart backend
cd backend && npm run dev
```

### Issue: "CORS error"
```javascript
// Check CORS is enabled in backend/index.js
// Should have: app.use(cors());

// Check frontend URL matches backend CORS config
```

### Issue: "Token not working"
```javascript
// Check token format
localStorage.getItem('token')  // Should be long string

// Check Authorization header format
// Should be: "Bearer <token>"  (with space)
```

### Issue: "Users not persisting"
```bash
# Check users.json exists
cat backend/users.json  # Should have user objects

# Check file permissions
ls -la backend/users.json  # Should be readable/writable
```

## Automated Testing (Optional)

### Frontend Tests with Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Backend Tests with Jest

```bash
npm install -D jest supertest
```

## Test Coverage Goals

- ✅ Registration: 100%
- ✅ Login: 100%
- ✅ Token Verification: 100%
- ✅ Protected Routes: 100%
- ✅ Error Handling: 100%
- ✅ Form Validation: 100%

## Final Verification Checklist

Before considering the authentication system complete:

- [ ] All manual tests passed
- [ ] No console errors
- [ ] No network errors
- [ ] Registration works
- [ ] Login works
- [ ] Protected routes work
- [ ] Logout works
- [ ] Session persistence works
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] UI is responsive on mobile
- [ ] Dark theme looks good
- [ ] localStorage updated correctly
- [ ] users.json updated with new users
- [ ] No sensitive data in logs
- [ ] Passwords hashed in users.json
- [ ] Token expires properly
- [ ] Can't access protected routes without login

## Performance Benchmarks

**Target Metrics:**

| Operation | Target | Acceptable |
|-----------|--------|------------|
| Registration | < 300ms | < 500ms |
| Login | < 200ms | < 400ms |
| Token Verify | < 50ms | < 100ms |
| Page Load | < 1s | < 2s |
| Route Change | < 200ms | < 500ms |

## Continuous Monitoring

After deployment, monitor:

- API response times
- Error rates
- Failed login attempts
- Password reset usage
- User retention

## Support Resources

- See `AUTH_SYSTEM.md` for detailed documentation
- See `DEVELOPMENT_GUIDE.md` for customization
- See `QUICK_START_AUTH.md` for quick reference
- Check `IMPLEMENTATION_SUMMARY.md` for what was implemented
