import axios from 'axios';
import { addCacheBustingToConfig } from '../utils/cacheBusting';
import { performLogout } from '../utils/authUtils';

// Base URL tanpa /api suffix, karena semua endpoint sudah include /api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9553';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Mencegah browser cache dengan validateStatus
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
});

// Request interceptor untuk menambahkan token dan cache busting
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Tambahkan cache busting yang aman (tanpa header yang bermasalah)
    return addCacheBustingToConfig(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error dan refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log('🔍 API Error Intercepted:', {
      status: error.response?.status,
      url: originalRequest?.url,
      hasRetried: originalRequest?._retry
    });

    // Jika token expired atau invalid (401) dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn('⚠️ Received 401 Unauthorized. Attempting token refresh...');
      console.log('📍 Request URL:', originalRequest.url);
      console.log('📍 Request Method:', originalRequest.method);

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          console.error('❌ No refresh token available');
          console.log('🚪 Performing auto-logout: No refresh token');
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
          return Promise.reject(error);
        }

        console.log('🔄 Refreshing access token...');
        console.log('📍 Refresh URL:', `${API_BASE_URL}/api/auth/refresh-token`);
        
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);
        console.log('✅ Access token refreshed successfully');

        // Retry original request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        console.log('🔄 Retrying original request...');
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        console.log('🚪 Performing auto-logout: Refresh failed');
        
        // Jika refresh token gagal, logout user
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          performLogout('Token tidak valid atau telah expired. Silakan login kembali.');
        } else {
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401 && originalRequest._retry) {
      // Sudah di-retry tapi masih 401
      console.error('❌ 401 after retry. Performing auto-logout.');
      performLogout('Token tidak valid. Silakan login kembali.');
      return Promise.reject(error);
    } 
    
    // Handle 403 Forbidden (token valid tapi tidak ada permission)
    if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden: Anda tidak memiliki akses ke resource ini');
      // Tidak perlu logout, hanya tampilkan error
    }
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('❌ Backend API tidak tersedia. Pastikan backend berjalan di port 9553');
    }
    
    return Promise.reject(error);
  }
);

// Method khusus untuk force refresh tanpa cache busting parameter
export const forceRefreshApi = axios.create({
  baseURL: API_BASE_URL, // Same as main api (without /api suffix)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk force refresh (tanpa cache busting parameter)
forceRefreshApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk force refresh
forceRefreshApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired atau invalid (401) dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);

        // Retry original request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return forceRefreshApi(originalRequest);
      } catch (refreshError: any) {
        // Jika refresh token gagal, logout user
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          performLogout('Token tidak valid atau telah expired. Silakan login kembali.');
        } else {
          performLogout('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('❌ Backend API tidak tersedia. Pastikan backend berjalan di port 9553');
    }
    
    return Promise.reject(error);
  }
);

export default api;
