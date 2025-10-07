/**
 * Error handler utility untuk menangani error dari API
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Toast notification helper
 */
export const showErrorToast = (error: any): void => {
  const message = handleApiError(error);
  // Implementasi toast library (react-toastify, etc)
  alert(message); // Fallback ke alert untuk sementara
};

export const showSuccessToast = (message: string): void => {
  // Implementasi toast library
  alert(message); // Fallback ke alert untuk sementara
};

/**
 * Format error untuk display di UI
 */
export const formatError = (error: any): string => {
  const message = handleApiError(error);
  
  // Format pesan error agar lebih user-friendly
  if (message.includes('Network Error')) {
    return 'Koneksi bermasalah. Periksa koneksi internet Anda.';
  } else if (message.includes('timeout')) {
    return 'Request timeout. Silakan coba lagi.';
  } else if (message.includes('ECONNREFUSED')) {
    return 'Server tidak tersedia. Silakan coba lagi nanti.';
  }
  
  return message;
};

/**
 * Log error untuk debugging
 */
export const logError = (error: any, context?: string): void => {
  const timestamp = new Date().toISOString();
  const errorMessage = handleApiError(error);
  
  console.error(`[${timestamp}] ${context || 'Error'}:`, {
    message: errorMessage,
    originalError: error,
    stack: error.stack,
  });
};
