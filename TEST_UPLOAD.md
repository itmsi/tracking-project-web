# 🧪 Test Upload Avatar

Panduan untuk test upload avatar secara manual menggunakan cURL.

---

## 📋 Persiapan

### 1. Pastikan Backend Running
```bash
# Cek backend
curl http://localhost:9553/api/health
```

### 2. Siapkan File Test
Siapkan file image untuk test, misalnya:
- `/Users/falaqmsi/Downloads/test-avatar.jpg`
- Atau gunakan path file lain yang ada di komputer Anda

### 3. Dapatkan Access Token
Login ke aplikasi dan copy access token dari localStorage:
```javascript
// Di Browser Console
localStorage.getItem('access_token')
```

---

## 🚀 Test Upload dengan cURL

### Format Lengkap:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE' \
  -F 'file=@/path/to/your-image.jpg' \
  -F 'type=avatar' \
  -F 'description=Foto profil user'
```

### Contoh dengan Token Real:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsImVtYWlsIjoiYWRtaW5AdHJhY2tlci5jb20iLCJyb2xlIjoiYWRtaW4iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NTk5OTgxNzUsImV4cCI6MTc2MDA4NDU3NX0.M9LQ0SLb6AvR1EFD1pxVRKiASy7nxnGeBKi_cD1yz0s' \
  -F 'file=@/Users/falaqmsi/Documents/test-avatar.jpg' \
  -F 'type=avatar' \
  -F 'description=Foto profil user'
```

**Note:** Ganti path file sesuai lokasi file Anda!

---

## 📝 Parameter Wajib

| Parameter | Type | Deskripsi | Contoh |
|-----------|------|-----------|--------|
| `file` | File | File image yang akan diupload | `@/path/to/image.jpg` |
| `type` | String | Tipe upload (avatar/task_attachment/etc) | `avatar` |
| `description` | String | Deskripsi file (optional) | `Foto profil user` |

---

## ✅ Response Sukses (201)

```json
{
  "success": true,
  "message": "File berhasil diupload",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "11111111-1111-1111-1111-111111111111",
    "original_name": "test-avatar.jpg",
    "file_name": "1759998175000-test-avatar.jpg",
    "file_path": "avatar/1759998175000-test-avatar.jpg",
    "file_size": 150000,
    "mime_type": "image/jpeg",
    "type": "avatar",
    "url": "http://localhost:9553/uploads/avatar/1759998175000-test-avatar.jpg",
    "description": "Foto profil user",
    "created_at": "2025-10-10T10:30:00.000Z"
  }
}
```

**Yang Penting:**
- `url` → Ini yang akan disimpan ke profile sebagai `avatar_url`

---

## ❌ Response Error

### 400 Bad Request
```json
{
  "success": false,
  "message": "File tidak ditemukan"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "message": "File terlalu besar. Maksimal 10MB"
}
```

### 415 Unsupported Media Type
```json
{
  "success": false,
  "message": "Format file tidak didukung"
}
```

---

## 🧪 Test Step by Step

### Step 1: Test dengan file kecil dulu
```bash
# Gunakan file kecil (< 1MB) untuk test pertama
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/small-image.jpg' \
  -F 'type=avatar' \
  -F 'description=Test upload' \
  -v  # verbose mode untuk lihat detail
```

### Step 2: Periksa Response
Jika sukses, Anda akan mendapat response dengan `url` file.

### Step 3: Test URL
Buka URL di browser untuk memastikan file berhasil diupload:
```
http://localhost:9553/uploads/avatar/1759998175000-test-avatar.jpg
```

### Step 4: Test di Aplikasi
Setelah curl berhasil, coba upload dari aplikasi React.

---

## 🔍 Debug dengan Verbose Mode

Tambahkan flag `-v` untuk melihat detail request:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.jpg' \
  -F 'type=avatar' \
  -F 'description=Foto profil user' \
  -v
```

Output akan menampilkan:
- Request headers
- Response headers
- Response body
- Status code

---

## 📊 Test dengan Berbagai Format File

### JPEG:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.jpg' \
  -F 'type=avatar' \
  -F 'description=JPEG test'
```

### PNG:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.png' \
  -F 'type=avatar' \
  -F 'description=PNG test'
```

### WEBP:
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.webp' \
  -F 'type=avatar' \
  -F 'description=WEBP test'
```

---

## 🛠 Troubleshooting

### Error: File not found
```
curl: (26) Failed to open/read local data from file/application
```
**Solusi:** Periksa path file, pastikan file ada dan path benar.

### Error: Connection refused
```
curl: (7) Failed to connect to localhost port 9553: Connection refused
```
**Solusi:** Backend tidak running. Jalankan backend terlebih dahulu.

### Error: 401 Unauthorized
**Solusi:** Token expired atau tidak valid. Login ulang dan dapatkan token baru.

### Error: 400 Bad Request
**Solusi:** 
- Periksa parameter (file, type harus ada)
- Periksa format file (harus image)
- Periksa size file (< 10MB)

---

## 💡 Tips

1. **Gunakan Path Absolut**: Lebih aman menggunakan full path untuk file
   ```bash
   # Good
   -F 'file=@/Users/username/Downloads/image.jpg'
   
   # Risky
   -F 'file=@./image.jpg'
   ```

2. **Cek Token Expiry**: Token JWT biasanya expire setelah beberapa waktu (24 jam)
   
3. **Test di Postman**: Jika curl sulit, gunakan Postman untuk UI yang lebih mudah

4. **Save Response**: Save response ke file untuk analisis
   ```bash
   curl 'http://localhost:9553/api/upload' \
     -H 'Authorization: Bearer YOUR_TOKEN' \
     -F 'file=@/path/to/image.jpg' \
     -F 'type=avatar' \
     -F 'description=Test' \
     > response.json
   ```

---

## 📌 Quick Reference

### Template cURL (Copy & Edit):
```bash
curl 'http://localhost:9553/api/upload' \
  -H 'Authorization: Bearer PASTE_YOUR_TOKEN_HERE' \
  -F 'file=@PASTE_YOUR_FILE_PATH_HERE' \
  -F 'type=avatar' \
  -F 'description=Foto profil user'
```

### Cara Cepat Get Token:
```javascript
// Browser Console (F12)
copy(localStorage.getItem('access_token'))
// Token sudah dicopy ke clipboard
```

---

## ✅ Checklist Sebelum Upload

- [ ] Backend running di port 9553
- [ ] Sudah login dan punya access token
- [ ] File image siap (JPG/PNG/GIF/WEBP)
- [ ] File size < 10MB
- [ ] Endpoint `/api/upload` tersedia
- [ ] CORS configured (jika test dari browser)

---

**Last Updated**: Oktober 2025  
**Port**: 9553  
**Endpoint**: `/api/upload`

---

## 🆘 Masih Error?

1. Cek backend logs untuk error detail
2. Test endpoint lain (GET `/api/auth/me`) untuk pastikan token valid
3. Hubungi backend developer
4. Lihat file `UPLOAD_TROUBLESHOOTING.md` untuk panduan lengkap

