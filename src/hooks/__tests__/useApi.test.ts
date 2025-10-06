import { renderHook, act } from '@testing-library/react';
import { useApi, useApiCall, usePaginatedApi, useInfiniteApi } from '../useApi';

// Mock API functions
const mockApiFunction = jest.fn();
const mockPaginatedApiFunction = jest.fn();
const mockInfiniteApiFunction = jest.fn();

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    mockApiFunction.mockResolvedValue('test data');
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data successfully', async () => {
    const testData = 'test data';
    mockApiFunction.mockResolvedValue(testData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.data).toBe(testData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API error', async () => {
    const errorMessage = 'API Error';
    mockApiFunction.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should refetch data when refetch is called', async () => {
    const testData = 'test data';
    mockApiFunction.mockResolvedValue(testData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
    
    await act(async () => {
      result.current.refetch();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockApiFunction).toHaveBeenCalledTimes(2);
  });
});

describe('useApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useApiCall());
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute API call successfully', async () => {
    const testData = 'test data';
    mockApiFunction.mockResolvedValue(testData);
    
    const { result } = renderHook(() => useApiCall());
    
    await act(async () => {
      await result.current.execute(mockApiFunction);
    });
    
    expect(result.current.data).toBe(testData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API error', async () => {
    const errorMessage = 'API Error';
    mockApiFunction.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useApiCall());
    
    await act(async () => {
      try {
        await result.current.execute(mockApiFunction);
      } catch (error) {
        // Expected to throw
      }
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useApiCall());
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

describe('usePaginatedApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    mockPaginatedApiFunction.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    
    const { result } = renderHook(() => usePaginatedApi(mockPaginatedApiFunction));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch paginated data successfully', async () => {
    const testData = ['item1', 'item2'];
    const testPagination = { page: 1, limit: 10, total: 20, pages: 2 };
    
    mockPaginatedApiFunction.mockResolvedValue({
      data: testData,
      pagination: testPagination,
    });
    
    const { result } = renderHook(() => usePaginatedApi(mockPaginatedApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.data).toEqual(testData);
    expect(result.current.pagination).toEqual(testPagination);
    expect(result.current.loading).toBe(false);
  });

  it('should go to specific page', async () => {
    mockPaginatedApiFunction.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    
    const { result } = renderHook(() => usePaginatedApi(mockPaginatedApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      result.current.goToPage(2);
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockPaginatedApiFunction).toHaveBeenCalledWith(2, 10);
  });

  it('should change limit', async () => {
    mockPaginatedApiFunction.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    
    const { result } = renderHook(() => usePaginatedApi(mockPaginatedApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      result.current.changeLimit(20);
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockPaginatedApiFunction).toHaveBeenCalledWith(1, 20);
  });
});

describe('useInfiniteApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    mockInfiniteApiFunction.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    
    const { result } = renderHook(() => useInfiniteApi(mockInfiniteApiFunction));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.loadingMore).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load more data', async () => {
    const firstPageData = ['item1', 'item2'];
    const secondPageData = ['item3', 'item4'];
    
    mockInfiniteApiFunction
      .mockResolvedValueOnce({
        data: firstPageData,
        pagination: { page: 1, limit: 10, total: 20, pages: 2 },
      })
      .mockResolvedValueOnce({
        data: secondPageData,
        pagination: { page: 2, limit: 10, total: 20, pages: 2 },
      });
    
    const { result } = renderHook(() => useInfiniteApi(mockInfiniteApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.data).toEqual(firstPageData);
    expect(result.current.hasMore).toBe(true);
    
    await act(async () => {
      result.current.loadMore();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.data).toEqual([...firstPageData, ...secondPageData]);
    expect(result.current.hasMore).toBe(false);
  });

  it('should refresh data', async () => {
    mockInfiniteApiFunction.mockResolvedValue({
      data: ['item1', 'item2'],
      pagination: { page: 1, limit: 10, total: 20, pages: 2 },
    });
    
    const { result } = renderHook(() => useInfiniteApi(mockInfiniteApiFunction));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      result.current.refresh();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockInfiniteApiFunction).toHaveBeenCalledWith(1, 10);
    expect(result.current.data).toEqual(['item1', 'item2']);
  });
});