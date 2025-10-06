import {
  API_CONFIG,
  FRONTEND_CONFIG,
  APP_INFO,
  USER_ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  TEAM_MEMBER_ROLES,
  COLORS,
  PRIORITY_COLORS,
  STATUS_COLORS,
  PAGINATION,
  FILE_UPLOAD,
  STORAGE_KEYS,
  ROUTES,
  BREAKPOINTS,
  ANIMATION_DURATION,
  DEBOUNCE_DELAY,
  DATE_FORMATS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NOTIFICATION_TYPES,
  CHART_COLORS,
  AVATAR_COLORS,
} from '../constants';

describe('Constants', () => {
  describe('API_CONFIG', () => {
    it('should have correct API configuration', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.WS_URL).toBeDefined();
      expect(API_CONFIG.TIMEOUT).toBe(10000);
    });
  });

  describe('FRONTEND_CONFIG', () => {
    it('should have correct frontend configuration', () => {
      expect(FRONTEND_CONFIG.URL).toBeDefined();
      expect(FRONTEND_CONFIG.PORT).toBeDefined();
    });
  });

  describe('APP_INFO', () => {
    it('should have correct app information', () => {
      expect(APP_INFO.NAME).toBe('Project Tracker');
      expect(APP_INFO.VERSION).toBe('1.0.0');
      expect(APP_INFO.DESCRIPTION).toBeDefined();
    });
  });

  describe('USER_ROLES', () => {
    it('should have all user roles', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
      expect(USER_ROLES.PROJECT_MANAGER).toBe('project_manager');
      expect(USER_ROLES.DEVELOPER).toBe('developer');
      expect(USER_ROLES.USER).toBe('user');
    });
  });

  describe('PROJECT_STATUS', () => {
    it('should have all project statuses', () => {
      expect(PROJECT_STATUS.ACTIVE).toBe('active');
      expect(PROJECT_STATUS.ON_HOLD).toBe('on_hold');
      expect(PROJECT_STATUS.COMPLETED).toBe('completed');
      expect(PROJECT_STATUS.CANCELLED).toBe('cancelled');
    });
  });

  describe('TASK_STATUS', () => {
    it('should have all task statuses', () => {
      expect(TASK_STATUS.TODO).toBe('todo');
      expect(TASK_STATUS.IN_PROGRESS).toBe('in_progress');
      expect(TASK_STATUS.DONE).toBe('done');
      expect(TASK_STATUS.BLOCKED).toBe('blocked');
    });
  });

  describe('TASK_PRIORITY', () => {
    it('should have all task priorities', () => {
      expect(TASK_PRIORITY.LOW).toBe('low');
      expect(TASK_PRIORITY.MEDIUM).toBe('medium');
      expect(TASK_PRIORITY.HIGH).toBe('high');
      expect(TASK_PRIORITY.URGENT).toBe('urgent');
    });
  });

  describe('TEAM_MEMBER_ROLES', () => {
    it('should have all team member roles', () => {
      expect(TEAM_MEMBER_ROLES.OWNER).toBe('owner');
      expect(TEAM_MEMBER_ROLES.ADMIN).toBe('admin');
      expect(TEAM_MEMBER_ROLES.MEMBER).toBe('member');
      expect(TEAM_MEMBER_ROLES.VIEWER).toBe('viewer');
    });
  });

  describe('COLORS', () => {
    it('should have all color constants', () => {
      expect(COLORS.PRIMARY).toBe('#3f51b5');
      expect(COLORS.SECONDARY).toBe('#f50057');
      expect(COLORS.SUCCESS).toBe('#4caf50');
      expect(COLORS.WARNING).toBe('#ff9800');
      expect(COLORS.ERROR).toBe('#f44336');
      expect(COLORS.INFO).toBe('#2196f3');
    });
  });

  describe('PRIORITY_COLORS', () => {
    it('should have colors for all priorities', () => {
      expect(PRIORITY_COLORS[TASK_PRIORITY.LOW]).toBeDefined();
      expect(PRIORITY_COLORS[TASK_PRIORITY.MEDIUM]).toBeDefined();
      expect(PRIORITY_COLORS[TASK_PRIORITY.HIGH]).toBeDefined();
      expect(PRIORITY_COLORS[TASK_PRIORITY.URGENT]).toBeDefined();
    });
  });

  describe('STATUS_COLORS', () => {
    it('should have colors for all statuses', () => {
      expect(STATUS_COLORS[PROJECT_STATUS.ACTIVE]).toBeDefined();
      expect(STATUS_COLORS[PROJECT_STATUS.ON_HOLD]).toBeDefined();
      expect(STATUS_COLORS[PROJECT_STATUS.COMPLETED]).toBeDefined();
      expect(STATUS_COLORS[PROJECT_STATUS.CANCELLED]).toBeDefined();
      expect(STATUS_COLORS[TASK_STATUS.TODO]).toBeDefined();
      expect(STATUS_COLORS[TASK_STATUS.IN_PROGRESS]).toBeDefined();
      expect(STATUS_COLORS[TASK_STATUS.DONE]).toBeDefined();
      expect(STATUS_COLORS[TASK_STATUS.BLOCKED]).toBeDefined();
    });
  });

  describe('PAGINATION', () => {
    it('should have correct pagination defaults', () => {
      expect(PAGINATION.DEFAULT_PAGE).toBe(1);
      expect(PAGINATION.DEFAULT_LIMIT).toBe(10);
      expect(PAGINATION.MAX_LIMIT).toBe(100);
    });
  });

  describe('FILE_UPLOAD', () => {
    it('should have correct file upload limits', () => {
      expect(FILE_UPLOAD.MAX_SIZE).toBe(5 * 1024 * 1024);
      expect(FILE_UPLOAD.ALLOWED_TYPES).toContain('image/jpeg');
      expect(FILE_UPLOAD.ALLOWED_TYPES).toContain('application/pdf');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have all storage keys', () => {
      expect(STORAGE_KEYS.ACCESS_TOKEN).toBe('access_token');
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh_token');
      expect(STORAGE_KEYS.USER).toBe('user');
      expect(STORAGE_KEYS.THEME).toBe('theme');
      expect(STORAGE_KEYS.LANGUAGE).toBe('language');
    });
  });

  describe('ROUTES', () => {
    it('should have all route constants', () => {
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.REGISTER).toBe('/register');
      expect(ROUTES.DASHBOARD).toBe('/dashboard');
      expect(ROUTES.PROJECTS).toBe('/projects');
      expect(ROUTES.TASKS).toBe('/tasks');
      expect(ROUTES.TEAMS).toBe('/teams');
    });
  });

  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.XS).toBe(0);
      expect(BREAKPOINTS.SM).toBe(600);
      expect(BREAKPOINTS.MD).toBe(960);
      expect(BREAKPOINTS.LG).toBe(1280);
      expect(BREAKPOINTS.XL).toBe(1920);
    });
  });

  describe('ANIMATION_DURATION', () => {
    it('should have correct animation durations', () => {
      expect(ANIMATION_DURATION.FAST).toBe(150);
      expect(ANIMATION_DURATION.NORMAL).toBe(300);
      expect(ANIMATION_DURATION.SLOW).toBe(500);
    });
  });

  describe('DEBOUNCE_DELAY', () => {
    it('should have correct debounce delays', () => {
      expect(DEBOUNCE_DELAY.SEARCH).toBe(300);
      expect(DEBOUNCE_DELAY.RESIZE).toBe(100);
      expect(DEBOUNCE_DELAY.SCROLL).toBe(100);
    });
  });

  describe('DATE_FORMATS', () => {
    it('should have all date formats', () => {
      expect(DATE_FORMATS.DISPLAY).toBeDefined();
      expect(DATE_FORMATS.DISPLAY_WITH_TIME).toBeDefined();
      expect(DATE_FORMATS.INPUT).toBeDefined();
      expect(DATE_FORMATS.INPUT_WITH_TIME).toBeDefined();
    });
  });

  describe('VALIDATION_RULES', () => {
    it('should have correct validation rules', () => {
      expect(VALIDATION_RULES.PASSWORD_MIN_LENGTH).toBe(6);
      expect(VALIDATION_RULES.PASSWORD_MAX_LENGTH).toBe(128);
      expect(VALIDATION_RULES.NAME_MIN_LENGTH).toBe(2);
      expect(VALIDATION_RULES.NAME_MAX_LENGTH).toBe(50);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have all error messages', () => {
      expect(ERROR_MESSAGES.REQUIRED_FIELD).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_EMAIL).toBeDefined();
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.SERVER_ERROR).toBeDefined();
    });
  });

  describe('SUCCESS_MESSAGES', () => {
    it('should have all success messages', () => {
      expect(SUCCESS_MESSAGES.LOGIN_SUCCESS).toBeDefined();
      expect(SUCCESS_MESSAGES.REGISTER_SUCCESS).toBeDefined();
      expect(SUCCESS_MESSAGES.SAVE_SUCCESS).toBeDefined();
      expect(SUCCESS_MESSAGES.UPDATE_SUCCESS).toBeDefined();
    });
  });

  describe('NOTIFICATION_TYPES', () => {
    it('should have all notification types', () => {
      expect(NOTIFICATION_TYPES.SUCCESS).toBe('success');
      expect(NOTIFICATION_TYPES.ERROR).toBe('error');
      expect(NOTIFICATION_TYPES.WARNING).toBe('warning');
      expect(NOTIFICATION_TYPES.INFO).toBe('info');
    });
  });

  describe('CHART_COLORS', () => {
    it('should have chart colors array', () => {
      expect(CHART_COLORS).toBeInstanceOf(Array);
      expect(CHART_COLORS.length).toBeGreaterThan(0);
      expect(CHART_COLORS[0]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe('AVATAR_COLORS', () => {
    it('should have avatar colors array', () => {
      expect(AVATAR_COLORS).toBeInstanceOf(Array);
      expect(AVATAR_COLORS.length).toBeGreaterThan(0);
      expect(AVATAR_COLORS[0]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
