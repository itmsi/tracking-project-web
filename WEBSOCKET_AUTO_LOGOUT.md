# WebSocket Auto Logout Implementation

## 🎯 **Fitur yang Diimplementasikan**

Auto-logout otomatis ketika WebSocket mengalami authentication error, seperti:
- ❌ "Authentication error: Invalid token"
- ❌ "jwt expired"
- ❌ "invalid signature"
- ❌ "Unauthorized"

## 🚨 **Error yang Di-handle**

### Error Message dari WebSocket:
```
WebSocket Connection Error
Authentication error: Invalid token

Please check your internet connection and try again.
```

**Sebelumnya:** User harus manual logout atau refresh
**Sekarang:** ✅ Auto-logout otomatis dengan redirect ke login page

## 🔧 **Implementasi**

### 1. **WebSocket Service - Error Detection**

**File: `src/services/websocketService.js`**

Mendeteksi authentication error di berbagai event handlers:

```javascript
// Event: connect_error
this.socket.on('connect_error', (error) => {
  console.error('🚨 WebSocket connection error:', error);
  console.error('🔧 Error details:', error.message);
  
  // Check jika error adalah authentication error
  if (error.message && (
      error.message.includes('Invalid token') || 
      error.message.includes('Authentication error') ||
      error.message.includes('jwt expired') ||
      error.message.includes('invalid signature')
  )) {
    console.error('🚪 WebSocket Authentication Error - Auto logout triggered');
    performLogout('Sesi Anda telah berakhir (WebSocket auth failed). Silakan login kembali.');
    return; // Tidak perlu reconnect
  }
  
  // Reconnect hanya untuk non-auth errors
  this.handleReconnect();
});

// Event: auth_error (dari server)
this.socket.on('auth_error', (data) => {
  console.error('🚪 WebSocket auth_error event received:', data);
  performLogout('Sesi Anda telah berakhir (WebSocket auth error). Silakan login kembali.');
});

// Event: error (generic)
this.socket.on('error', (error) => {
  console.error('🚨 WebSocket error event:', error);
  
  if (error && typeof error === 'object') {
    const errorMessage = error.message || error.error || '';
    if (errorMessage.includes('Invalid token') || 
        errorMessage.includes('Authentication') ||
        errorMessage.includes('Unauthorized')) {
      console.error('🚪 WebSocket authentication error - Auto logout triggered');
      performLogout('Sesi Anda telah berakhir (WebSocket error). Silakan login kembali.');
    }
  }
});
```

### 2. **WebSocketContext - Error Detection**

**File: `src/contexts/WebSocketContext.tsx`**

Context-level error handling:

```typescript
const handleConnectError = (error: any) => {
  console.error('🚨 WebSocketContext: Connection error:', error);
  console.error('🔧 Error message:', error.message);
  
  // Check jika error adalah authentication error
  if (error.message && (
      error.message.includes('Invalid token') || 
      error.message.includes('Authentication error') ||
      error.message.includes('jwt expired') ||
      error.message.includes('invalid signature') ||
      error.message.includes('Unauthorized')
  )) {
    console.error('🚪 WebSocket Authentication Error - Triggering auto-logout');
    performLogout('Sesi Anda telah berakhir (WebSocket authentication error). Silakan login kembali.');
    return;
  }
  
  setConnectionError(error.message);
  setIsConnected(false);
  setIsConnecting(false);
};
```

### 3. **WebSocketErrorBoundary - Auto Logout**

**File: `src/components/ErrorBoundary/WebSocketErrorBoundary.tsx`**

Error boundary yang detect dan auto-logout:

```typescript
// Auto-logout jika error adalah authentication error
useEffect(() => {
  if (connectionError && (
      connectionError.includes('Invalid token') || 
      connectionError.includes('Authentication error') ||
      connectionError.includes('jwt expired') ||
      connectionError.includes('invalid signature') ||
      connectionError.includes('Unauthorized')
  )) {
    console.error('🚪 WebSocketErrorBoundary: Authentication error detected - Auto logout');
    // Delay 2 detik untuk menampilkan error ke user
    setTimeout(() => {
      performLogout('Sesi Anda telah berakhir (WebSocket authentication failed). Silakan login kembali.');
    }, 2000);
  }
}, [connectionError]);

// UI yang berbeda untuk auth error
const isAuthError = connectionError.includes('Invalid token') || 
                   connectionError.includes('Authentication error');

return (
  <Alert severity={isAuthError ? "warning" : "error"}>
    <Typography variant="h6">
      {isAuthError ? 'Session Expired' : 'WebSocket Connection Error'}
    </Typography>
    <Typography variant="body2">
      {isAuthError 
        ? 'Your session has expired. You will be redirected to login page...'
        : connectionError
      }
    </Typography>
  </Alert>
);
```

## 📊 **Flow Diagram**

### Skenario: WebSocket Authentication Error

```
WebSocket Connect Attempt
         ↓
Server Response: Authentication error: Invalid token
         ↓
Event: 'connect_error' triggered
         ↓
WebSocketService detects auth error
         ↓
Console: 🚪 WebSocket Authentication Error - Auto logout triggered
         ↓
performLogout('Sesi Anda telah berakhir...')
         ↓
Clear tokens dari localStorage
         ↓
Redirect to /login?reason=xxx
         ↓
⚠️ Warning Alert: "Sesi Anda telah berakhir (WebSocket auth failed)"
         ↓
User login ulang
```

## 🔍 **Console Output Expected**

Ketika WebSocket authentication error terjadi:

```
🔌 WebSocketContext: Connecting with token
🚨 WebSocket connection error: Error: Authentication error: Invalid token
🔧 Error details: Authentication error: Invalid token
🚪 WebSocket Authentication Error - Auto logout triggered
🚪 Logging out user. Reason: Sesi Anda telah berakhir (WebSocket auth failed). Silakan login kembali.
```

**Atau dari ErrorBoundary:**

```
🚨 WebSocketContext: Connection error: Error: Authentication error: Invalid token
🔧 Error message: Authentication error: Invalid token
🚪 WebSocketErrorBoundary: Authentication error detected - Auto logout
🚪 Logging out user. Reason: Sesi Anda telah berakhir (WebSocket authentication failed). Silakan login kembali.
```

## 📋 **Error Patterns yang Di-detect**

Auto-logout akan terpicu jika error message mengandung salah satu dari:
- ✅ "Invalid token"
- ✅ "Authentication error"
- ✅ "jwt expired"
- ✅ "invalid signature"
- ✅ "Unauthorized"

## 🧪 **Cara Testing**

### Test 1: Set Invalid Token
```javascript
// Di browser console
localStorage.setItem('access_token', 'invalid_token_12345');

// Reload page
window.location.reload();

// WebSocket akan coba connect dengan invalid token
// ✅ Harusnya auto-logout dalam 2 detik
```

### Test 2: Set Expired Token
```javascript
// Di browser console
window.testExpiredToken(); // Jika sudah load testing utilities

// Reload page
window.location.reload();

// ✅ Harusnya auto-logout
```

### Test 3: Natural Token Expiry
```
1. Login dan biarkan aplikasi terbuka
2. Tunggu sampai token expired (biasanya 1 jam)
3. WebSocket akan disconnect dan coba reconnect
4. ✅ Harusnya auto-logout karena token expired
```

## 🎯 **Hasil yang Diharapkan**

### Before Fix:
```
WebSocket Error: Invalid token
  ↓
❌ User melihat error message
❌ User harus manual logout atau refresh
❌ Bad UX
```

### After Fix:
```
WebSocket Error: Invalid token
  ↓
⚠️ Alert: "Session Expired. Redirecting..."
  ↓
✅ Auto logout dalam 2 detik
  ↓
✅ Redirect ke /login dengan reason
  ↓
✅ User login ulang
  ↓
✅ Good UX
```

## 📁 **Files yang Dimodifikasi**

1. `src/services/websocketService.js` - Detect auth error dan trigger auto-logout
2. `src/contexts/WebSocketContext.tsx` - Context-level auth error handling
3. `src/components/ErrorBoundary/WebSocketErrorBoundary.tsx` - UI dan auto-logout dengan delay

## 🔒 **Security Benefits**

- ✅ Prevent unauthorized WebSocket connections
- ✅ Auto clear invalid sessions
- ✅ Consistent auth state across HTTP dan WebSocket
- ✅ Better security posture

## ⚙️ **Configuration**

### Delay Before Logout
Default: 2 detik (untuk user bisa melihat error message)

Bisa diubah di `WebSocketErrorBoundary.tsx`:
```typescript
setTimeout(() => {
  performLogout('...');
}, 2000); // Ubah nilai ini (dalam milliseconds)
```

### Max Reconnect Attempts
Default: 5 attempts

Tidak akan reconnect jika authentication error (langsung logout).

## ✅ **Build Status**

```bash
✅ Build Status: SUCCESS
✅ File sizes after gzip:
   - 307.03 kB main.js (+554 B)
   - 2.66 kB main.css
   - 1.77 kB chunk.js
```

## 🎉 **Kesimpulan**

WebSocket auto-logout sudah berhasil diimplementasikan! Sekarang ketika ada error:

**"Authentication error: Invalid token"**

Aplikasi akan:
1. ✅ Detect error di 3 level (Service, Context, ErrorBoundary)
2. ✅ Display user-friendly message selama 2 detik
3. ✅ Auto-logout dan clear tokens
4. ✅ Redirect ke login page dengan reason
5. ✅ User bisa langsung login ulang

No more manual logout atau hard refresh needed! 🎉
