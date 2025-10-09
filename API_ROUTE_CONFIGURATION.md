# 🔧 API Route Configuration Fix

## 🚨 **Masalah yang Ditemukan:**

Error dari backend:
```
Route : /notifications/unread-count Tidak di temukan.
```

**Root Cause**: Frontend menggunakan route yang salah karena konfigurasi port tidak konsisten.

## ✅ **Konfigurasi yang Sudah Diperbaiki:**

### **1. Port Configuration**
- **Backend API**: `http://localhost:9553/api` ✅
- **WebSocket**: `http://localhost:9553` ✅
- **Frontend**: `http://localhost:9554` ✅

### **2. API Routes yang Benar**

#### **Notifications API:**
```
GET /api/notifications/unread-count
GET /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
DELETE /api/notifications/:id
GET /api/notifications/stats
```

#### **Task View API:**
```
GET /api/tasks/:id/view
GET /api/tasks/:id/comments
GET /api/tasks/:id/attachments
GET /api/tasks/:id/members
```

#### **Authentication API:**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
POST /api/auth/logout
```

### **3. Frontend Configuration Fixed**

#### **File: `src/services/api.ts`**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9553/api';
```

#### **File: `.env.local`**
```bash
REACT_APP_API_URL=http://localhost:9553/api
REACT_APP_WS_URL=http://localhost:9553
REACT_APP_WEBSOCKET_URL=http://localhost:9553
```

### **4. Error Messages Updated**
- Login: "Backend API tidak tersedia. Pastikan backend berjalan di port 9553"
- Register: "Backend API tidak tersedia. Pastikan backend berjalan di port 9553"
- API Service: "Backend API tidak tersedia. Pastikan backend berjalan di port 9553"

## 🔧 **Backend Requirements Update:**

### **Express Server Setup:**
```javascript
const express = require('express');
const app = express();

// API Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// WebSocket Server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:9554",
    methods: ["GET", "POST"]
  }
});

const PORT = 9553;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket available at http://localhost:${PORT}`);
});
```

### **Required Routes:**
```javascript
// notifications.js
router.get('/unread-count', authenticateToken, getUnreadCount);
router.get('/', authenticateToken, getNotifications);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

// tasks.js
router.get('/:id/view', authenticateToken, getTaskView);
router.get('/:id/comments', authenticateToken, getTaskComments);
router.get('/:id/attachments', authenticateToken, getTaskAttachments);
router.get('/:id/members', authenticateToken, getTaskMembers);

// auth.js
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);
```

## 🎯 **Expected Result:**

Setelah backend diimplementasi dengan routes yang benar:

### **✅ Success Indicators:**
```
GET http://localhost:9553/api/notifications/unread-count
Response: { success: true, data: { count: 5 } }

GET http://localhost:9553/api/tasks/1/view
Response: { success: true, data: { task: {...}, comments: [...], ... } }

WebSocket: ws://localhost:9553/socket.io/
Connection: ✅ Connected successfully
```

### **❌ Error Indicators (Fixed):**
```
❌ Route : /notifications/unread-count Tidak di temukan
❌ Backend API tidak tersedia. Pastikan backend berjalan di port 9552
❌ WebSocket connection to 'ws://localhost:9553/socket.io/' failed
```

## 🚀 **Testing Commands:**

```bash
# Test API endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:9553/api/notifications/unread-count

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:9553/api/tasks/1/view

# Test WebSocket
curl -I http://localhost:9553/socket.io/

# Test CORS
curl -H "Origin: http://localhost:9554" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -X OPTIONS \
  http://localhost:9553/api/notifications/unread-count
```

## 📋 **Checklist Backend Implementation:**

- [ ] Express server berjalan di port 9553
- [ ] API routes menggunakan prefix `/api/`
- [ ] WebSocket server berjalan di port 9553
- [ ] CORS allow origin `http://localhost:9554`
- [ ] JWT authentication middleware
- [ ] Database connection established
- [ ] All required endpoints implemented
- [ ] Error handling dengan response format yang benar

## 🎉 **Summary:**

**Problem**: Route `/notifications/unread-count` tidak ditemukan
**Solution**: Backend harus menggunakan route `/api/notifications/unread-count`
**Status**: ✅ Frontend configuration sudah diperbaiki, backend perlu diimplementasi sesuai requirement
