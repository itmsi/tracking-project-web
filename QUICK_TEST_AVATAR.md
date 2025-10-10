# 🧪 Quick Test - Avatar Update

Panduan cepat untuk test update avatar (30 detik).

---

## ✅ Backend Test Result

Backend **sudah bekerja dengan sempurna**! ✨

```bash
# Test curl berhasil ✅
curl 'http://localhost:9553/api/auth/profile' \
  -X PUT \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  --data '{"avatar_url":"https://ui-avatars.com/api/?name=Test+User&size=200"}'

# Response:
{
  "success": true,
  "message": "Profile berhasil diperbarui",
  "data": {
    "avatar_url": "https://ui-avatars.com/api/?name=Test+User&size=200",
    ...
  }
}
```

✅ **Backend OK!**

---

## 🚀 Quick Test di Browser

### Method 1: Quick Test Buttons (Termudah!)

1. **Login** ke aplikasi
2. **Buka** `/profile`
3. **Klik tab** "📝 Input URL"
4. **Klik salah satu** Quick Test Button:
   - **UI Avatar (Blue)** - Avatar dengan nama
   - **Pravatar (Random)** - Random photo
   - **DiceBear (Cartoon)** - Cartoon style
5. **Preview** langsung muncul!
6. **Klik "Simpan"**
7. **Done!** ✅

**Logs yang Diharapkan di Console:**
```
🔄 AvatarUrlInput: Submitting with avatarUrl: https://...
📤 AvatarUrlInput: Calling updateProfile with: { avatar_url: "https://..." }
✅ AvatarUrlInput: Profile updated successfully: {...}
```

---

### Method 2: Manual Input URL

1. **Login** dan buka `/profile`
2. **Klik tab** "📝 Input URL"
3. **Klik** "Ubah Avatar URL"
4. **Paste URL** salah satu:
   ```
   https://ui-avatars.com/api/?name=Your+Name&size=200
   https://i.pravatar.cc/300
   https://api.dicebear.com/7.x/avataaars/svg?seed=YourName
   ```
5. **Preview** otomatis muncul
6. **Klik "Simpan"**
7. **Check console** untuk logs
8. **Done!** ✅

---

## 🔍 Debugging Checklist

Jika gagal, check ini:

### 1. Check Console Logs
Buka Chrome DevTools (F12) → Console

**Expected Logs:**
```javascript
🔄 AvatarUrlInput: Submitting with avatarUrl: ...
📤 AvatarUrlInput: Calling updateProfile with: ...
✅ AvatarUrlInput: Profile updated successfully: ...
```

**If Error:**
```javascript
❌ AvatarUrlInput: URL is empty
// atau
❌ AvatarUrlInput: Invalid URL format: ...
// atau
❌ AvatarUrlInput: Update failed: ...
```

---

### 2. Check Network Tab
Chrome DevTools → Network → Filter: XHR

**Expected Request:**
```
Request URL: http://localhost:9553/api/auth/profile
Request Method: PUT
Request Headers:
  - Authorization: Bearer TOKEN
  - Content-Type: application/json
  
Request Payload:
{
  "avatar_url": "https://ui-avatars.com/api/?name=Test&size=200"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile berhasil diperbarui",
  "data": {
    "avatar_url": "https://...",
    ...
  }
}
```

---

### 3. Common Issues

#### Issue: Body kosong `{}`

**Problem:**
```javascript
Request Payload: {}  // ❌ Empty!
```

**Solusi:**
- Pastikan URL diisi di input field
- Klik salah satu Quick Test Button
- Check state dengan: `console.log(avatarUrl)`

---

#### Issue: URL tidak valid

**Problem:**
```
❌ AvatarUrlInput: Invalid URL format: example.com/image.jpg
```

**Solusi:**
- URL harus dimulai dengan `http://` atau `https://`
- Contoh benar: `https://example.com/image.jpg`
- Contoh salah: `example.com/image.jpg`

---

#### Issue: Token expired

**Problem:**
```
401 Unauthorized
```

**Solusi:**
1. Logout
2. Login ulang
3. Copy new token
4. Test lagi

---

#### Issue: CORS Error

**Problem:**
```
Access to XMLHttpRequest at 'http://localhost:9553/api/auth/profile' 
from origin 'http://localhost:9554' has been blocked by CORS policy
```

**Solusi:**
- Backend CORS sudah configured untuk same-site
- Pastikan backend running
- Check backend CORS config

---

## 📊 Test Cases

### Test Case 1: UI Avatar
```javascript
URL: https://ui-avatars.com/api/?name=Test+User&size=200&background=3498db&color=fff

Expected:
✅ Preview shows blue avatar with "TU" initials
✅ Save button works
✅ Profile updated
✅ Header avatar updates
```

---

### Test Case 2: Pravatar
```javascript
URL: https://i.pravatar.cc/300

Expected:
✅ Preview shows random person photo
✅ Save button works
✅ Profile updated
✅ Header avatar updates
```

---

### Test Case 3: DiceBear
```javascript
URL: https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser

Expected:
✅ Preview shows cartoon avatar
✅ Save button works
✅ Profile updated
✅ Header avatar updates
```

---

### Test Case 4: Custom URL
```javascript
URL: https://your-image-hosting.com/avatar.jpg

Expected:
✅ Preview shows your image
✅ Save button works
✅ Profile updated
✅ Header avatar updates
```

---

### Test Case 5: Invalid URL
```javascript
URL: not-a-valid-url

Expected:
❌ Error message: "URL tidak valid. Harus dimulai dengan http:// atau https://"
❌ Save button should show error
```

---

### Test Case 6: Empty URL
```javascript
URL: (kosong)

Expected:
❌ Error message: "URL avatar harus diisi"
❌ Save button should show error
```

---

## 🎯 Success Criteria

Avatar update **berhasil** jika:

✅ Preview avatar muncul  
✅ Klik "Simpan" tidak ada error  
✅ Success message muncul  
✅ Avatar di header berubah  
✅ Refresh page, avatar tetap update  
✅ Console logs show success  
✅ Network tab shows 200 OK  

---

## 🐛 Known Issues

### Issue 1: Upload File Lambat
**Status:** Known Issue  
**Workaround:** Gunakan Input URL method  
**Reference:** `BACKEND_UPLOAD_ISSUE.md`

### Issue 2: Image Not Loading (CORS)
**Status:** External Service Issue  
**Workaround:** Try different image URL  
**Note:** Image harus publicly accessible

---

## 📱 Mobile Testing

### iOS Safari:
✅ Quick test buttons work  
✅ URL input works  
✅ Preview works  
✅ Save works  

### Android Chrome:
✅ Quick test buttons work  
✅ URL input works  
✅ Preview works  
✅ Save works  

---

## 🔧 Developer Tools

### Enable Debug Mode
Browser Console sudah ada logging otomatis:
- 🔄 = Process starting
- 📤 = API call
- ✅ = Success
- ❌ = Error

### Additional Debug
Tambahkan di component:
```javascript
console.log('Current avatarUrl state:', avatarUrl);
console.log('Current preview state:', preview);
```

---

## 📝 Report Issue

Jika masih gagal, report dengan info:

1. **Browser & Version**
   - Chrome 141.x.x.x

2. **Console Logs**
   - Copy semua logs yang ada

3. **Network Request**
   - Copy Request URL, Method, Headers, Body
   - Copy Response Status, Body

4. **Screenshots**
   - UI state
   - Error message
   - Console logs

5. **Steps to Reproduce**
   - Langkah demi langkah

---

## ✅ Quick Checklist

Before reporting issue:

- [ ] Backend running di port 9553?
- [ ] Frontend running di port 9554?
- [ ] Sudah login dengan token valid?
- [ ] URL valid (starts with http/https)?
- [ ] Check console untuk error logs?
- [ ] Check network tab untuk request/response?
- [ ] Try Quick Test Button?
- [ ] Try different URL?
- [ ] Clear cache & refresh?
- [ ] Try different browser?

---

## 🎉 Success!

Jika semua test passed:

✅ **Avatar update feature working perfectly!**

**Next Steps:**
- Test upload file method (Tab "📤 Upload File")
- Test change password
- Test edit profile info
- Test on mobile devices

---

**Last Updated**: Oktober 2025  
**Test Duration**: ~30 seconds per test case  
**Total Test Cases**: 6

---

**Happy Testing! 🚀**

