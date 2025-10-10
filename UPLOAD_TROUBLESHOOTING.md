# 🔧 Troubleshooting Upload Avatar

Jika Anda mengalami error saat upload avatar, ikuti panduan ini untuk menyelesaikannya.

---

## ❌ Error: Network Error / ERR_NETWORK

### Gejala:
```
POST http://localhost:9553/api/upload net::ERR_FAILED
Network Error
Backend API tidak tersedia. Pastikan backend berjalan di port 9553
```

### Penyebab:
1. Backend tidak running
2. Backend running di port yang berbeda
3. Endpoint `/api/upload` belum tersedia di backend

### Solusi:

#### 1. Cek Backend Running
```bash
# Cek apakah backend running
curl http://localhost:9553/api/health

# Atau cek proses yang berjalan di port 9553
lsof -i :9553
netstat -an | grep 9553
```

#### 2. Pastikan Backend Running
```bash
# Jalankan backend (sesuaikan dengan project backend Anda)
cd /path/to/backend
npm start
# atau
npm run dev
```

#### 3. Cek Endpoint Upload Tersedia
```bash
# Test endpoint upload dengan curl
curl -X POST http://localhost:9553/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/test-image.jpg" \
  -F "type=avatar"
```

#### 4. Periksa Environment Variable
Cek file `.env` di frontend:
```env
REACT_APP_API_URL=http://localhost:9553/api
```

Pastikan port sesuai dengan backend Anda.

---

## ❌ Error: 400 Bad Request

### Gejala:
```
POST http://localhost:9553/api/upload 400 (Bad Request)
```

### Penyebab:
1. Format request tidak sesuai
2. Field yang diperlukan tidak lengkap
3. File type tidak didukung
4. File size terlalu besar

### Solusi:

#### 1. Periksa Backend Requirements
Backend mengharapkan format berikut:

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Headers: `Authorization: Bearer <token>`

**Form Data:**
```
file: [File] (required)
type: "avatar" (required)
description: "Foto profil user" (optional)
```

#### 2. Periksa Backend Validation
Pastikan backend menerima:
- File types: JPG, PNG, GIF, WEBP
- Max file size: 10MB (sesuaikan dengan backend)

#### 3. Cek Backend Logs
Lihat error message di backend untuk detail lebih lanjut.

---

## ❌ Error: 401 Unauthorized

### Gejala:
```
POST http://localhost:9553/api/upload 401 (Unauthorized)
```

### Penyebab:
- Token expired
- Token tidak valid
- Token tidak ada

### Solusi:
1. Login ulang untuk mendapatkan token baru
2. Cek localStorage apakah `access_token` tersimpan:
   ```javascript
   localStorage.getItem('access_token')
   ```
3. Refresh token jika expired

---

## ❌ Error: 413 Payload Too Large

### Gejala:
```
POST http://localhost:9553/api/upload 413 (Payload Too Large)
```

### Penyebab:
File terlalu besar

### Solusi:
1. Compress image sebelum upload
2. Gunakan tools online: tinypng.com, squoosh.app
3. Atau gunakan library compression:
   ```bash
   npm install browser-image-compression
   ```

---

## 🔍 Debug Mode

Aktifkan debug mode untuk melihat detail upload:

1. Buka Chrome DevTools (F12)
2. Tab Console
3. Lihat log upload:
   ```
   📤 Uploading file: {fileName, fileSize, fileType, uploadType}
   ✅ Upload successful: {...}
   atau
   ❌ Upload error: {...}
   ```

---

## 🧪 Test Upload Manual

### Dengan cURL:
```bash
# Ganti YOUR_TOKEN dengan access token Anda
curl -X POST http://localhost:9553/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "type=avatar" \
  -F "description=Test avatar"
```

### Dengan Postman:
1. Method: POST
2. URL: `http://localhost:9553/api/upload`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Body: form-data
   - `file`: pilih file image
   - `type`: `avatar`
   - `description`: `Test avatar`

---

## 🛠 Workaround: Test Tanpa Backend

Jika backend belum siap, Anda bisa test UI dengan mockup:

### Option 1: Gunakan Avatar URL Langsung
Alih-alih upload file, gunakan URL image dari internet:
```
https://i.pravatar.cc/300
https://ui-avatars.com/api/?name=John+Doe
```

### Option 2: Mock Upload Service
Edit `src/services/upload.ts` untuk development:

```typescript
// Tambahkan di awal file
const MOCK_MODE = process.env.REACT_APP_MOCK_UPLOAD === 'true';

// Di dalam uploadFile function
if (MOCK_MODE) {
  console.log('🧪 Mock mode: Simulating upload...');
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock response
  const mockUrl = URL.createObjectURL(file);
  return {
    success: true,
    message: 'File uploaded (mock)',
    data: {
      id: 'mock-' + Date.now(),
      filename: file.name,
      original_name: file.name,
      url: mockUrl,
      size: file.size,
      mime_type: file.type,
      type: options.type,
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
}
```

Lalu set di `.env`:
```env
REACT_APP_MOCK_UPLOAD=true
```

---

## 📋 Checklist Backend Upload Endpoint

Pastikan backend Anda memiliki:

- [ ] Endpoint `POST /api/upload` tersedia
- [ ] Middleware authentication untuk verifikasi token
- [ ] Multer atau library serupa untuk handle multipart/form-data
- [ ] Validation untuk:
  - [ ] File type (JPG, PNG, GIF, WEBP)
  - [ ] File size (max 10MB)
  - [ ] Required fields (file, type)
- [ ] Storage configuration (local/cloud)
- [ ] Response format sesuai interface `UploadResponse`
- [ ] Error handling yang baik
- [ ] CORS configuration untuk development

---

## 📝 Backend Implementation Example (Express.js)

Jika backend belum ada, berikut contoh implementasi:

```javascript
// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

// Upload endpoint
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    const { type, description } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type harus diisi'
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    // Save to database if needed
    const fileRecord = {
      id: uuidv4(),
      user_id: req.user.id,
      original_name: req.file.originalname,
      file_name: req.file.filename,
      file_path: req.file.path,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      type: type,
      url: fileUrl,
      description: description || null,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'File berhasil diupload',
      data: fileRecord
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal upload file'
    });
  }
});

module.exports = router;
```

---

## 🆘 Masih Bermasalah?

Jika masih error setelah mengikuti panduan ini:

1. **Check Console Logs**: Lihat error detail di browser console
2. **Check Backend Logs**: Lihat error di backend server logs
3. **Check Network Tab**: Lihat request/response di Chrome DevTools → Network
4. **Contact Backend Team**: Tanyakan spesifikasi endpoint upload yang benar
5. **Temporary Solution**: Gunakan avatar URL langsung tanpa upload

---

## 📞 Support

Untuk bantuan lebih lanjut:
- Buka issue di repository
- Contact backend developer
- Check dokumentasi backend API

---

**Last Updated**: Oktober 2025

