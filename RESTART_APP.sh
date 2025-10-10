#!/bin/bash

echo "🔄 Restarting application with cleared cache..."

# Kill process on port 9554
echo "1️⃣ Killing process on port 9554..."
lsof -ti:9554 | xargs kill -9 2>/dev/null || echo "   No process running on port 9554"

# Clear all caches
echo "2️⃣ Clearing caches..."
rm -rf node_modules/.cache/babel-loader 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -rf build/ 2>/dev/null
echo "   ✅ Cache cleared"

# Start development server
echo "3️⃣ Starting development server..."
echo "   Please wait for compilation..."
echo ""
echo "⚠️  IMPORTANT:"
echo "   After server starts, do HARD REFRESH in browser:"
echo "   - Windows/Linux: Ctrl + Shift + R"
echo "   - Mac: Cmd + Shift + R"
echo ""
echo "🚀 Starting server on port 9554..."
echo ""

PORT=9554 npm start

