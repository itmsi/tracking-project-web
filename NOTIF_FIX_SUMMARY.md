# 🔧 Fix Notifikasi Pesan Masuk - Summary

## ❌ Masalah Awal
Notifikasi pesan masuk tidak tampil ketika ada chat baru di task.

## ✅ Solusi yang Diterapkan

### 1. **Menghapus Duplikasi Listener WebSocket**

**Masalah**: Ada 2 listener untuk event `notification` yang sama:
- Di `src/hooks/useNotifications.ts`
- Di `src/components/layout/Header.tsx`

**Solusi**: 
- ✅ Hapus listener WebSocket di `Header.tsx`
- ✅ Gunakan `NotificationContext` di `Header.tsx` untuk mendapatkan data notifikasi
- ✅ Listener WebSocket sekarang hanya ada di satu tempat: `useNotifications` hook

**File yang dimodifikasi:**
- `src/components/layout/Header.tsx`
  - Hapus import `useWebSocket`
  - Hapus state management untuk notifications dan unreadCount
  - Gunakan `useNotificationContext()` untuk mendapatkan data
  - Gunakan method dari context: `markAsRead`, `markAllAsRead`, `deleteNotification`, `refetch`

### 2. **Menambahkan Logging untuk Debugging**

**File yang dimodifikasi:**
- `src/hooks/useNotifications.ts`
  - Tambah detailed logging ketika setup WebSocket listener
  - Tambah logging ketika menerima notifikasi baru
  - Tambah logging untuk state changes (unread count, notification list)

- `src/services/websocketService.js`
  - Expose WebSocket instance ke `window.__WEBSOCKET_INSTANCE__` (development mode)
  - Tambah hint untuk debugging di console

### 3. **Membuat Testing Utilities**

**File baru:**
- `src/utils/testNotification.ts`
  - Fungsi untuk simulasi notifikasi dari browser console
  - Fungsi untuk debug WebSocket events
  - Template notifikasi untuk berbagai tipe

**Exposed functions ke window (development mode):**
```javascript
// Test notifikasi chat
testNotification('chat_message')

// Test notifikasi task
testNotification('task_assigned')

// Debug WebSocket - lihat semua events
debugWebSocket()

// Custom notification
simulateNotification({
  type: 'chat_message',
  title: 'Custom Title',
  message: 'Custom Message'
})
```

### 4. **Membuat Panduan Debug**

**File baru:**
- `NOTIF_DEBUG_GUIDE.md` - Panduan lengkap untuk debugging notifikasi

## 🧪 Cara Testing

### Step 1: Jalankan Aplikasi
```bash
npm start
```

### Step 2: Login ke Aplikasi
Login dengan user yang valid.

### Step 3: Buka Browser Console
Cek log berikut harus muncul:
```
✅ WebSocket connected successfully: <socket-id>
🔔 useNotifications: Setting up WebSocket notification listener...
✅ useNotifications: Event listener attached successfully!
```

### Step 4: Test Notifikasi Manual (dari Console)

**Test 1: Notifikasi Chat**
```javascript
testNotification('chat_message')
```

**Expected Result:**
- Console log: `🔔 useNotifications: New notification received...`
- Badge counter di header bertambah (dengan animasi pulse)
- Toast notification muncul di kanan atas: "🔔 Anda punya 1 pesan baru!"
- Browser tab title berubah: "(1) Tracking Project Team - Ada Pesan Baru!"

**Test 2: Debug WebSocket**
```javascript
debugWebSocket()
```

**Expected Result:**
- Tampil info WebSocket (ID, status, registered events)
- Semua event WebSocket akan di-log ke console

### Step 5: Test dengan Backend Real

**Setup:**
1. Buka 2 browser/tab dengan user berbeda (User A dan User B)
2. User A dan User B harus member dari task yang sama
3. User A kirim chat di task tersebut

**Expected Result di User B:**
- ✅ Badge counter bertambah
- ✅ Toast notification muncul
- ✅ Console log menunjukkan notifikasi diterima
- ✅ Notification list di dropdown ter-update
- ✅ Browser notification muncul (jika permission granted)

## 📋 Checklist Pengecekan

Pastikan semua ini berfungsi:

- [ ] **WebSocket terkoneksi**
  - Cek console: `✅ WebSocket connected successfully`
  
- [ ] **Listener di-setup dengan benar**
  - Cek console: `🔔 useNotifications: Setting up WebSocket notification listener...`
  - Cek console: `✅ useNotifications: Event listener attached successfully!`
  
- [ ] **Test manual berhasil**
  - Run: `testNotification('chat_message')`
  - Badge counter bertambah ✅
  - Toast muncul ✅
  - Tab title berubah ✅
  
- [ ] **Backend mengirim event**
  - Backend harus emit event `notification` via WebSocket
  - Format sesuai dengan `AppNotification` interface
  
- [ ] **Notifikasi muncul ketika ada chat baru**
  - Test dengan 2 user berbeda
  - Chat dari User A → Notifikasi di User B ✅

## 🐛 Jika Masih Tidak Berfungsi

### Problem 1: WebSocket tidak terkoneksi
**Symptoms:**
- Tidak ada log `✅ WebSocket connected successfully`
- Log error: `🚨 WebSocket connection error`

**Solutions:**
1. Cek backend WebSocket server berjalan
2. Cek URL WebSocket di environment variables
3. Cek CORS settings di backend
4. Restart backend server

### Problem 2: Listener tidak di-setup
**Symptoms:**
- Tidak ada log `🔔 useNotifications: Setting up WebSocket notification listener...`

**Solutions:**
1. Cek apakah `NotificationProvider` ada di `App.tsx`
2. Cek apakah `WebSocketProvider` ada di `App.tsx`
3. Clear cache dan reload browser
4. Logout dan login kembali

### Problem 3: Notifikasi tidak diterima
**Symptoms:**
- WebSocket terkoneksi ✅
- Listener di-setup ✅
- Tapi tidak ada log ketika chat dikirim

**Solutions:**
1. **Cek Backend**: Pastikan backend emit event `notification` ketika ada chat baru
   ```javascript
   // Di backend
   io.to(userId).emit('notification', {
     id: notificationId,
     type: 'chat_message',
     title: 'Pesan baru dari ...',
     message: '...',
     // ... data lainnya
   });
   ```

2. **Cek Event Name**: Pastikan backend emit event dengan nama `notification` (bukan `new_notification` atau lainnya)

3. **Debug dengan `debugWebSocket()`**: 
   ```javascript
   debugWebSocket()
   ```
   Kemudian kirim chat, cek apakah ada event yang diterima.

4. **Cek Format Data**: Pastikan format data sesuai dengan interface `AppNotification`

## 🔍 Debugging Commands

```javascript
// 1. Cek WebSocket instance
window.__WEBSOCKET_INSTANCE__

// 2. Cek apakah WebSocket terkoneksi
window.__WEBSOCKET_INSTANCE__.connected

// 3. Lihat semua event yang registered
window.__WEBSOCKET_INSTANCE__._callbacks

// 4. Listen semua events
window.__WEBSOCKET_INSTANCE__.onAny((event, ...args) => {
  console.log('📡', event, args)
})

// 5. Test notifikasi manual
testNotification('chat_message')

// 6. Debug mode
debugWebSocket()
```

## 📊 Architecture

```
App.tsx
  └── WebSocketProvider (Connect WebSocket)
       └── NotificationProvider (Setup Listener)
            ├── useNotifications() Hook
            │    ├── Listen event 'notification'
            │    ├── Increment unreadCount
            │    ├── Update notifications list
            │    ├── Play sound
            │    └── Show browser notification
            │
            └── Components
                 └── Header.tsx
                      ├── useNotificationContext()
                      ├── Display badge with unreadCount
                      ├── Display notification list
                      └── Handle notification click
```

## 🎯 Backend Requirements

Backend **HARUS** implement:

### 1. WebSocket Event `notification`
Ketika ada chat baru, backend harus emit:
```javascript
socket.to(userId).emit('notification', {
  id: 'uuid',
  user_id: 'receiver-id',
  sender_id: 'sender-id',
  type: 'chat_message',
  title: 'Pesan baru dari John Doe',
  message: 'Halo, bagaimana kabarnya?',
  data: {
    task_id: 'task-uuid',
    task_title: 'Task Name',
    message_id: 'message-uuid',
    sender_name: 'John Doe',
    full_message: 'Halo, bagaimana kabarnya?'
  },
  is_read: false,
  created_at: '2025-10-10T10:00:00Z'
});
```

### 2. HTTP Endpoints
- `GET /api/notifications` - Get list notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 📝 Notes

- Notifikasi hanya untuk member task (kecuali pengirim)
- WebSocket listener sekarang hanya di satu tempat (useNotifications hook)
- Header menggunakan NotificationContext untuk mendapatkan data
- Testing utilities tersedia di development mode
- Logging detail untuk memudahkan debugging

## ✨ Improvements

Perubahan yang telah dilakukan:
1. ✅ Hapus duplikasi listener WebSocket
2. ✅ Refactor Header untuk menggunakan NotificationContext
3. ✅ Tambah detailed logging untuk debugging
4. ✅ Expose WebSocket instance untuk testing
5. ✅ Buat testing utilities untuk simulasi notifikasi
6. ✅ Buat panduan debug lengkap

---

**Updated:** October 10, 2025  
**Author:** AI Assistant

## 🆘 Bantuan Lebih Lanjut

Jika masih ada masalah, silakan:
1. Cek file `NOTIF_DEBUG_GUIDE.md` untuk panduan lengkap
2. Jalankan `debugWebSocket()` di console untuk melihat event yang diterima
3. Cek console log untuk error atau warning
4. Pastikan backend mengirim event `notification` dengan format yang benar

