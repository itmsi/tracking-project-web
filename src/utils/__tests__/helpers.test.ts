import {
  formatDate,
  formatDateTime,
  getRelativeTime,
  truncateText,
  getInitials,
  getStatusColor,
  getPriorityColor,
  isOverdue,
  calculateProgress,
  debounce,
  generateRandomColor,
} from '../helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date string to Indonesian locale', () => {
      const date = '2024-01-15';
      const result = formatDate(date);
      expect(result).toContain('Januari');
      expect(result).toContain('2024');
    });

    it('should format Date object to Indonesian locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('Januari');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time to Indonesian locale', () => {
      const date = '2024-01-15T10:30:00';
      const result = formatDateTime(date);
      expect(result).toContain('Januari');
      expect(result).toContain('2024');
      expect(result).toContain('10:30');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Baru saja" for recent time', () => {
      const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      const result = getRelativeTime(date);
      expect(result).toBe('Baru saja');
    });

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      const result = getRelativeTime(date);
      expect(result).toBe('5 menit yang lalu');
    });

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const result = getRelativeTime(date);
      expect(result).toBe('2 jam yang lalu');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long...');
    });

    it('should return original text if shorter than limit', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });
  });

  describe('getInitials', () => {
    it('should generate initials from first and last name', () => {
      const result = getInitials('John', 'Doe');
      expect(result).toBe('JD');
    });

    it('should handle missing names', () => {
      const result = getInitials('John', '');
      expect(result).toBe('J');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for active status', () => {
      const result = getStatusColor('active');
      expect(result).toBe('success');
    });

    it('should return default color for unknown status', () => {
      const result = getStatusColor('unknown');
      expect(result).toBe('default');
    });
  });

  describe('getPriorityColor', () => {
    it('should return correct color for high priority', () => {
      const result = getPriorityColor('high');
      expect(result).toBe('#ef4444');
    });

    it('should return medium color for unknown priority', () => {
      const result = getPriorityColor('unknown');
      expect(result).toBe('#f59e0b');
    });
  });

  describe('isOverdue', () => {
    it('should return true for past date', () => {
      const date = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      const result = isOverdue(date);
      expect(result).toBe(true);
    });

    it('should return false for future date', () => {
      const date = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      const result = isOverdue(date);
      expect(result).toBe(false);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate correct progress percentage', () => {
      const result = calculateProgress(3, 10);
      expect(result).toBe(30);
    });

    it('should return 0 for zero total', () => {
      const result = calculateProgress(5, 0);
      expect(result).toBe(0);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateRandomColor', () => {
    it('should return a valid color', () => {
      const result = generateRandomColor();
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
