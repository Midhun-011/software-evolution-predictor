#!/bin/bash

# Software Evolution Predictor - Setup Script
# This script helps with initial setup of the authentication system

echo "🚀 Software Evolution Predictor - Setup Helper"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found in backend directory"
    exit 1
fi

echo "✅ Backend .env configured"
cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Terminal 1 - Start backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Terminal 2 - Start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open browser: http://localhost:5173"
echo "4. Register a new account or login with test credentials"
echo ""
echo "📚 Documentation:"
echo "   - AUTH_SYSTEM.md - Detailed authentication documentation"
echo "   - QUICK_START_AUTH.md - Quick start guide"
echo "   - README.md - Project overview"
echo ""
echo "✨ Happy coding!"
