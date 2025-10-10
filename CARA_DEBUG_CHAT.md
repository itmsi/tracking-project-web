# 🔧 Cara Debug Chat yang Tidak Terkirim

## ❌ Masalah
Chat tidak terkirim setelah perubahan sistem notifikasi.

## 🎯 Quick Fix - Coba Dulu Ini!

### 1. Reload Aplikasi
```bash
# Stop aplikasi (Ctrl+C di terminal)
npm start
```

### 2. Cek Status di Console
Buka browser console, jalankan:
```javascript
checkChatStatus()
```

**Hasil yang diharapkan:**
```
✅ WebSocket instance ditemukan
✅ WebSocket TERKONEKSI
✅ send_message: 1 listener(s)
✅ new_message: 1 listener(s)
```

**Jika ada ❌ (tanda silang):**
- Logout dan login kembali
- Restart backend server
- Clear browser cache

### 3. Test Kirim Message Manual
```javascript
// Ganti TASK_ID dengan ID task yang aktif
testSendMessage('TASK_ID', 'Test dari console')
```

**Hasil yang diharapkan:**
- Console log: `✅ Message sent!`
- Dalam 1-2 detik: `📨 Response received: new_message`
- Message muncul di chat

**Jika tidak muncul:**
- Backend tidak menerima message
- Atau backend error saat process
- Lanjut ke Step 4

### 4. Debug Mode Lengkap
```javascript
debugChat()
```

Ini akan menampilkan semua event yang diterima. Coba kirim chat, lihat event apa yang muncul.

## 🔍 Analisis Masalah

### Kemungkinan 1: WebSocket Tidak Terkoneksi

**Gejala:**
- `checkChatStatus()` menunjukkan `Connected: false`
- Tidak ada event yang diterima

**Solusi:**
```javascript
// 1. Cek instance
window.__WEBSOCKET_INSTANCE__.connected // harus true

// 2. Jika false, logout dan login kembali
// 3. Atau restart aplikasi
```

### Kemungkinan 2: Event Listener Tidak Ada

**Gejala:**
- `checkChatStatus()` menunjukkan `❌ send_message: NO LISTENERS`
- Atau `❌ new_message: NO LISTENERS`

**Solusi:**
- Ini berarti hook `useWebSocketChat` tidak di-setup dengan benar
- Refresh page
- Pastikan komponen TaskChat/TaskChatWebSocket dimount

### Kemungkinan 3: Backend Tidak Menerima

**Gejala:**
- `testSendMessage()` tidak ada response setelah 5 detik
- Console warning: `⚠️ Tidak ada response`

**Solusi:**
- Cek backend logs
- Pastikan backend listen event `send_message`
- Pastikan user sudah join task room

### Kemungkinan 4: User Belum Join Task

**Gejala:**
- Message terkirim tapi tidak muncul di chat
- Atau backend error "User not in room"

**Solusi:**
```javascript
// Test join task
testJoinTask('TASK_ID')

// Cek rooms
checkTaskRoom()
```

## 📋 Checklist Debugging

Jalankan satu per satu:

```javascript
// 1. Cek status
checkChatStatus()
// Harus semua ✅

// 2. Cek task room
checkTaskRoom()
// Harus ada room dengan format "task_XXX"

// 3. Test join
testJoinTask('YOUR_TASK_ID')
// Backend harus log: User joined task

// 4. Test send
testSendMessage('YOUR_TASK_ID', 'Test')
// Harus ada response dalam 2 detik

// 5. Debug mode
debugChat()
// Monitor semua events
```

## 🐛 Kemungkinan Bug di Backend

Jika semua di frontend OK tapi chat tetap tidak terkirim, kemungkinan bug di backend:

### Backend Harus Handle Event Ini:

```javascript
// 1. Join task
socket.on('join_task', (taskId) => {
  socket.join(`task_${taskId}`);
  console.log(`User ${userId} joined task ${taskId}`);
});

// 2. Send message
socket.on('send_message', async (data) => {
  const { taskId, message, attachments } = data;
  
  // Save to database
  const savedMessage = await saveMessage(taskId, userId, message);
  
  // Broadcast ke task room
  io.to(`task_${taskId}`).emit('new_message', {
    message: savedMessage
  });
});
```

### Cek Backend Logs:

Harus ada log seperti ini:
```
📨 Received send_message from user XXX
💾 Saving message to database
📢 Broadcasting to task room: task_XXX
```

Jika tidak ada, berarti backend tidak menerima event.

## ⚠️ Penting!

**Perubahan notifikasi TIDAK SEHARUSNYA merusak chat** karena:

1. ✅ Event berbeda:
   - Notifikasi: `notification`
   - Chat: `send_message`, `new_message`

2. ✅ Hook berbeda:
   - Notifikasi: `useNotifications`
   - Chat: `useWebSocketChat`

3. ✅ Listener terpisah:
   - Tidak ada konflik antar event

**Jika chat rusak**, kemungkinan besar:
- WebSocket disconnect/reconnect saat perubahan
- Browser cache issue
- Backend restart tanpa handle graceful disconnect

## 🆘 Langkah Terakhir

Jika semua sudah dicoba tapi masih tidak bisa:

### 1. Rollback Perubahan (Sementara)
```bash
# Stash perubahan
git stash

# Test apakah chat berfungsi
# Jika ya, berarti ada konflik di perubahan
# Jika tidak, berarti masalah di backend/network
```

### 2. Hard Refresh
```
Ctrl + Shift + R (atau Cmd + Shift + R di Mac)
```

### 3. Clear All Cache
```javascript
// Di console
localStorage.clear()
sessionStorage.clear()
// Lalu reload
```

### 4. Test di Incognito
Buka aplikasi di incognito/private window untuk memastikan bukan masalah cache.

## 🧪 Commands Ringkasan

```javascript
// Quick check
checkChatStatus()

// Test send
testSendMessage('TASK_ID', 'Test message')

// Full debug
debugChat()

// Join task
testJoinTask('TASK_ID')

// Check rooms
checkTaskRoom()

// Listen all events (untuk notifikasi juga)
debugWebSocket()
```

## ✅ Solusi yang Paling Sering Berhasil

1. **Logout dan Login kembali** (90% kasus)
2. **Restart backend** (jika backend error)
3. **Hard refresh browser** (Ctrl+Shift+R)
4. **Clear localStorage** dan reload

---

**Cara pakai:**
1. Buka browser console
2. Jalankan `checkChatStatus()`
3. Ikuti instruksi berdasarkan hasil
4. Jika masih bingung, share screenshot console ke tim

**Timestamp:** 10 Oktober 2025

