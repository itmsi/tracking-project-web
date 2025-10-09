# 🔔 Panduan Notifikasi Chat - Project Tracker

## 📌 Apa yang Telah Diintegrasikan?

Sistem notifikasi chat telah berhasil diintegrasikan ke aplikasi Project Tracker! Sekarang setiap kali ada chat baru di task, semua member akan langsung mendapat notifikasi real-time.

## ✨ Fitur-Fitur

### 1. 🔔 Notifikasi Real-time
- Notifikasi langsung muncul ketika ada chat baru
- Badge counter di icon bell otomatis update
- Tidak perlu refresh halaman

### 2. 💬 Tipe Notifikasi Chat
- **Chat Baru**: Notifikasi untuk setiap pesan baru di task
- **Reply**: Notifikasi khusus ketika seseorang membalas pesan Anda
- **Mention**: Notifikasi ketika seseorang mention Anda dengan @username (coming soon)

### 3. 🔍 Notification Center
- Klik icon bell (🔔) di header untuk lihat semua notifikasi
- Badge merah menunjukkan jumlah notifikasi yang belum dibaca
- Bisa mark as read individual atau mark all as read
- Bisa hapus notifikasi yang tidak diperlukan

### 4. 🎯 Navigasi ke Task
- **Klik notifikasi** → Langsung dibawa ke halaman detail task
- **Auto-scroll** → Otomatis scroll ke bagian chat
- **Highlight** → Chat section akan ter-highlight selama 2 detik
- URL format: `/tasks/{taskId}?tab=chat`

### 5. 🔊 Browser Notification (Optional)
- Notifikasi browser muncul bahkan saat tab tidak aktif
- Request permission saat pertama kali menerima notifikasi
- Bisa di-enable/disable dari browser settings

### 6. 🔔 Notification Sound (Optional)
- Suara notifikasi saat ada chat baru
- Volume otomatis set 30% agar tidak mengganggu

## 🚀 Cara Menggunakan

### Menerima Notifikasi

1. **Login** ke aplikasi
2. **Pastikan** Anda adalah member dari task tertentu
3. **Tunggu** member lain mengirim chat di task tersebut
4. **Notifikasi akan muncul** secara otomatis di icon bell

### Membuka Notifikasi

1. **Klik icon bell (🔔)** di header (pojok kanan atas)
2. **Lihat daftar notifikasi** yang belum dibaca (ditandai dengan background biru muda)
3. **Klik notifikasi** yang ingin Anda buka
4. **Otomatis dibawa** ke halaman task dan scroll ke chat section

### Mark as Read

**Cara 1 - Individual:**
- Klik icon centang (✓) di samping notifikasi
- Notifikasi akan ditandai sebagai sudah dibaca

**Cara 2 - Otomatis saat dibuka:**
- Klik notifikasi untuk membukanya
- Otomatis ditandai sebagai sudah dibaca

**Cara 3 - Mark All:**
- Klik tombol "Mark All Read" di header notification dropdown
- Semua notifikasi akan ditandai sebagai sudah dibaca sekaligus

### Hapus Notifikasi

- Klik icon X (✕) di samping notifikasi
- Notifikasi akan terhapus dari list

## 🎨 Tampilan

### Icon Bell dengan Badge
```
🔔 [5]  ← Badge merah menunjukkan 5 notifikasi belum dibaca
```

### Notification Dropdown
```
┌─────────────────────────────────┐
│  Notifications    [Mark All Read]│
├─────────────────────────────────┤
│ 💬 Pesan baru dari John Doe     │
│    "Halo, bagaimana progress..." │
│    5 menit yang lalu        [✓][✕]│
│─────────────────────────────────│
│ ↩️  Jane Smith membalas pesan  │
│    "Sudah 70% selesai..."       │
│    10 menit yang lalu       [✓][✕]│
└─────────────────────────────────┘
```

### Task View dengan Highlight
Saat notifikasi diklik, chat section akan:
- **Auto-scroll** ke posisi chat
- **Biru menyala** (highlight) selama 2 detik
- **Shadow effect** untuk menarik perhatian

## 🔧 Cara Kerja Teknis

### Flow Sederhana:
```
User A kirim chat
    ↓
Backend buat notifikasi
    ↓
WebSocket kirim ke User B (real-time)
    ↓
Badge counter bertambah
    ↓
User B klik notifikasi
    ↓
Navigate ke task + scroll ke chat
```

### Komponen yang Terlibat:
1. **WebSocket** - Kirim notifikasi real-time
2. **Header Component** - Tampilkan badge dan dropdown
3. **useNotifications Hook** - Manage state notifikasi
4. **TaskView Page** - Handle auto-scroll ke chat

## ⚙️ Settings (Optional)

### Enable/Disable Browser Notification

**Chrome/Edge:**
1. Klik icon gembok di address bar
2. Pilih "Site settings"
3. Cari "Notifications"
4. Pilih "Allow" atau "Block"

**Firefox:**
1. Klik icon gembok di address bar
2. Klik tanda > di samping "Notifications"
3. Pilih "Allow" atau "Block"

**Safari:**
1. Safari > Preferences
2. Websites > Notifications
3. Cari domain aplikasi
4. Pilih "Allow" atau "Deny"

## 🐛 Troubleshooting

### Notifikasi Tidak Muncul?

**Checklist:**
- ✅ Pastikan Anda login
- ✅ Pastikan Anda member dari task
- ✅ Pastikan WebSocket terkoneksi (cek console)
- ✅ Refresh halaman dan coba lagi
- ✅ Clear browser cache

### Badge Count Tidak Akurat?

**Solusi:**
- Refresh halaman untuk sync dengan server
- Mark all as read lalu refresh
- Logout dan login kembali

### Chat Tidak Ter-highlight?

**Kemungkinan Penyebab:**
- Browser tidak support smooth scroll
- Halaman belum selesai loading
- Tunggu beberapa detik dan coba klik notifikasi lagi

### Browser Notification Tidak Muncul?

**Checklist:**
- ✅ Pastikan browser notification di-allow
- ✅ Pastikan tab tidak dalam focus (browser notification hanya muncul saat tab tidak aktif)
- ✅ Cek browser settings untuk notification permission

## 📱 Kompatibilitas Browser

| Browser | Notifikasi | WebSocket | Auto-scroll | Browser Notification |
|---------|-----------|-----------|-------------|---------------------|
| Chrome  | ✅        | ✅        | ✅          | ✅                  |
| Firefox | ✅        | ✅        | ✅          | ✅                  |
| Safari  | ✅        | ✅        | ✅          | ✅                  |
| Edge    | ✅        | ✅        | ✅          | ✅                  |

## 💡 Tips & Tricks

1. **Gunakan Browser Notification** untuk tidak ketinggalan chat penting saat sedang bekerja di aplikasi lain

2. **Mark All as Read berkala** untuk menjaga notification list tetap clean

3. **Focus mode:** Disable notification sound saat sedang meeting atau presentasi

4. **Quick access:** Bookmark task yang sering dibuka untuk akses cepat

5. **Notification badge:** Angka badge menunjukkan total unread, bukan hanya chat notifications

## 🎯 Best Practices

### Untuk Team Members:
- ✅ Selalu check notifikasi secara berkala
- ✅ Tandai notifikasi sebagai read setelah dibaca
- ✅ Reply chat dengan cepat untuk komunikasi yang efektif
- ✅ Gunakan mention (@username) untuk notifikasi yang lebih spesifik (coming soon)

### Untuk Project Managers:
- ✅ Monitor notifikasi untuk track team communication
- ✅ Encourage team untuk menggunakan chat di task untuk centralised discussion
- ✅ Set reminder untuk check unread notifications

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check dokumentasi lengkap di `CHAT_NOTIFICATION_IMPLEMENTATION.md`
2. Lihat console log browser untuk error messages
3. Contact developer team

---

**Versi:** 1.0  
**Tanggal:** 9 Januari 2025  
**Status:** ✅ Production Ready

