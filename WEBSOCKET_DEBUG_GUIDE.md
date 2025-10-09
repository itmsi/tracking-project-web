# 🐛 WebSocket Debug Guide

## 🚨 **Error yang Anda Alami**

```
websocketService.js:67 WebSocket connection to 'ws://localhost:9553/socket.io/?EIO=4&transport=websocket' failed: WebSocket is closed before the connection is established.
useTaskView.ts:29 API not available, using mock data: Invalid task data received from server
useTaskView.ts:29 API not available, using mock data: Invalid task data received from server
websocketService.js:31 WebSocket connected: 5srSsVN7XCc_YpZ4AAAI
```

## 🔍 **Analisis Masalah**

### ✅ **Yang Sudah Diperbaiki:**
1. **Konfigurasi Port Inconsistent** - Sudah disesuaikan ke port 9553
2. **Error Handling** - Ditambahkan logging yang lebih informatif
3. **Reconnection Logic** - Diperbaiki dengan konfigurasi yang lebih robust

### ❌ **Masalah Utama:**
**Backend WebSocket Server tidak berjalan atau tidak diimplementasi**

## 🛠️ **Solusi Langkah demi Langkah**

### 1. **Check Backend Server Status**
```bash
# Test apakah backend API berjalan
curl -I http://localhost:9553

# Test apakah WebSocket endpoint tersedia
curl -I http://localhost:9553/socket.io/
```

### 2. **Start Backend Server**
Jika backend tidak berjalan, jalankan:
```bash
cd backend-directory
npm run dev
# atau
node server.js
```

### 3. **Implementasi WebSocket Server di Backend**
Backend perlu memiliki implementasi seperti ini:

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// WebSocket Server Setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:9554", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Authentication
  socket.on('authenticate', (token) => {
    // Validate JWT token here
    console.log('🔐 User authenticated:', socket.id);
  });

  // Join task room
  socket.on('join_task', (taskId) => {
    console.log('🔄 User joining task:', taskId);
    socket.join(`task_${taskId}`);
    socket.emit('joined_task', { taskId, success: true });
  });

  // Leave task room
  socket.on('leave_task', (taskId) => {
    console.log('🚪 User leaving task:', taskId);
    socket.leave(`task_${taskId}`);
    socket.emit('left_task', { taskId, success: true });
  });

  // Send message
  socket.on('send_message', (data) => {
    console.log('💬 New message:', data);
    // Save to database
    // Broadcast to task room
    io.to(`task_${data.taskId}`).emit('new_message', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = 9553;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});
```

### 4. **Install Socket.IO di Backend**
```bash
cd backend-directory
npm install socket.io
```

## 🧪 **Testing WebSocket Connection**

### 1. **Test Manual dengan Browser Console**
Buka browser console dan jalankan:
```javascript
// Test koneksi WebSocket
const socket = io('http://localhost:9553');
socket.on('connect', () => console.log('✅ Connected:', socket.id));
socket.on('disconnect', () => console.log('❌ Disconnected'));
socket.on('connect_error', (err) => console.error('🚨 Error:', err));
```

### 2. **Check Frontend Logs**
Setelah perbaikan, Anda akan melihat log seperti ini:
```
🔌 Connecting to WebSocket server: http://localhost:9553
✅ WebSocket connected successfully: [socket-id]
```

## 📋 **Checklist Backend Requirements**

### ✅ **Backend harus memiliki:**
- [ ] Express server berjalan di port 9553
- [ ] Socket.IO server diimplementasi
- [ ] CORS settings untuk frontend (localhost:9554)
- [ ] Event handlers untuk:
  - [ ] `join_task`
  - [ ] `leave_task`
  - [ ] `send_message`
  - [ ] `edit_message`
  - [ ] `delete_message`
  - [ ] `typing_start`
  - [ ] `typing_stop`

### ✅ **Response events yang harus di-emit:**
- [ ] `joined_task`
- [ ] `left_task`
- [ ] `new_message`
- [ ] `message_edited`
- [ ] `message_deleted`
- [ ] `user_typing`
- [ ] `user_stopped_typing`

## 🚀 **Status Setelah Perbaikan**

### ✅ **Frontend Ready:**
- Konfigurasi port sudah konsisten (9553)
- Error handling sudah diperbaiki
- Reconnection logic sudah robust
- Logging sudah informatif

### ⏳ **Backend Required:**
- WebSocket server perlu diimplementasi
- Event handlers perlu ditambahkan
- Database integration untuk messages

## 🔧 **Quick Fix untuk Development**

Jika Anda ingin test frontend tanpa backend, tambahkan di `useTaskView.ts`:

```typescript
// Temporary: Skip API calls in development
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_BACKEND_URL) {
  console.log('🔧 Development mode: Using mock data only');
  setTaskView(mockTaskViewData);
  setLoading(false);
  return;
}
```

## 📞 **Next Steps**

1. **Implementasi Backend WebSocket Server** (Priority 1)
2. **Test koneksi dengan browser console**
3. **Integrasi dengan database untuk chat messages**
4. **Test real-time chat functionality**

## 🎯 **Expected Result**

Setelah backend diimplementasi dengan benar, Anda akan melihat:
```
🔌 Connecting to WebSocket server: http://localhost:9553
✅ WebSocket connected successfully: [socket-id]
🔄 Attempting to join task: [task-id]
```

Dan tidak ada lagi error:
- ❌ `WebSocket connection failed`
- ❌ `API not available, using mock data`
