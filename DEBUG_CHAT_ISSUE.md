# 🔧 Debug Chat Tidak Terkirim

## ❌ Masalah
Chat tidak terkirim setelah perubahan pada sistem notifikasi.

## 🔍 Kemungkinan Penyebab

### 1. WebSocket Tidak Terkoneksi
Chat menggunakan WebSocket yang sama dengan notifikasi. Jika WebSocket tidak terkoneksi, chat tidak akan terkirim.

### 2. Event Listener Conflict
Mungkin ada konflik dengan event listener yang baru ditambahkan.

### 3. Backend Tidak Menerima Event
Backend mungkin tidak menerima event `send_message` dari frontend.

## ✅ Langkah-langkah Pengecekan

### Step 1: Cek WebSocket Connection

Buka browser console dan cek:

```javascript
// Cek apakah WebSocket terkoneksi
window.__WEBSOCKET_INSTANCE__.connected

// Output harus: true
```

**Jika `false`:**
- Restart backend WebSocket server
- Logout dan login kembali
- Clear browser cache

### Step 2: Cek Event Listener

```javascript
// Lihat semua event yang di-listen
window.__WEBSOCKET_INSTANCE__._callbacks

// Cari event 'send_message'
// Harus ada listener untuk:
// - send_message
// - new_message
// - message_edited
// - message_deleted
```

### Step 3: Debug WebSocket Events

```javascript
// Listen semua events untuk debugging
debugWebSocket()

// Kemudian coba kirim chat
// Lihat di console event apa yang dikirim/diterima
```

### Step 4: Test Manual Send Message

Di browser console, jalankan:

```javascript
// Get WebSocket instance
const socket = window.__WEBSOCKET_INSTANCE__;

// Test kirim message manual
socket.emit('send_message', {
  taskId: 'YOUR_TASK_ID', // Ganti dengan task ID yang aktif
  message: 'Test message dari console',
  attachments: [],
  replyTo: null
});

// Cek di console apakah ada response
```

**Expected Response:**
- Event `new_message` diterima
- Message muncul di chat

### Step 5: Cek Console Errors

Buka browser console, cari error seperti:
- `Failed to send message`
- `WebSocket error`
- `Cannot emit event`

## 🛠️ Solusi

### Solusi 1: Restart WebSocket Connection

Di browser console:

```javascript
// Disconnect
window.__WEBSOCKET_INSTANCE__.disconnect()

// Logout dan login kembali
// WebSocket akan reconnect otomatis
```

### Solusi 2: Clear Event Listeners

Mungkin ada event listener yang duplikat atau conflict. Restart aplikasi:

```bash
# Stop app (Ctrl+C)
# Clear cache
rm -rf node_modules/.cache

# Restart
npm start
```

### Solusi 3: Cek Backend

Pastikan backend menerima event `send_message`:

```javascript
// Di backend, harus ada listener:
socket.on('send_message', async (data) => {
  const { taskId, message, attachments, replyTo } = data;
  
  console.log('📨 Received send_message:', data);
  
  // Process message
  // Save to database
  // Broadcast to other users
  
  socket.to(`task_${taskId}`).emit('new_message', {
    message: savedMessage
  });
});
```

### Solusi 4: Rollback Perubahan (Jika Perlu)

Jika masalah terjadi setelah perubahan notifikasi, kita bisa rollback:

```bash
git stash
# atau
git checkout HEAD -- src/hooks/useNotifications.ts
git checkout HEAD -- src/components/layout/Header.tsx
```

## 🧪 Test Chat Functionality

### Test 1: Cek WebSocket Connection
```javascript
// Harus true
window.__WEBSOCKET_INSTANCE__.connected
```

### Test 2: Cek Join Task
```javascript
// Get socket
const socket = window.__WEBSOCKET_INSTANCE__;

// Cek apakah sudah join task
// Backend harus log: User joined task_XXX
```

### Test 3: Send Test Message
```javascript
// Kirim test message
socket.emit('send_message', {
  taskId: 'YOUR_TASK_ID',
  message: 'Test message',
  attachments: []
});

// Tunggu 1-2 detik
// Harus ada log: new_message received
```

### Test 4: Cek dengan 2 User
1. Buka 2 browser/tab dengan user berbeda
2. Masuk ke task yang sama
3. User A kirim chat
4. User B harus menerima chat real-time

## 📋 Checklist Debugging

- [ ] WebSocket terkoneksi (`socket.connected === true`)
- [ ] Sudah join task (`join_task` event dikirim)
- [ ] Listener `new_message` ada
- [ ] Listener `send_message` ada di backend
- [ ] Tidak ada error di console
- [ ] Backend log menerima `send_message`
- [ ] Backend log broadcast `new_message`

## 🔍 Log yang Harus Muncul

### Di Frontend Console (saat kirim chat):

```
💬 Sending message via WebSocket
📤 Event: send_message
📦 Data: { taskId: "...", message: "...", ... }
```

### Di Backend Console (saat terima chat):

```
📨 Received send_message
📝 Message from user: XXX
💾 Saving message to database
📢 Broadcasting to task room: task_XXX
```

### Di Frontend Console (saat terima chat):

```
📡 WebSocket Event: new_message
💬 Message received: { id: "...", message: "...", ... }
📝 useNotifications: Updated notification list
```

## ⚠️ Important Notes

Perubahan pada sistem notifikasi **TIDAK SEHARUSNYA** mempengaruhi chat karena:

1. **Listener Terpisah**: 
   - Notifikasi: event `notification`
   - Chat: event `send_message`, `new_message`, dll

2. **Hook Terpisah**:
   - Notifikasi: `useNotifications`
   - Chat: `useWebSocketChat`

3. **WebSocket Instance Sama**:
   - Keduanya menggunakan WebSocket yang sama dari `WebSocketContext`
   - Seharusnya tidak ada konflik

Jika chat rusak, kemungkinan besar:
- WebSocket tidak terkoneksi
- Backend tidak berjalan dengan benar
- Ada error di backend saat handle `send_message`

## 🆘 Cara Cepat Cek Masalah

Jalankan script ini di browser console:

```javascript
// Quick debug script
const quickDebug = () => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  console.log('=== QUICK DEBUG ===');
  console.log('1. WebSocket Connected:', socket?.connected);
  console.log('2. Socket ID:', socket?.id);
  
  if (!socket) {
    console.error('❌ WebSocket instance tidak ditemukan!');
    return;
  }
  
  if (!socket.connected) {
    console.error('❌ WebSocket tidak terkoneksi!');
    console.log('💡 Coba logout dan login kembali');
    return;
  }
  
  console.log('3. Registered Events:');
  const events = socket._callbacks || {};
  Object.keys(events).forEach(event => {
    const cleanEvent = event.replace('$', '');
    console.log(`   - ${cleanEvent}:`, events[event].length, 'listeners');
  });
  
  console.log('\n4. Testing send_message...');
  console.log('💡 Untuk test, jalankan:');
  console.log('   socket.emit("send_message", { taskId: "YOUR_TASK_ID", message: "Test", attachments: [] })');
  
  console.log('\n✅ Debug info selesai!');
};

quickDebug();
```

## 📞 Butuh Bantuan?

Jika masih tidak bisa, share:
1. Screenshot console log
2. Error messages (jika ada)
3. Backend logs (jika ada akses)

---

**Created:** October 10, 2025  
**Purpose:** Debug chat tidak terkirim setelah perubahan notifikasi

