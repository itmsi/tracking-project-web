/**
 * Utility untuk testing auto-logout
 * Gunakan di browser console untuk test berbagai skenario
 */

/**
 * Test 1: Set token invalid
 * Panggil di console: window.testInvalidToken()
 */
export const testInvalidToken = () => {
  console.log('🧪 Testing: Setting invalid token...');
  localStorage.setItem('access_token', 'invalid_token_12345');
  console.log('✅ Invalid token set. Refresh halaman atau lakukan action untuk trigger auto-logout.');
};

/**
 * Test 2: Remove refresh token
 * Panggil di console: window.testNoRefreshToken()
 */
export const testNoRefreshToken = () => {
  console.log('🧪 Testing: Removing refresh token...');
  localStorage.removeItem('refresh_token');
  console.log('✅ Refresh token removed. Token akan expired dan auto-logout akan terpicu.');
};

/**
 * Test 3: Set expired token
 * Panggil di console: window.testExpiredToken()
 */
export const testExpiredToken = () => {
  console.log('🧪 Testing: Setting expired token...');
  // Token dengan exp yang sudah lewat
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImV4cCI6MTYwMDAwMDAwMH0.xxx';
  localStorage.setItem('access_token', expiredToken);
  console.log('✅ Expired token set. Lakukan action untuk trigger auto-logout.');
};

/**
 * Test 4: Check current token status
 * Panggil di console: window.checkTokenStatus()
 */
export const checkTokenStatus = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('📊 Token Status:');
  console.log('Access Token:', accessToken ? '✅ Present' : '❌ Missing');
  console.log('Refresh Token:', refreshToken ? '✅ Present' : '❌ Missing');
  
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const isExpired = now >= exp;
      
      console.log('Token Expiry:', new Date(exp * 1000).toLocaleString());
      console.log('Is Expired:', isExpired ? '❌ YES' : '✅ NO');
      console.log('Time until expiry:', Math.floor((exp - now) / 60), 'minutes');
    } catch (error) {
      console.error('❌ Error parsing token:', error);
    }
  }
};

/**
 * Test 5: Force logout
 * Panggil di console: window.forceLogout()
 */
export const forceLogout = () => {
  console.log('🚪 Forcing logout...');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login?reason=Manual+logout+for+testing';
};

// Export ke window untuk debugging
if (typeof window !== 'undefined') {
  (window as any).testInvalidToken = testInvalidToken;
  (window as any).testNoRefreshToken = testNoRefreshToken;
  (window as any).testExpiredToken = testExpiredToken;
  (window as any).checkTokenStatus = checkTokenStatus;
  (window as any).forceLogout = forceLogout;
  
  console.log(`
🧪 Auto-Logout Testing Utilities Loaded!

Gunakan fungsi berikut di console untuk testing:

1. window.checkTokenStatus()    - Check status token saat ini
2. window.testInvalidToken()    - Set token invalid
3. window.testNoRefreshToken()  - Remove refresh token
4. window.testExpiredToken()    - Set expired token
5. window.forceLogout()         - Force logout manual

Setelah memanggil test function, lakukan action seperti:
- Navigate ke halaman lain
- Edit task
- Refresh halaman
- Dll untuk trigger auto-logout
  `);
}
