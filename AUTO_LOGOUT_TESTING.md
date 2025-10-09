# Auto Logout Testing Guide

## 🧪 **Cara Testing Auto-Logout**

Auto-logout sekarang sudah diimplementasikan dengan enhanced debugging. Ikuti langkah-langkah berikut untuk testing:

### **Method 1: Gunakan Testing Utilities (Development Mode)**

Di development mode, testing utilities sudah di-load otomatis di browser console.

#### 1. Buka Browser Console
- Chrome/Firefox: F12 atau Cmd+Option+I (Mac)
- Buka tab "Console"

#### 2. Check Token Status
```javascript
window.checkTokenStatus()
```

Output:
```
📊 Token Status:
Access Token: ✅ Present
Refresh Token: ✅ Present
Token Expiry: 10/9/2025, 10:30:00 PM
Is Expired: ✅ NO
Time until expiry: 45 minutes
```

#### 3. Test Invalid Token
```javascript
window.testInvalidToken()
```

Lalu lakukan action (navigate, edit data, dll). Harusnya auto-logout terpicu.

#### 4. Test No Refresh Token
```javascript
window.testNoRefreshToken()
```

Lalu lakukan action. Harusnya auto-logout terpicu.

#### 5. Test Expired Token
```javascript
window.testExpiredToken()
```

Lalu lakukan action. Harusnya auto-logout terpicu.

#### 6. Force Logout
```javascript
window.forceLogout()
```

Langsung logout dengan reason "Manual logout for testing".

### **Method 2: Manual Token Manipulation**

#### 1. Set Invalid Token
```javascript
// Di browser console
localStorage.setItem('access_token', 'invalid_token_12345');
```

#### 2. Remove Refresh Token
```javascript
// Di browser console
localStorage.removeItem('refresh_token');
```

#### 3. Set Expired Token
```javascript
// Di browser console
// Token dengan exp di masa lalu
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImV4cCI6MTYwMDAwMDAwMH0.xxx';
localStorage.setItem('access_token', expiredToken);
```

#### 4. Trigger Auto-Logout
Setelah manipulasi token, lakukan salah satu action berikut:
- Navigate ke halaman lain
- Edit task
- Upload file
- Refresh halaman
- Click button yang melakukan API call

### **Method 3: Wait for Natural Token Expiry**

JWT token biasanya expired setelah beberapa waktu (default 1 jam). Tunggu sampai token expired secara natural, lalu lakukan action apapun.

## 📊 **Expected Behavior**

### ✅ **Success Scenario: Token Refreshed**
```
User Action
  ↓
API Error 401
  ↓
Console: ⚠️ Received 401 Unauthorized. Attempting token refresh...
  ↓
Console: 🔄 Refreshing access token...
  ↓
Console: ✅ Access token refreshed successfully
  ↓
Console: 🔄 Retrying original request...
  ↓
Request SUCCESS
  ↓
User tetap login ✅
```

### ❌ **Logout Scenario: Refresh Failed**
```
User Action
  ↓
API Error 401
  ↓
Console: ⚠️ Received 401 Unauthorized. Attempting token refresh...
  ↓
Console: 🔄 Refreshing access token...
  ↓
Console: ❌ Token refresh failed
  ↓
Console: 🚪 Performing auto-logout: Refresh failed
  ↓
Redirect to /login?reason=xxx
  ↓
⚠️ Warning Alert: "Token tidak valid atau telah expired. Silakan login kembali."
```

## 🔍 **Monitoring di Console**

Ketika auto-logout terpicu, Anda akan melihat log seperti ini di console:

### Case 1: No Refresh Token
```
🔍 API Error Intercepted: {status: 401, url: '/api/tasks', hasRetried: false}
⚠️ Received 401 Unauthorized. Attempting token refresh...
📍 Request URL: /api/tasks
📍 Request Method: get
❌ No refresh token available
🚪 Performing auto-logout: No refresh token
🚪 Logging out user. Reason: Sesi Anda telah berakhir. Silakan login kembali.
```

### Case 2: Refresh Token Failed
```
🔍 API Error Intercepted: {status: 401, url: '/api/tasks', hasRetried: false}
⚠️ Received 401 Unauthorized. Attempting token refresh...
📍 Request URL: /api/tasks
📍 Request Method: get
🔄 Refreshing access token...
📍 Refresh URL: http://localhost:9553/api/auth/refresh-token
❌ Token refresh failed: {message: "Invalid refresh token"}
🚪 Performing auto-logout: Refresh failed
🚪 Logging out user. Reason: Token tidak valid atau telah expired. Silakan login kembali.
```

### Case 3: Token Refreshed Successfully
```
🔍 API Error Intercepted: {status: 401, url: '/api/tasks', hasRetried: false}
⚠️ Received 401 Unauthorized. Attempting token refresh...
📍 Request URL: /api/tasks
📍 Request Method: get
🔄 Refreshing access token...
📍 Refresh URL: http://localhost:9553/api/auth/refresh-token
✅ Access token refreshed successfully
🔄 Retrying original request...
```

## 🐛 **Troubleshooting**

### Problem: Auto-logout tidak terpicu

**Check 1: Apakah API mengirim 401?**
```javascript
// Di console, lihat network tab
// Filter by "401"
// Pastikan ada response dengan status 401
```

**Check 2: Apakah interceptor berjalan?**
```javascript
// Lihat console log
// Harusnya ada: "🔍 API Error Intercepted"
```

**Check 3: Apakah URL refresh token benar?**
```javascript
// Lihat console log
// Harusnya: http://localhost:9553/api/auth/refresh-token
// Bukan: http://localhost:9553/api/api/auth/refresh-token (double /api)
```

### Problem: Infinite redirect loop

**Solution:**
```javascript
// Clear localStorage
localStorage.clear();
sessionStorage.clear();

// Reload page
window.location.reload();
```

### Problem: Token tidak expired meskipun sudah lama

**Solution:**
```javascript
// Manually set expired token
window.testExpiredToken();

// Atau force logout
window.forceLogout();
```

## 📱 **Testing Checklist**

- [ ] Test dengan invalid token → Harus logout
- [ ] Test dengan no refresh token → Harus logout
- [ ] Test dengan expired token → Harus logout  
- [ ] Test dengan valid token yang di-refresh → Harus tetap login
- [ ] Test logout reason ditampilkan di login page
- [ ] Test redirect ke halaman sebelumnya setelah login
- [ ] Test di berbagai halaman (dashboard, tasks, projects, etc)
- [ ] Test di berbagai action (CRUD, navigation, etc)
- [ ] Test network error tidak trigger auto-logout
- [ ] Test 403 Forbidden tidak trigger auto-logout

## 🎯 **Expected Results**

### ✅ **Harus Logout:**
- Token invalid
- Token expired & refresh failed
- No refresh token
- Refresh token expired
- 401 setelah retry

### ✅ **Tidak Boleh Logout:**
- Network error (ECONNREFUSED)
- 403 Forbidden
- 500 Internal Server Error
- Timeout error
- Token expired tapi refresh berhasil

## 📝 **Notes**

1. **Development Mode**: Testing utilities otomatis loaded
2. **Production Mode**: Testing utilities tidak included
3. **Console Logging**: Enhanced logging hanya untuk debugging
4. **Token Validation**: Check token expiry sebelum request
5. **Redirect**: URL sebelumnya disimpan untuk redirect setelah login
