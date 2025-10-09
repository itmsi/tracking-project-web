# Auto Logout Implementation Documentation

## 🎯 **Fitur yang Diimplementasikan**

Sistem auto-logout otomatis yang akan mengeluarkan user dari aplikasi ketika:
- Token access expired atau invalid (401)
- Refresh token gagal atau expired
- Session tidak valid

## 🔧 **Implementasi**

### 1. **Auth Utility Functions**

**File Baru: `src/utils/authUtils.ts`**

Utility functions untuk handle authentication:

```typescript
// Logout user dengan reason
export const performLogout = (reason?: string) => {
  // Log reason untuk debugging
  console.log(`🚪 Logging out user. Reason: ${reason}`);

  // Clear tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  
  // Save current URL untuk redirect setelah login
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/login') {
    sessionStorage.setItem('redirect_after_login', currentPath);
  }
  
  // Redirect ke login dengan reason
  window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
};

// Check token validity
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now < expiry;
  } catch (error) {
    return false;
  }
};

// Check authentication status
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token') && isTokenValid();
};

// Get redirect URL setelah login
export const getRedirectAfterLogin = (): string => {
  const redirectUrl = sessionStorage.getItem('redirect_after_login');
  sessionStorage.removeItem('redirect_after_login');
  return redirectUrl || '/dashboard';
};
```

### 2. **Enhanced API Interceptor**

**File: `src/services/api.ts`**

Axios interceptor dengan auto-logout mechanism:

```typescript
// Response interceptor untuk handle error dan refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired atau invalid (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn('⚠️ Received 401 Unauthorized. Attempting token refresh...');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          console.error('❌ No refresh token available');
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
          return Promise.reject(error);
        }

        console.log('🔄 Refreshing access token...');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);
        console.log('✅ Access token refreshed successfully');

        // Retry request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
        
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed');
        
        // Auto logout jika refresh gagal
        if (refreshError.response?.status === 401 || 
            refreshError.response?.status === 403) {
          performLogout('Token tidak valid atau telah expired. Silakan login kembali.');
        } else {
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 3. **Enhanced Login Page**

**File: `src/components/auth/Login.tsx`**

Login page dengan:
- Display logout reason
- Auto redirect ke halaman sebelumnya setelah login

```typescript
const Login: React.FC = () => {
  const location = useLocation();
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  // Check untuk logout reason dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reason = params.get('reason');
    if (reason) {
      setLogoutReason(decodeURIComponent(reason));
      window.history.replaceState({}, '', '/login');
    }
  }, [location]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLogoutReason(null);
      await dispatch(login(data)).unwrap();
      
      // Redirect ke halaman sebelumnya atau dashboard
      const redirectUrl = getRedirectAfterLogin();
      navigate(redirectUrl);
    } catch (err: any) {
      setSubmitError(err || 'Login gagal');
    }
  };

  return (
    <CardContent sx={{ p: 4 }}>
      {/* Alert untuk logout reason */}
      {logoutReason && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setLogoutReason(null)}>
          {logoutReason}
        </Alert>
      )}
      
      {/* Form login */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ... */}
      </form>
    </CardContent>
  );
};
```

## 📋 **Skenario Auto Logout**

### Skenario 1: Access Token Expired
```
User melakukan request
  ↓
API response: 401 Unauthorized
  ↓
Frontend coba refresh token
  ↓
Refresh token berhasil
  ↓
✅ Request di-retry dengan token baru (User tetap login)
```

### Skenario 2: Refresh Token Expired
```
User melakukan request
  ↓
API response: 401 Unauthorized
  ↓
Frontend coba refresh token
  ↓
Refresh token gagal (401/403)
  ↓
❌ Auto logout ke /login?reason=Token+tidak+valid
  ↓
User melihat warning message
  ↓
User login ulang
  ↓
✅ Redirect ke halaman sebelumnya
```

### Skenario 3: No Refresh Token
```
User melakukan request
  ↓
API response: 401 Unauthorized
  ↓
Frontend check refresh token
  ↓
Tidak ada refresh token
  ↓
❌ Auto logout langsung
  ↓
User harus login ulang
```

## 🎨 **User Experience**

### Before Auto Logout:
- ❌ Request gagal tanpa feedback
- ❌ User bingung kenapa tidak bisa akses
- ❌ Harus manual refresh atau logout
- ❌ Kehilangan context halaman yang sedang dibuka

### After Auto Logout:
- ✅ Warning message yang jelas: "Sesi Anda telah berakhir"
- ✅ Auto redirect ke login
- ✅ Simpan URL halaman sebelumnya
- ✅ Setelah login, kembali ke halaman yang sama
- ✅ Smooth UX tanpa kehilangan context

## 📊 **Flow Diagram**

```
┌─────────────────────────────────────────┐
│  User melakukan action (API request)   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     API Response: 401 Unauthorized      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│    Check: Ada refresh token?            │
└────────┬───────────────────┬────────────┘
         │ NO                │ YES
         │                   │
         ▼                   ▼
   ┌─────────┐      ┌────────────────┐
   │ Logout  │      │ Refresh Token  │
   └─────────┘      └────┬───────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
             SUCCESS            FAILED
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────┐
        │ Retry Request│    │  Logout  │
        └──────────────┘    └──────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ /login?reason=xxx     │
                       └───────────────────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Show Warning Alert    │
                       └───────────────────────┘
```

## 🧪 **Cara Testing**

### Test 1: Token Expired Manually
```bash
# Di browser console:
localStorage.setItem('access_token', 'invalid_token');

# Lakukan action apa saja (navigasi, edit data, dll)
# ✅ Harus otomatis logout dan redirect ke /login
# ✅ Harus muncul warning: "Token tidak valid atau telah expired"
```

### Test 2: No Refresh Token
```bash
# Di browser console:
localStorage.removeItem('refresh_token');

# Tunggu sampai access token expired atau manipulasi
# Lakukan action
# ✅ Harus otomatis logout
# ✅ Harus muncul warning: "Sesi Anda telah berakhir"
```

### Test 3: Redirect After Login
```bash
# Buka halaman: /tasks/some-id
# Logout atau token expired
# ✅ Harus redirect ke /login
# Login ulang
# ✅ Harus kembali ke /tasks/some-id
```

## ✅ **Hasil Build**

```bash
✅ Build Status: SUCCESS
✅ File sizes after gzip:
   - 306.27 kB main.js (+591 B)
   - 2.66 kB main.css
   - 1.77 kB chunk.js
```

## 📁 **Files yang Dimodifikasi**

1. **File Baru:**
   - `src/utils/authUtils.ts` - Auth utility functions

2. **File Modified:**
   - `src/services/api.ts` - Enhanced interceptor dengan auto-logout
   - `src/components/auth/Login.tsx` - Display logout reason & redirect

## 🔒 **Security Benefits**

- ✅ Auto clear tokens ketika invalid
- ✅ Prevent unauthorized access
- ✅ Clear session data saat logout
- ✅ Token validation sebelum request
- ✅ Secure token refresh mechanism

## 🎉 **Kesimpulan**

Implementasi auto-logout sudah selesai dengan fitur:
- ✅ Auto logout ketika token invalid/expired
- ✅ Attempt refresh token sebelum logout
- ✅ Display warning message yang jelas
- ✅ Save dan restore URL setelah login
- ✅ Comprehensive logging untuk debugging
- ✅ Better user experience

User sekarang tidak perlu manual logout atau refresh ketika session expired!
