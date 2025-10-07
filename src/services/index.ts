// Export all API services
export { authService } from './auth';
export { projectsService } from './projects';
export { tasksService } from './tasks';
export { teamsService } from './teams';
export { commentsService } from './comments';
export { notificationsService } from './notifications';
export { usersService } from './users';
export { analyticsService } from './analytics';
export { calendarService } from './calendar';
export { settingsService } from './settings';
export { uploadService } from './upload';

// Export default API instance
export { default as api } from './api';

// Export types individually
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse
} from './auth';

export type {
  Project,
  ProjectStats,
  ProjectResponse
} from './projects';

export type {
  Task,
  TaskResponse
} from './tasks';

export type {
  Team,
  TeamMember,
  TeamResponse,
  TeamStats
} from './teams';

export type {
  Comment,
  CommentResponse,
  CreateCommentData,
  UpdateCommentData
} from './comments';

export type {
  Notification,
  NotificationResponse,
  NotificationStats
} from './notifications';

export type {
  User as UserType,
  UserStats,
  UserResponse,
  UserSearchParams
} from './users';

export type {
  DashboardAnalytics,
  ProjectAnalytics,
  TaskAnalytics,
  TeamPerformance,
  AnalyticsPeriod
} from './analytics';

export type {
  CalendarEvent,
  CalendarEventResponse,
  CreateEventData,
  UpdateEventData,
  CalendarViewParams
} from './calendar';

export type {
  UserSettings,
  NotificationSettings,
  DashboardSettings,
  KanbanSettings,
  CalendarSettings,
  PrivacySettings,
  UpdateSettingsData
} from './settings';

export type {
  UploadedFile,
  UploadProgress,
  UploadResponse,
  BatchUploadResponse,
  UploadType,
  UploadOptions
} from './upload';
