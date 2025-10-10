# 🔍 Panduan Debug Notifikasi Pesan Masuk

## ❌ Masalah
Notifikasi pesan masuk tidak tampil ketika ada chat baru di task.

## 🔧 Kemungkinan Penyebab

### 1. **Duplikasi Listener WebSocket**
Ada dua tempat yang listen ke event `notification`:
- `src/hooks/useNotifications.ts` (line 165)
- `src/components/layout/Header.tsx` (line 175)

**Kemungkinan konflik**: Dua listener bisa saling mengganggu atau salah satunya tidak dijalankan dengan benar.

### 2. **Backend Tidak Mengirim Event**
Backend mungkin tidak mengirim event `notification` via WebSocket ketika ada chat baru.

### 3. **WebSocket Tidak Terkoneksi**
WebSocket mungkin tidak terkoneksi dengan benar ke backend.

### 4. **Event Name Tidak Sesuai**
Backend mungkin mengirim event dengan nama yang berbeda (misalnya `new_notification` bukan `notification`).

## ✅ Langkah-langkah Debug

### Step 1: Cek Koneksi WebSocket
Buka browser console dan cari log:
```
✅ WebSocket connected successfully: <socket-id>
🔌 WebSocketContext: Connected
```

Jika tidak ada, berarti WebSocket tidak terkoneksi. Cek:
- Backend WebSocket server berjalan di port yang benar
- REACT_APP_WS_URL di environment variables sudah benar
- Token authentication valid

### Step 2: Test dengan Console Logging
Buka browser console dan jalankan perintah berikut untuk listen semua event WebSocket:

```javascript
// Get socket instance dari window (untuk debugging)
const socket = window.__WEBSOCKET_INSTANCE__;

// Listen semua events
socket.onAny((eventName, ...args) => {
  console.log('📡 WebSocket Event:', eventName, args);
});
```

### Step 3: Simulasi Notifikasi Manual
Dari backend atau testing tool, kirim event `notification` secara manual:

**Format Event yang Diharapkan:**
```json
{
  "id": "uuid",
  "user_id": "uuid-receiver",
  "sender_id": "uuid-sender",
  "type": "chat_message",
  "title": "Pesan baru dari John Doe",
  "message": "Halo, bagaimana progress task ini?",
  "data": {
    "task_id": "uuid-task",
    "task_title": "Implementasi Chat Feature",
    "message_id": "uuid-message",
    "sender_name": "John Doe",
    "full_message": "Halo, bagaimana progress task ini?"
  },
  "is_read": false,
  "created_at": "2025-01-09T10:00:00Z"
}
```

### Step 4: Cek Browser Console Logs
Ketika ada chat baru, harus muncul log berikut:

**Dari useNotifications:**
```
🔔 New notification received via WebSocket: {...}
```

**Dari Header:**
```
🔔 Header: New notification received via WebSocket: {...}
📈 Header: Unread count incremented: 0 → 1
```

**Jika tidak ada log ini**, berarti:
- Event tidak dikirim dari backend
- Event name tidak sesuai
- Listener belum di-setup dengan benar

### Step 5: Cek Notification API Endpoint
Test endpoint notification di browser atau Postman:

```bash
GET http://localhost:9553/api/notifications
GET http://localhost:9553/api/notifications/unread-count
```

Jika return 404, berarti backend belum implement notification API.

## 🐛 Debugging Code

### Tambahkan Log di useNotifications.ts

Tambahkan log sebelum setup WebSocket listener (sekitar line 103):

```typescript
useEffect(() => {
  console.log('🔔 useNotifications: WebSocket state:', {
    socket: !!socket,
    isConnected,
    hasSetupWebSocket: hasSetupWebSocket.current
  });

  if (!socket || !isConnected || hasSetupWebSocket.current) {
    return;
  }

  console.log('🔔 useNotifications: Setting up WebSocket listener');
  console.log('🔔 Socket events before setup:', socket.listeners('notification'));
  
  // ... rest of code
}, [socket, isConnected]);
```

### Tambahkan Global WebSocket Instance (untuk debugging)

Di `src/services/websocketService.js`, tambahkan:

```javascript
connect(token) {
  // ... existing code ...
  
  this.socket = io(wsUrl, { /* ... options ... */ });
  
  // Expose untuk debugging (HANYA untuk development)
  if (process.env.NODE_ENV === 'development') {
    window.__WEBSOCKET_INSTANCE__ = this.socket;
    console.log('🔧 WebSocket instance exposed to window.__WEBSOCKET_INSTANCE__');
  }
  
  this.setupEventHandlers();
  return this.socket;
}
```

## 🔥 Kemungkinan Solusi

### Solusi 1: Hapus Duplikasi Listener
**Masalah**: Ada dua listener untuk event yang sama.
**Solusi**: Hapus listener di `Header.tsx` dan biarkan hanya di `useNotifications`.

Di `Header.tsx`, hapus WebSocket listener (line 151-184) karena sudah dihandle oleh `useNotifications` hook yang sudah dipanggil melalui `NotificationProvider`.

### Solusi 2: Backend Belum Kirim Event
**Masalah**: Backend tidak mengirim event `notification` ketika ada chat baru.
**Solusi**: Backend perlu implement:

```javascript
// Di backend, ketika ada chat baru
socket.to(`task_${taskId}`).emit('notification', {
  id: notificationId,
  user_id: receiverId,
  sender_id: senderId,
  type: 'chat_message',
  title: `Pesan baru dari ${senderName}`,
  message: messagePreview,
  data: {
    task_id: taskId,
    task_title: taskTitle,
    message_id: messageId,
    sender_name: senderName,
    full_message: messageContent
  },
  is_read: false,
  created_at: new Date().toISOString()
});
```

### Solusi 3: Event Name Berbeda
**Masalah**: Backend mengirim dengan nama event berbeda.
**Solusi**: Cek nama event yang dikirim backend, lalu ubah listener di frontend.

## 📝 Checklist Pengecekan

- [ ] WebSocket terkoneksi (cek di console)
- [ ] Backend WebSocket server berjalan
- [ ] Backend mengirim event `notification` (cek dengan socket.onAny)
- [ ] Listener di frontend sudah di-setup (cek log)
- [ ] Badge counter di header beranimasi ketika ada notifikasi
- [ ] Toast notification muncul
- [ ] Browser notification muncul (jika diizinkan)
- [ ] Notification list di dropdown ter-update

## 🧪 Testing Manual

1. **Setup 2 User:**
   - User A: Pengirim chat
   - User B: Penerima notifikasi

2. **Login di 2 Browser/Tab:**
   - Tab 1: Login sebagai User A
   - Tab 2: Login sebagai User B

3. **Buka Task yang Sama:**
   - Pastikan User A dan User B adalah member dari task yang sama

4. **User A Kirim Chat:**
   - User A kirim chat di task

5. **Cek di User B:**
   - [ ] Badge counter bertambah
   - [ ] Toast notification muncul
   - [ ] Console log menunjukkan notifikasi diterima
   - [ ] Notification list ter-update

## 🎯 Expected Behavior

Ketika User A mengirim chat di task:
1. Backend create notifikasi untuk User B
2. Backend save notifikasi ke database
3. Backend emit event `notification` ke User B via WebSocket
4. Frontend (User B) receive event di `useNotifications` hook
5. `useNotifications` increment `unreadCount`
6. Header component detect perubahan `unreadCount`
7. Badge counter di header bertambah dengan animasi pulse
8. Toast notification muncul: "🔔 Anda punya 1 pesan baru!"
9. Browser tab title berubah: "(1) Tracking Project Team - Ada Pesan Baru!"
10. Browser notification muncul (jika permission granted)
11. Notification list di dropdown ter-update

## 🆘 Jika Masih Tidak Berfungsi

1. **Restart backend server**
2. **Clear browser cache & localStorage**
3. **Re-login**
4. **Cek browser console untuk error**
5. **Cek network tab untuk WebSocket connection**
6. **Test dengan browser lain**

## 📞 Backend Requirements

Backend HARUS implement:
1. WebSocket event `notification` ketika ada chat baru
2. HTTP Endpoints:
   - `GET /api/notifications`
   - `GET /api/notifications/unread-count`
   - `PATCH /api/notifications/:id/read`
   - `PATCH /api/notifications/read-all`
   - `DELETE /api/notifications/:id`

---
**Created:** October 10, 2025
**Author:** AI Assistant

