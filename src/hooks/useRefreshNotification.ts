import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchTasks, forceRefresh } from '../store/taskSlice';

interface UseRefreshNotificationOptions {
  showNotification?: boolean;
  params?: any;
}

/**
 * Hook untuk menangani refresh dengan notifikasi
 */
export const useRefreshNotification = (options: UseRefreshNotificationOptions = {}) => {
  const { showNotification = true, params = {} } = options;
  const dispatch = useDispatch<AppDispatch>();

  const refreshWithNotification = useCallback(async () => {
    try {
      // Reset state dan force refetch
      dispatch(forceRefresh());
      await dispatch(fetchTasks(params)).unwrap();
      
      if (showNotification) {
        // Tampilkan notifikasi sukses
        console.log('✅ Data berhasil di-refresh');
        
        // Bisa diganti dengan toast notification jika ada library toast
        // toast.success('Data berhasil di-refresh');
      }
    } catch (error) {
      console.error('❌ Gagal refresh data:', error);
      
      if (showNotification) {
        // Tampilkan notifikasi error
        console.error('Gagal refresh data. Silakan coba lagi.');
        
        // Bisa diganti dengan toast notification jika ada library toast
        // toast.error('Gagal refresh data. Silakan coba lagi.');
      }
    }
  }, [dispatch, params, showNotification]);

  return {
    refreshWithNotification,
  };
};

/**
 * Hook untuk menangani refresh dengan loading state
 */
export const useRefreshWithLoading = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshWithLoading = useCallback(async (params: any = {}) => {
    setIsRefreshing(true);
    try {
      dispatch(forceRefresh());
      await dispatch(fetchTasks(params)).unwrap();
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  return {
    refreshWithLoading,
    isRefreshing,
  };
};
