/**
 * Utility functions untuk cache busting yang aman
 * Menghindari CORS issues dengan tidak menggunakan header yang bermasalah
 */

/**
 * Menambahkan cache busting parameter ke URL
 */
export const addCacheBustingParam = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

/**
 * Menambahkan cache busting parameter ke axios config
 * SEMENTARA DINONAKTIFKAN untuk menghindari CORS issues
 */
export const addCacheBustingToConfig = (config: any): any => {
  // Sementara dinonaktifkan untuk menghindari CORS issues
  // if (config.method === 'get' && shouldUseCacheBusting(config.url || '')) {
  //   config.params = {
  //     ...config.params,
  //     _t: Date.now(),
  //   };
  // }
  return config;
};

/**
 * Menentukan endpoint mana yang perlu cache busting
 * SEMENTARA DINONAKTIFKAN untuk menghindari CORS issues
 */
// const shouldUseCacheBusting = (url: string): boolean => {
//   const cacheBustingEndpoints = [
//     '/api/tasks',
//     '/api/notifications',
//     '/api/projects',
//     '/api/teams',
//     '/api/auth/me'
//   ];
//   
//   return cacheBustingEndpoints.some(endpoint => url.includes(endpoint));
// };

/**
 * Membuat axios config dengan cache busting
 */
export const createCacheBustingConfig = (baseConfig: any = {}): any => {
  return {
    ...baseConfig,
    // Mencegah browser cache tanpa menggunakan header yang bermasalah
    headers: {
      ...baseConfig.headers,
      // Tidak menggunakan Cache-Control header untuk menghindari CORS
    },
    // Tambahkan timestamp untuk cache busting
    params: {
      ...baseConfig.params,
      _t: Date.now(),
    }
  };
};

/**
 * Force refresh dengan cache busting
 */
export const forceRefreshWithCacheBusting = async (apiCall: () => Promise<any>): Promise<any> => {
  // Clear any potential cache
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
  
  // Execute API call
  return apiCall();
};
