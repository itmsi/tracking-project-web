# 🔔 Cara Fix Notifikasi Pesan Masuk

## 🎯 Masalah
Notifikasi pesan masuk tidak tampil ketika ada chat baru.

## ✅ Solusi yang Sudah Diterapkan

### 1. Hapus Duplikasi Listener
- **Masalah**: Ada 2 listener WebSocket untuk event `notification` yang sama
- **Solusi**: Hapus listener di Header, pakai NotificationContext saja

### 2. Refactor Header Component  
- Header sekarang menggunakan `useNotificationContext()` untuk mendapatkan data notifikasi
- Tidak perlu load data sendiri, semua dihandle oleh context

### 3. Tambah Logging untuk Debug
- Sekarang ada log detail di console untuk tracking notifikasi
- Bisa lihat kapan notifikasi diterima, badge count berubah, dll

### 4. Buat Testing Tools
- Bisa test notifikasi manual dari browser console
- Bisa debug WebSocket events

## 🧪 Cara Test

### Test 1: Cek WebSocket Terkoneksi
1. Jalankan aplikasi: `npm start`
2. Login
3. Buka browser console
4. Cari log: `✅ WebSocket connected successfully`

Jika tidak ada, berarti WebSocket tidak terkoneksi. Cek:
- Backend WebSocket server berjalan?
- URL WebSocket sudah benar?

### Test 2: Test Notifikasi Manual
Di browser console, jalankan:
```javascript
testNotification('chat_message')
```

**Hasil yang diharapkan:**
- ✅ Badge counter di header bertambah (dengan animasi merah)
- ✅ Toast muncul di kanan atas: "🔔 Anda punya 1 pesan baru!"
- ✅ Tab title berubah: "(1) Tracking Project Team - Ada Pesan Baru!"
- ✅ Console log: `🔔 useNotifications: New notification received...`

### Test 3: Test dengan Backend Real
1. Buka 2 browser dengan user berbeda (User A dan User B)
2. Pastikan kedua user adalah member dari task yang sama
3. User A kirim chat di task
4. Cek di browser User B:
   - Badge counter bertambah? ✅
   - Toast notification muncul? ✅
   - Console log ada? ✅

## 🐛 Troubleshooting

### Masalah: WebSocket Tidak Terkoneksi
**Cek:**
```javascript
// Di console
window.__WEBSOCKET_INSTANCE__.connected
```

**Jika `false`:**
- Restart backend server
- Cek URL di environment variables
- Cek CORS settings di backend

### Masalah: Notifikasi Tidak Muncul
**Cek dengan debug mode:**
```javascript
// Di console
debugWebSocket()
```

Kemudian kirim chat, lihat apakah ada event yang diterima.

**Jika tidak ada event:**
- Backend belum emit event `notification`
- Backend emit dengan nama event yang berbeda
- Backend tidak terhubung dengan user yang benar

### Masalah: Badge Tidak Update
**Cek console log:**
- Ada log `📈 useNotifications: Unread count incremented`?
- Jika tidak ada, berarti listener tidak menerima event

## 🔍 Tools Debugging

### 1. Test Notifikasi
```javascript
// Test notifikasi chat
testNotification('chat_message')

// Test notifikasi task
testNotification('task_assigned')

// Test notifikasi lain
testNotification('comment_added')
```

### 2. Debug WebSocket
```javascript
// Lihat info WebSocket dan listen semua events
debugWebSocket()
```

### 3. Custom Notifikasi
```javascript
// Buat notifikasi custom
simulateNotification({
  type: 'chat_message',
  title: 'Test Title',
  message: 'Test Message',
  data: {
    task_id: 'task-123'
  }
})
```

### 4. Cek WebSocket Status
```javascript
// Cek koneksi
window.__WEBSOCKET_INSTANCE__.connected

// Cek ID
window.__WEBSOCKET_INSTANCE__.id

// Listen semua events
window.__WEBSOCKET_INSTANCE__.onAny((event, ...args) => {
  console.log('📡', event, args)
})
```

## ⚠️ Requirements Backend

**Backend HARUS mengirim event ini ketika ada chat baru:**

```javascript
// Di backend, ketika user kirim chat
io.to(receiverUserId).emit('notification', {
  id: 'uuid-notification',
  user_id: receiverUserId,
  sender_id: senderUserId,
  type: 'chat_message',
  title: `Pesan baru dari ${senderName}`,
  message: messagePreview, // 50 karakter pertama
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

**Event name harus TEPAT: `notification`** (bukan `new_notification`, `chat_notification`, dll)

## 📋 Quick Checklist

Pastikan semua ini OK:

- [ ] Backend WebSocket server berjalan
- [ ] Frontend WebSocket terkoneksi (`✅ WebSocket connected` di console)
- [ ] Listener setup berhasil (`✅ Event listener attached` di console)
- [ ] Test manual berhasil (`testNotification('chat_message')`)
- [ ] Backend emit event `notification` dengan format yang benar
- [ ] Backend emit ke user yang tepat (receiver, bukan sender)

## 📚 Dokumentasi Lengkap

Untuk penjelasan lebih detail, lihat:
- `NOTIF_FIX_SUMMARY.md` - Summary lengkap perubahan
- `NOTIF_DEBUG_GUIDE.md` - Panduan debugging detail
- `CHAT_NOTIFICATION_IMPLEMENTATION.md` - Dokumentasi implementasi

## 💡 Tips

1. **Selalu buka console** untuk melihat log ketika testing
2. **Gunakan `debugWebSocket()`** untuk melihat semua event yang diterima
3. **Test manual dulu** dengan `testNotification()` sebelum test dengan backend real
4. **Cek format data** dari backend sesuai dengan interface `AppNotification`

## ✨ Fitur yang Sudah Jalan

Ketika ada notifikasi baru:
- ✅ Badge counter di header bertambah (dengan animasi pulse merah)
- ✅ Toast notification muncul di kanan atas
- ✅ Browser tab title berubah menampilkan jumlah notifikasi
- ✅ Notification list di dropdown ter-update real-time
- ✅ Browser notification muncul (jika user kasih permission)
- ✅ Notification sound (optional)

---

**Terakhir diupdate:** 10 Oktober 2025

**Butuh bantuan?** Cek console log atau jalankan `debugWebSocket()` untuk melihat apa yang terjadi.

