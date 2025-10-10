# 🧪 Test Upload File di Task Attachments

## 📋 Status Fitur Upload

### ✅ Frontend Implementation - LENGKAP
- ✅ Component `TaskAttachments.tsx` 
- ✅ Hook `useTaskAttachments.ts`
- ✅ Service `taskViewService.ts`
- ✅ UI Form upload dengan validasi
- ✅ Error handling & loading states
- ✅ File type detection & icons
- ✅ Download & delete functionality

### 🔍 Backend Endpoint
```
POST /api/tasks/{taskId}/attachments/upload
Content-Type: multipart/form-data

FormData:
- file: [File object]
- file_type: string (image/video/audio/document)
- description: string
- is_public: boolean
```

### ⚠️ Kemungkinan Issue
Berdasarkan `BACKEND_UPLOAD_ISSUE.md`:
- Upload endpoint sangat lambat (5+ menit)
- Tidak merespons saat upload file
- Kemungkinan storage/processing issue di backend

## 🧪 Cara Test Upload

### 1. **Akses Task Detail**
1. Buka aplikasi
2. Pilih task manapun
3. Scroll ke bagian "Attachments"

### 2. **Test Upload File**
1. Klik tombol "Upload File" 
2. Pilih file (mulai dengan file kecil < 1MB)
3. Isi description (optional)
4. Pilih public/private
5. Klik "Upload"

### 3. **Yang Harus Terjadi (Jika Berfungsi)**
```
✅ File input muncul
✅ Form validation bekerja
✅ Loading spinner muncul saat upload
✅ Success notification: "File uploaded successfully"
✅ File muncul di list attachments
✅ Download button berfungsi
```

### 4. **Yang Mungkin Terjadi (Jika Bermasalah)**
```
❌ Upload stuck di loading
❌ Error: "Failed to upload file"
❌ Network timeout
❌ Backend tidak merespons
```

## 🔧 Debug Steps

### 1. **Check Console Logs**
```javascript
// Buka Developer Tools (F12)
// Lihat Network tab
// Coba upload file
// Lihat request ke /api/tasks/{taskId}/attachments/upload
```

### 2. **Check Backend Status**
```bash
# Test endpoint langsung
curl -X POST 'http://localhost:9553/api/tasks/TASK_ID/attachments/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@test.txt' \
  -F 'file_type=document' \
  -F 'description=Test file' \
  -F 'is_public=true'
```

### 3. **Check Network Request**
- URL: `/api/tasks/{taskId}/attachments/upload`
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData dengan file + metadata

## 📊 Expected Response

### Success Response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "attachment-123",
    "original_name": "test.txt",
    "file_path": "/uploads/tasks/attachment-123.txt",
    "file_size": 1024,
    "file_type": "document",
    "description": "Test file",
    "is_public": true,
    "user_id": "user-123",
    "uploader_first_name": "John",
    "uploader_last_name": "Doe",
    "created_at": "2025-01-10T10:30:00Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Upload failed",
  "errors": {
    "file": ["File is required"],
    "size": ["File too large"]
  }
}
```

## 🚨 Common Issues & Solutions

### Issue 1: Upload Stuck
**Symptoms:** Loading spinner tidak berhenti
**Cause:** Backend timeout atau hang
**Solution:** 
- Cek backend logs
- Test dengan file lebih kecil
- Check storage service

### Issue 2: Network Error
**Symptoms:** "Network Error" atau timeout
**Cause:** Backend tidak merespons
**Solution:**
- Cek backend status
- Test endpoint manual
- Check CORS settings

### Issue 3: Permission Error
**Symptoms:** "Access denied" atau 403
**Cause:** User tidak punya permission upload
**Solution:**
- Cek user permissions
- Verify task membership
- Check role-based access

### Issue 4: File Size Error
**Symptoms:** "File too large"
**Cause:** File melebihi limit
**Solution:**
- Cek file size limit di backend
- Gunakan file lebih kecil
- Check frontend validation

## 📝 Test Checklist

### Frontend Testing:
- [ ] Upload form muncul
- [ ] File selection bekerja
- [ ] Validation bekerja (required file)
- [ ] Loading state muncul
- [ ] Success notification
- [ ] File muncul di list
- [ ] Download button berfungsi
- [ ] Delete button berfungsi
- [ ] Error handling bekerja

### Backend Testing:
- [ ] Endpoint tersedia
- [ ] File upload processing
- [ ] File storage working
- [ ] Database record created
- [ ] Response format correct
- [ ] Error handling proper
- [ ] File size validation
- [ ] File type validation

## 🔄 Next Steps

### Jika Upload BERFUNGSI:
1. ✅ Fitur sudah siap digunakan
2. Test dengan berbagai file types
3. Test dengan file besar
4. Test concurrent uploads

### Jika Upload TIDAK BERFUNGSI:
1. 🔍 Debug backend issue
2. Check storage configuration
3. Verify endpoint implementation
4. Check network/firewall
5. Consider alternative upload method

---

**Test Date:** $(date)  
**Status:** Ready for Testing  
**Priority:** High (Core Feature)
