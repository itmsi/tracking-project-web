#!/bin/bash

echo "🔄 Restarting development server with correct environment variables..."

# Stop any running processes
pkill -f "react-scripts start" || true
pkill -f "npm start" || true

# Wait a moment
sleep 2

# Clear cache
echo "🧹 Clearing cache..."
rm -rf node_modules/.cache
rm -rf build

# Set environment variables explicitly
export REACT_APP_API_URL=http://localhost:9553
export REACT_APP_WS_URL=http://localhost:9553
export REACT_APP_WEBSOCKET_URL=http://localhost:9553
export REACT_APP_FRONTEND_URL=http://localhost:9554
export REACT_APP_FRONTEND_PORT=9554
export REACT_APP_ENV=development

echo "🔧 Environment variables set:"
echo "   REACT_APP_WS_URL: $REACT_APP_WS_URL"
echo "   REACT_APP_API_URL: $REACT_APP_API_URL"

# Start development server
echo "🚀 Starting development server..."
npm start
