# 🔧 Backend API Requirements

Berdasarkan analisis error frontend, berikut adalah requirement yang perlu diimplementasi di backend:

## 🚨 **Masalah yang Ditemukan:**

1. **WebSocket Server tidak berjalan** - Error: `WebSocket connection to 'ws://localhost:9553/socket.io/?EIO=4&transport=websocket' failed`
2. **API Notifications tidak tersedia** - Error: `Cannot read properties of undefined (reading 'count')`
3. **Task View API tidak merespons** - Fallback ke mock data

## 🔧 **1. WebSocket Server Implementation**

### **Port Configuration:**
- **Backend API**: `http://localhost:9553/api`
- **WebSocket**: `http://localhost:9553` (Socket.IO endpoint)
- **CORS**: Allow `http://localhost:9554` (frontend)

### **⚠️ IMPORTANT: Route Configuration**
Frontend menggunakan route berikut:
- **Notifications**: `/api/notifications/unread-count`
- **Task View**: `/api/tasks/:id/view`
- **Auth**: `/api/auth/login`, `/api/auth/register`

### **Socket.IO Server Setup:**
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// WebSocket Server Configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:9554", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Authentication middleware
  socket.on('authenticate', (token) => {
    try {
      // Validate JWT token here
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.user = decoded;
      console.log('🔐 User authenticated:', socket.userId);
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      socket.emit('auth_error', { message: 'Invalid token' });
      socket.disconnect();
    }
  });

  // Join task room
  socket.on('join_task', (taskId) => {
    console.log('🔄 User joining task:', taskId);
    socket.join(`task_${taskId}`);
    socket.emit('joined_task', { taskId, success: true });
    
    // Notify others in the room
    socket.to(`task_${taskId}`).emit('user_joined', {
      userId: socket.userId,
      taskId: taskId
    });
  });

  // Leave task room
  socket.on('leave_task', (taskId) => {
    console.log('🚪 User leaving task:', taskId);
    socket.leave(`task_${taskId}`);
    socket.emit('left_task', { taskId, success: true });
    
    // Notify others in the room
    socket.to(`task_${taskId}`).emit('user_left', {
      userId: socket.userId,
      taskId: taskId
    });
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      console.log('💬 New message:', data);
      
      // Save message to database
      const message = await saveMessageToDatabase({
        taskId: data.taskId,
        userId: socket.userId,
        message: data.message,
        attachments: data.attachments || [],
        replyTo: data.replyTo || null
      });

      // Broadcast to task room
      io.to(`task_${data.taskId}`).emit('new_message', {
        ...message,
        user: socket.user
      });
    } catch (error) {
      console.error('❌ Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Edit message
  socket.on('edit_message', async (data) => {
    try {
      const updatedMessage = await updateMessageInDatabase({
        messageId: data.messageId,
        taskId: data.taskId,
        userId: socket.userId,
        newMessage: data.newMessage
      });

      io.to(`task_${data.taskId}`).emit('message_edited', updatedMessage);
    } catch (error) {
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });

  // Delete message
  socket.on('delete_message', async (data) => {
    try {
      await deleteMessageFromDatabase({
        messageId: data.messageId,
        taskId: data.taskId,
        userId: socket.userId
      });

      io.to(`task_${data.taskId}`).emit('message_deleted', {
        messageId: data.messageId,
        taskId: data.taskId
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Typing indicators
  socket.on('typing_start', (data) => {
    socket.to(`task_${data.taskId}`).emit('user_typing', {
      userId: socket.userId,
      taskId: data.taskId,
      user: socket.user
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`task_${data.taskId}`).emit('user_stopped_typing', {
      userId: socket.userId,
      taskId: data.taskId
    });
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
  console.log(`🔌 WebSocket server ready at http://localhost:${PORT}`);
});
```

## 🔧 **2. Notifications API Endpoints**

### **Required Endpoints:**

```javascript
// GET /api/notifications/unread-count
app.get('/api/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await getUnreadNotificationCount(req.user.id);
    res.json({
      success: true,
      data: {
        count: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

// GET /api/notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
});
```

## 🔧 **3. Task View API Endpoints**

### **Required Endpoints:**

```javascript
// GET /api/tasks/:id/view
app.get('/api/tasks/:id/view', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskView = await getTaskViewData(taskId, req.user.id);
    
    res.json({
      success: true,
      data: {
        task: taskView.task,
        comments: taskView.comments,
        attachments: taskView.attachments,
        members: taskView.members,
        permissions: taskView.permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get task view'
    });
  }
});
```

## 🔧 **4. Database Schema Requirements**

### **Messages Table:**
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  reply_to INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Notifications Table:**
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 **5. Environment Variables (Backend)**

```bash
# Server Configuration
PORT=9553
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/project_tracker

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:9554

# WebSocket
WS_PORT=9553
```

## 🔧 **6. Package Dependencies (Backend)**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.0",
    "dotenv": "^16.3.1"
  }
}
```

## 🔧 **7. CORS Configuration**

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:9554',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🚀 **8. Quick Start Commands**

```bash
# Install dependencies
npm install express socket.io cors jsonwebtoken pg dotenv

# Start development server
npm run dev

# Test WebSocket connection
curl -I http://localhost:9553/socket.io/

# Test API endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:9553/api/notifications/unread-count
```

## ✅ **9. Testing Checklist**

- [ ] WebSocket server berjalan di port 9553
- [ ] CORS settings allow frontend (localhost:9554)
- [ ] Socket.IO endpoint accessible
- [ ] Authentication middleware working
- [ ] Database connection established
- [ ] Notifications API responding
- [ ] Task View API responding
- [ ] Real-time chat working

## 📞 **10. Expected Frontend Behavior After Backend Setup**

Setelah backend diimplementasi, frontend akan menunjukkan:
- ✅ `WebSocket connected successfully`
- ✅ `API notifications working`
- ✅ `Task view data loaded`
- ✅ Real-time chat functionality
- ✅ No more mock data fallbacks
