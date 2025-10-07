import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9552/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
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

// Response interceptor untuk handle error dan refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired (401) dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request dengan token baru
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Jika refresh token gagal, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      // Backend tidak tersedia
      console.error('Backend API tidak tersedia. Pastikan backend berjalan di port 9552');
      // Bisa menampilkan notifikasi ke user
    }
    
    return Promise.reject(error);
  }
);

export default api;
