/**
 * Format date to Indonesian locale
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time to Indonesian locale
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun yang lalu`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName?.[0]?.toUpperCase() || '';
  const lastInitial = lastName?.[0]?.toUpperCase() || '';
  return firstInitial + lastInitial;
};

/**
 * Get status color for Material-UI
 */
export const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
  const statusColors: { [key: string]: 'success' | 'warning' | 'info' | 'error' | 'default' } = {
    active: 'success',
    completed: 'info',
    done: 'success',
    on_hold: 'warning',
    blocked: 'error',
    cancelled: 'error',
    todo: 'default',
    in_progress: 'info',
  };
  return statusColors[status] || 'default';
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: string): string => {
  const colors: { [key: string]: string } = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626',
  };
  return colors[priority] || colors.medium;
};

/**
 * Check if date is overdue
 */
export const isOverdue = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#3f51b5', '#f50057', '#4caf50', '#ff9800', '#9c27b0',
    '#00bcd4', '#795548', '#607d8b', '#e91e63', '#3f51b5',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
