@echo off
REM Software Evolution Predictor - Setup Script for Windows
REM This script helps with initial setup of the authentication system

echo.
echo 🚀 Software Evolution Predictor - Setup Helper
echo =============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Backend setup
echo 📦 Setting up backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found in backend directory
    exit /b 1
)

echo ✅ Backend .env configured
cd ..

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Terminal 1 - Start backend:
echo    cd backend ^&^& npm run dev
echo.
echo 2. Terminal 2 - Start frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open browser: http://localhost:5173
echo 4. Register a new account or login with test credentials
echo.
echo 📚 Documentation:
echo    - AUTH_SYSTEM.md - Detailed authentication documentation
echo    - QUICK_START_AUTH.md - Quick start guide
echo    - README.md - Project overview
echo.
echo ✨ Happy coding!
pause
