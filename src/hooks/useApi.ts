import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = <T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for API calls with manual trigger
 */
export const useApiCall = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

/**
 * Custom hook for paginated API calls
 */
export const usePaginatedApi = <T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; pagination: any }>,
  initialPage: number = 1,
  initialLimit: number = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number, limit: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(page, limit);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const goToPage = useCallback((page: number) => {
    fetchData(page, pagination.limit);
  }, [fetchData, pagination.limit]);

  const changeLimit = useCallback((limit: number) => {
    fetchData(1, limit);
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(pagination.page, pagination.limit);
  }, [fetchData, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData(initialPage, initialLimit);
  }, [fetchData, initialPage, initialLimit]);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    changeLimit,
    refresh,
  };
};

/**
 * Custom hook for infinite scroll API calls
 */
export const useInfiniteApi = <T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; pagination: any }>,
  initialLimit: number = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (page: number, limit: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const result = await apiFunction(page, limit);
      
      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      
      setPagination(result.pagination);
      setHasMore(result.pagination.page < result.pagination.pages);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [apiFunction]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchData(pagination.page + 1, pagination.limit, true);
    }
  }, [fetchData, hasMore, loadingMore, pagination.page, pagination.limit]);

  const refresh = useCallback(() => {
    setData([]);
    setPagination(prev => ({ ...prev, page: 1 }));
    setHasMore(true);
    fetchData(1, pagination.limit);
  }, [fetchData, pagination.limit]);

  useEffect(() => {
    fetchData(1, initialLimit);
  }, [fetchData, initialLimit]);

  return {
    data,
    pagination,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
