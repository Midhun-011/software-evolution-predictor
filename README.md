# Software Evolution Predictor

Full-stack sample application: React + Vite frontend and Node.js + Express backend that predicts software evolution health and risk.

## Features

- 🔐 **JWT Authentication System** - Secure user registration and login
- 📊 **Repository Analysis** - Analyze software metrics
- 🎯 **Evolution Prediction** - Predict software health and risk
- 🛡️ **Protected Routes** - Secure pages for authenticated users
- 💅 **Modern UI** - Beautiful gradient-based interface
- ⚡ **Real-time** - Instant feedback and validation

## Quick Start

### Prerequisites
- Node.js v14+
- npm

### Installation

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Authentication

The application includes a complete JWT-based authentication system:

- **Registration** - Create new user accounts
- **Login** - Secure user login with JWT tokens
- **Protected Routes** - Authenticated users only
- **Logout** - Secure session termination
- **Password Hashing** - bcryptjs for security

### Demo Credentials

Email: `demo@example.com`
Password: `demo123`

*Note: Create these by registering first, or use any new account*

### Auth Pages

- `/login` - User login
- `/register` - New user registration
- `/dashboard` - User dashboard (protected)

For detailed authentication documentation, see [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)

For quick start guide, see [QUICK_START_AUTH.md](./QUICK_START_AUTH.md)

## Project Structure

```
backend/
├── middleware/
│   └── auth.js              # JWT verification
├── routes/
│   └── auth.js              # Authentication endpoints
├── utils/
│   └── userStorage.js       # User management
├── index.js                 # Express server
├── predictor.js             # Prediction logic
└── package.json

frontend/
├── src/
│   ├── api/
│   │   └── auth.js          # Auth API calls
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── HealthCard.jsx
│   │   └── RiskChart.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Overview.jsx
│   │   └── RepositoryAnalysis.jsx
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── styles.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Data (Public)
- `GET /api/repositories` - Get all repositories
- `GET /api/analysis/summary` - Get analysis summary
- `POST /api/predict` - Predict evolution metrics

### Protected
- `GET /api/user/dashboard` - User dashboard (requires auth)

## Technologies Used

**Backend:**
- Express.js - REST API framework
- JWT (jsonwebtoken) - Token authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests
- dotenv - Environment variables

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- React Router - Client routing
- Axios - HTTP client
- Chart.js - Data visualization
- CSS3 - Styling

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token included in subsequent API requests
5. Backend middleware verifies token for protected routes
6. User can logout to clear token and session

## Security Features

✅ Password hashing with bcryptjs
✅ JWT token-based authentication
✅ Protected routes (frontend & backend)
✅ CORS protection
✅ Environment variables for secrets
✅ Token expiration (7 days default)
✅ Input validation

## Development

### Environment Variables

**Backend (.env):**
```
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
PORT=4000
```

Copy the example file and set values before running the backend:

```
cp backend/.env.example backend/.env
# then edit backend/.env and set a strong JWT_SECRET
```

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deployment

See documentation for deployment instructions for production environments.

## License

MIT

## Support

For issues or documentation, see:
- [AUTH_SYSTEM.md](./AUTH_SYSTEM.md) - Detailed auth system documentation
- [QUICK_START_AUTH.md](./QUICK_START_AUTH.md) - Quick start guide
