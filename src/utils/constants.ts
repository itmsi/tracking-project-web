/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:9553/api',
  WS_URL: process.env.REACT_APP_WS_URL || 'http://localhost:9553',
  TIMEOUT: 10000,
} as const;

// Frontend Configuration
export const FRONTEND_CONFIG = {
  URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:9554',
  PORT: process.env.REACT_APP_FRONTEND_PORT || '9554',
} as const;

// Application Info
export const APP_INFO = {
  NAME: process.env.REACT_APP_NAME || 'Tracking Project Team',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DESCRIPTION: 'Modern project management application',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer',
  USER: 'user',
} as const;

// Project Status
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Team Member Roles
export const TEAM_MEMBER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#3f51b5',
  SECONDARY: '#f50057',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: '#10b981',
  [TASK_PRIORITY.MEDIUM]: '#f59e0b',
  [TASK_PRIORITY.HIGH]: '#ef4444',
  [TASK_PRIORITY.URGENT]: '#dc2626',
} as const;

// Status Colors
export const STATUS_COLORS = {
  [PROJECT_STATUS.ACTIVE]: '#4caf50',
  [PROJECT_STATUS.ON_HOLD]: '#ff9800',
  [PROJECT_STATUS.COMPLETED]: '#2196f3',
  [PROJECT_STATUS.CANCELLED]: '#f44336',
  [TASK_STATUS.TODO]: '#f3f4f6',
  [TASK_STATUS.IN_PROGRESS]: '#dbeafe',
  [TASK_STATUS.DONE]: '#d1fae5',
  [TASK_STATUS.BLOCKED]: '#fee2e2',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  TEAMS: '/teams',
  ANALYTICS: '/analytics',
  CALENDAR: '/calendar',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  RESIZE: 100,
  SCROLL: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMMM YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  INPUT_WITH_TIME: 'YYYY-MM-DDTHH:mm',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Field ini harus diisi',
  INVALID_EMAIL: 'Email tidak valid',
  INVALID_PASSWORD: 'Password tidak valid',
  PASSWORD_MISMATCH: 'Password tidak cocok',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan',
  SERVER_ERROR: 'Terjadi kesalahan server',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  NOT_FOUND: 'Data tidak ditemukan',
  VALIDATION_ERROR: 'Terjadi kesalahan validasi',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil',
  REGISTER_SUCCESS: 'Registrasi berhasil',
  LOGOUT_SUCCESS: 'Logout berhasil',
  SAVE_SUCCESS: 'Data berhasil disimpan',
  UPDATE_SUCCESS: 'Data berhasil diupdate',
  DELETE_SUCCESS: 'Data berhasil dihapus',
  UPLOAD_SUCCESS: 'File berhasil diupload',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#3f51b5',
  '#f50057',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#00bcd4',
  '#795548',
  '#607d8b',
  '#e91e63',
  '#3f51b5',
] as const;

// Default Avatar Colors
export const AVATAR_COLORS = [
  '#3f51b5',
  '#f50057',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#00bcd4',
  '#795548',
  '#607d8b',
  '#e91e63',
  '#ff5722',
] as const;
