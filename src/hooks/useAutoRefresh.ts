import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchTasks, forceRefresh } from '../store/taskSlice';

interface UseAutoRefreshOptions {
  interval?: number; // dalam milliseconds
  enabled?: boolean;
  params?: any;
}

/**
 * Hook untuk auto-refresh data secara berkala
 * Berguna untuk memastikan data selalu terbaru
 */
export const useAutoRefresh = (options: UseAutoRefreshOptions = {}) => {
  const { interval = 30000, enabled = true, params = {} } = options;
  const dispatch = useDispatch<AppDispatch>();

  const refreshData = useCallback(() => {
    if (enabled) {
      dispatch(forceRefresh());
      dispatch(fetchTasks(params));
    }
  }, [dispatch, enabled, params]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(refreshData, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshData, interval, enabled]);

  return {
    refreshData,
  };
};

/**
 * Hook untuk manual refresh dengan debounce
 */
export const useManualRefresh = (delay: number = 1000) => {
  const dispatch = useDispatch<AppDispatch>();

  const refreshWithDebounce = useCallback(
    debounce((params: any = {}) => {
      dispatch(forceRefresh());
      dispatch(fetchTasks(params));
    }, delay),
    [dispatch, delay]
  );

  return {
    refreshWithDebounce,
  };
};

/**
 * Utility function untuk debounce
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
