# 🧪 Cara Test Badge Notifikasi - Step by Step

## 📋 Overview

Badge notifikasi sekarang **SUPER EYE-CATCHING** dengan 7 visual indicators yang berbeda! Ikuti panduan ini untuk test apakah badge notifikasi sudah bekerja dengan baik.

---

## ✨ 7 Visual Indicators yang Akan Muncul

Saat ada notifikasi baru, Anda akan melihat:

### 1. 🔴 Badge Merah Dengan Angka
```
🔔 [5] ← Badge merah besar dengan angka
```
- Badge 24px tinggi
- Font 13px bold
- Warna merah mencolok
- Border putih untuk kontras

### 2. 💓 Animasi Pulse (Berkedip)
- Badge membesar-mengecil setiap 2 detik
- Scale dari 1.0 → 1.2 → 1.0
- Infinite loop selama ada notifikasi

### 3. 🌟 Glowing Shadow
- Shadow merah bercahaya
- Radius 15px
- Membuat badge terlihat "melayang"

### 4. 🔔 Icon Bell Berubah Warna KUNING!
```
Normal: 🔔 (putih)
Ada notif: 🔔 (kuning/gold) ← SUPER MENCOLOK!
```

### 5. 📲 Icon Bell Membesar
```
Normal: 🔔 26px
Ada notif: 🔔 30px ← Lebih besar
```

### 6. 📋 Browser Tab Title
```
Normal: "Tracking Project Team"
Ada Notif: "(5) Tracking Project Team - Ada Pesan Baru!"
```

### 7. 🎊 Toast Notification
```
┌─────────────────────────────────┐
│ 🔔 Anda punya 2 pesan baru!    │
└─────────────────────────────────┘
```

---

## 🧪 Cara Test Badge Notifikasi

### Metode 1: Menggunakan Tombol "Test Notif" (TERMUDAH!)

**Step by step:**

1. **Buka aplikasi** di browser (http://localhost:9554)

2. **Login** dengan akun Anda

3. **Lihat header** di bagian atas
   ```
   [Test Notif] 🔍 🔔 👤
        ↑
   Tombol ini hanya muncul di development mode
   ```

4. **Klik tombol "Test Notif"**

5. **Lihat perubahannya!** Seharusnya Anda akan melihat:
   - ✅ Badge merah muncul dengan angka [1]
   - ✅ Icon lonceng berubah warna KUNING
   - ✅ Icon lonceng membesar
   - ✅ Badge berkedip (pulse animation)
   - ✅ Shadow merah glowing di badge
   - ✅ Tab title berubah "(1) Tracking Project Team - Ada Pesan Baru!"
   - ✅ Toast notification muncul di pojok kanan atas

6. **Klik "Test Notif" lagi** beberapa kali
   - Badge counter akan bertambah: [2], [3], [4], dst.
   - Setiap klik akan show toast notification baru

7. **Klik icon lonceng** untuk buka dropdown notifikasi
   - Lihat list notifikasi (mungkin kosong kalau testing)
   - Badge masih terlihat di icon

8. **Check browser console (F12)**
   ```
   🔔 Initial unread count: 0
   📊 Unread count changed: { previous: 0, current: 1, diff: 1 }
   🎉 Showing toast for 1 new notifications
   🧪 Simulating new notification...
   📊 Unread count changed: { previous: 1, current: 2, diff: 1 }
   ```

---

### Metode 2: Menggunakan Chat Real (Production Test)

**Prerequisites:**
- 2 user accounts berbeda
- 2 browser/tab berbeda
- Kedua user harus member dari task yang sama

**Step by step:**

1. **Browser 1 - Login sebagai User A**
   - Buka task yang Anda dan User B adalah member

2. **Browser 2 - Login sebagai User B**
   - Buka halaman yang sama (atau halaman manapun)

3. **User A kirim chat** di task tersebut
   - Tulis pesan: "Test notifikasi"
   - Klik Send

4. **User B - Lihat notifikasi muncul!**
   - ✅ Badge merah muncul [1]
   - ✅ Icon kuning
   - ✅ Badge berkedip
   - ✅ Toast "🔔 Anda punya 1 pesan baru!"
   - ✅ Tab title berubah

5. **User B - Klik notifikasi**
   - Dropdown terbuka
   - Lihat notifikasi chat baru
   - Klik notifikasi → Navigate ke task & scroll ke chat

6. **Badge berkurang**
   - Setelah di-click/mark as read
   - Badge counter berkurang atau hilang

---

### Metode 3: Menggunakan Backend API (Advanced)

**Send manual notification via API:**

```bash
# Kirim chat baru (akan auto-create notification)
curl -X POST http://localhost:9553/api/v1/tasks/TASK_ID/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test notification from API"
  }'

# Get unread count
curl -X GET http://localhost:9553/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Troubleshooting

### ❌ Badge tidak muncul?

**Check:**
1. ✅ Apakah ada console log "🔔 Initial unread count: X"?
   - Jika tidak ada → Backend API belum tersedia
   - Jika ada tapi 0 → Tidak ada notifikasi

2. ✅ Coba klik tombol "Test Notif"
   - Jika badge muncul → Badge bekerja, tunggu notifikasi real
   - Jika tidak muncul → Ada masalah di code (hubungi developer)

3. ✅ Check browser console untuk error
   - F12 → Console tab
   - Lihat apakah ada error merah

4. ✅ Pastikan login sudah berhasil
   - Jika belum login, notifikasi tidak akan load

---

### ❌ Toast notification tidak muncul?

**Check:**
1. ✅ Klik tombol "Test Notif" - toast harus muncul
2. ✅ Lihat console log "🎉 Showing toast for X new notifications"
3. ✅ Toast muncul di pojok kanan atas (bisa tertutup window lain)

---

### ❌ Icon tidak berubah warna kuning?

**Check:**
1. ✅ Badge counter harus > 0
2. ✅ Icon akan kuning HANYA saat ada notifikasi
3. ✅ Refresh page dan coba lagi

---

### ❌ Animasi pulse tidak terlihat?

**Check:**
1. ✅ Badge counter harus > 0
2. ✅ Browser Anda support CSS animations
3. ✅ Animasi pulse cycle 2 detik - tunggu beberapa saat

---

## 📊 Expected Behavior Summary

| State | Badge | Icon Color | Icon Size | Tab Title | Toast | Pulse |
|-------|-------|------------|-----------|-----------|-------|-------|
| No Notif (0) | Hidden | White | 26px | Normal | No | No |
| 1 Notif | [1] Red | Yellow | 30px | "(1) ..." | Yes | Yes |
| 5 Notifs | [5] Red | Yellow | 30px | "(5) ..." | Yes | Yes |
| 100+ Notifs | [99+] Red | Yellow | 30px | "(99+) ..." | Yes | Yes |

---

## 🎨 Visual Example

### BEFORE (No notifications):
```
Header:
┌────────────────────────────────┐
│ Tracking Project Team  🔍 🔔 👤│
│                           ↑    │
│                      White bell│
└────────────────────────────────┘

Tab: "Tracking Project Team"
```

### AFTER (3 new notifications):
```
Header:
┌────────────────────────────────┐
│ Tracking Project Team  🔍 🔔 👤│
│                          [3]   │
│                           ↑    │
│                    Yellow bell │
│                    + Red badge │
│                    + Pulse     │
│                    + Shadow    │
└────────────────────────────────┘

Tab: "(3) Tracking Project Team - Ada Pesan Baru!"

Toast (top right):
┌─────────────────────────────────┐
│ 🔔 Anda punya 3 pesan baru!    │
└─────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Test dengan tombol "Test Notif"** terlebih dahulu
2. **Verifikasi semua 7 visual indicators** muncul
3. **Test dengan chat real** (2 users)
4. **Verify** badge berkurang setelah click notification
5. **Production:** Hapus tombol "Test Notif" atau biarkan (hanya muncul di dev mode)

---

## 🐛 Debugging Console Logs

Saat testing, Anda akan melihat console logs seperti ini:

```javascript
// Initial load
📋 Notifications loaded: 0
🔔 Initial unread count: 0

// Saat klik "Test Notif"
🧪 Simulating new notification...
📊 Unread count changed: { previous: 0, current: 1, diff: 1 }
🎉 Showing toast for 1 new notifications

// Saat ada notifikasi real via WebSocket
🔔 New notification received via WebSocket: {...}
📊 Unread count changed: { previous: 1, current: 2, diff: 1 }
🎉 Showing toast for 1 new notifications
```

---

## ✅ Success Criteria

Test berhasil jika:

- ✅ Badge merah muncul dengan angka yang benar
- ✅ Icon lonceng berubah warna KUNING
- ✅ Icon lonceng membesar
- ✅ Badge berkedip terus menerus
- ✅ Shadow merah terlihat di badge
- ✅ Tab title update dengan jumlah notifikasi
- ✅ Toast notification muncul dan auto-hide
- ✅ Console logs muncul dengan benar

**Jika 7 dari 7 indicators muncul = PERFECT!** 🎉

---

**Version:** 2.0  
**Date:** January 9, 2025  
**Author:** AI Assistant  
**Status:** ✅ Ready to Test

