/**
 * Auth utility functions untuk handle authentication dan logout
 */

/**
 * Logout user dan clear semua data
 */
export const performLogout = (reason?: string) => {
  // Log alasan logout untuk debugging
  if (reason) {
    console.log(`🚪 Logging out user. Reason: ${reason}`);
  } else {
    console.log('🚪 Logging out user');
  }

  // Clear tokens dari localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // Clear user data jika ada
  localStorage.removeItem('user');
  
  // Clear Redux state jika ada
  // Bisa dipanggil dari redux action untuk clear state
  
  // Redirect ke login page
  const currentPath = window.location.pathname;
  const isAlreadyOnLogin = currentPath === '/login';
  
  if (!isAlreadyOnLogin) {
    // Simpan current URL untuk redirect setelah login
    if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register') {
      sessionStorage.setItem('redirect_after_login', currentPath);
    }
    
    // Redirect ke login dengan reason
    if (reason) {
      window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
    } else {
      window.location.href = '/login';
    }
  }
};

/**
 * Check apakah token masih valid
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT token untuk check expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    
    if (!expiry) {
      return false;
    }
    
    // Check if token expired
    const now = Math.floor(Date.now() / 1000);
    if (now >= expiry) {
      console.warn('⚠️ Token has expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error parsing token:', error);
    return false;
  }
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (): number | null => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    return null;
  }
};

/**
 * Check apakah user sudah login
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token') && isTokenValid();
};

/**
 * Get redirect URL setelah login
 */
export const getRedirectAfterLogin = (): string => {
  const redirectUrl = sessionStorage.getItem('redirect_after_login');
  sessionStorage.removeItem('redirect_after_login');
  return redirectUrl || '/dashboard';
};
