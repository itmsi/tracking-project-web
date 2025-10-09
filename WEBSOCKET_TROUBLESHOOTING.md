# 🔧 WebSocket Troubleshooting Guide

## 🚨 **Error yang Sering Terjadi**

### 1. **WebSocket Connection Failed**
```
WebSocket connection to 'ws://localhost:9553/socket.io/?EIO=4&transport=websocket' failed: WebSocket is closed before the connection is established.
```

**Penyebab:** Backend WebSocket server tidak berjalan
**Solusi:**
```bash
# Pastikan backend server berjalan di port 9553
cd backend-directory
npm run dev
# atau
node server.js
```

### 2. **Failed to Join Task**
```
WebSocket error: {message: 'Failed to join task'}
```

**Penyebab:** Backend tidak memiliki handler untuk `join_task` event
**Solusi Backend:**
```javascript
// Backend perlu implementasi handler ini
socket.on('join_task', (taskId) => {
  console.log('User joining task:', taskId);
  socket.join(`task_${taskId}`);
  socket.emit('joined_task', { taskId, success: true });
});
```

## 🔍 **Cara Debug WebSocket**

### 1. **Test Koneksi Manual**
Buka file `websocket-test.html` di browser untuk test koneksi:
```bash
# Buka file test di browser
open websocket-test.html
```

### 2. **Check Backend Status**
```bash
# Test API endpoint
curl -I http://localhost:9553

# Test WebSocket endpoint
curl -I http://localhost:9553/socket.io/
```

### 3. **Check Frontend Logs**
Buka browser console dan lihat log WebSocket:
- ✅ `WebSocket connected successfully` = Koneksi berhasil
- ❌ `WebSocket connection error` = Backend tidak berjalan
- ❌ `Failed to join task` = Backend tidak ada handler

## 🛠️ **Solusi Backend yang Diperlukan**

### 1. **WebSocket Server Setup**
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:9554",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Authentication
  socket.on('authenticate', (token) => {
    // Validate JWT token
    // Set user info
  });
  
  // Join task room
  socket.on('join_task', (taskId) => {
    socket.join(`task_${taskId}`);
    socket.emit('joined_task', { taskId, success: true });
  });
  
  // Leave task room
  socket.on('leave_task', (taskId) => {
    socket.leave(`task_${taskId}`);
    socket.emit('left_task', { taskId, success: true });
  });
  
  // Send message
  socket.on('send_message', (data) => {
    // Save message to database
    // Broadcast to task room
    io.to(`task_${data.taskId}`).emit('new_message', data);
  });
});
```

### 2. **Required Events**
Backend harus handle events ini:
- `join_task` - User join task room
- `leave_task` - User leave task room  
- `send_message` - Send chat message
- `edit_message` - Edit message
- `delete_message` - Delete message
- `typing_start` - User start typing
- `typing_stop` - User stop typing

### 3. **Response Events**
Backend harus emit events ini:
- `joined_task` - Confirm join success
- `left_task` - Confirm leave success
- `new_message` - New message received
- `message_edited` - Message edited
- `message_deleted` - Message deleted
- `user_typing` - User typing indicator
- `user_stopped_typing` - User stopped typing

## 🎯 **Status Saat Ini**

### ✅ **Frontend Ready**
- WebSocket service sudah diimplementasi
- Error handling sudah diperbaiki
- Reconnection logic sudah ada
- Proper logging sudah ditambahkan

### ❌ **Backend Required**
- WebSocket server perlu diimplementasi
- Event handlers perlu ditambahkan
- Authentication perlu diintegrasikan
- Database integration untuk messages

## 🚀 **Next Steps**

1. **Implementasi Backend WebSocket Server**
2. **Test koneksi dengan `websocket-test.html`**
3. **Integrasi dengan database untuk chat messages**
4. **Test real-time chat functionality**

## 📞 **Support**

Jika masih ada masalah:
1. Check browser console untuk error details
2. Check backend logs untuk WebSocket events
3. Test dengan `websocket-test.html`
4. Pastikan backend server berjalan di port 9553
