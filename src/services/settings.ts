import api from './api';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'id';
  timezone: string;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  time_format: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    task_assigned: boolean;
    task_completed: boolean;
    task_due: boolean;
    project_updated: boolean;
    team_invite: boolean;
    comment_added: boolean;
    system_updates: boolean;
  };
  dashboard: {
    default_view: 'overview' | 'projects' | 'tasks' | 'teams';
    show_recent_activities: boolean;
    show_statistics: boolean;
    items_per_page: number;
  };
  kanban: {
    default_columns: string[];
    card_size: 'small' | 'medium' | 'large';
    show_priority_colors: boolean;
    show_assignee_avatars: boolean;
  };
  calendar: {
    default_view: 'month' | 'week' | 'day' | 'agenda';
    show_weekends: boolean;
    working_hours_start: string;
    working_hours_end: string;
    working_days: number[];
  };
  privacy: {
    profile_visibility: 'public' | 'team' | 'private';
    show_online_status: boolean;
    allow_task_assignments: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  task_assigned: boolean;
  task_completed: boolean;
  task_due: boolean;
  project_updated: boolean;
  team_invite: boolean;
  comment_added: boolean;
  system_updates: boolean;
}

export interface DashboardSettings {
  default_view: 'overview' | 'projects' | 'tasks' | 'teams';
  show_recent_activities: boolean;
  show_statistics: boolean;
  items_per_page: number;
}

export interface KanbanSettings {
  default_columns: string[];
  card_size: 'small' | 'medium' | 'large';
  show_priority_colors: boolean;
  show_assignee_avatars: boolean;
}

export interface CalendarSettings {
  default_view: 'month' | 'week' | 'day' | 'agenda';
  show_weekends: boolean;
  working_hours_start: string;
  working_hours_end: string;
  working_days: number[];
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'team' | 'private';
  show_online_status: boolean;
  allow_task_assignments: boolean;
}

export interface UpdateSettingsData {
  theme?: UserSettings['theme'];
  language?: UserSettings['language'];
  timezone?: string;
  date_format?: UserSettings['date_format'];
  time_format?: UserSettings['time_format'];
  notifications?: Partial<NotificationSettings>;
  dashboard?: Partial<DashboardSettings>;
  kanban?: Partial<KanbanSettings>;
  calendar?: Partial<CalendarSettings>;
  privacy?: Partial<PrivacySettings>;
}

export const settingsService = {
  // Get User Settings
  getSettings: async (): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.get('/api/settings');
    return response.data;
  },

  // Update User Settings
  updateSettings: async (settingsData: UpdateSettingsData): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.put('/api/settings', settingsData);
    return response.data;
  },

  // Reset Settings to Default
  resetToDefault: async (): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.post('/api/settings/reset');
    return response.data;
  },

  // Update Notification Settings
  updateNotificationSettings: async (notifications: Partial<NotificationSettings>): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/notifications', { notifications });
    return response.data;
  },

  // Update Dashboard Settings
  updateDashboardSettings: async (dashboard: Partial<DashboardSettings>): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/dashboard', { dashboard });
    return response.data;
  },

  // Update Kanban Settings
  updateKanbanSettings: async (kanban: Partial<KanbanSettings>): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/kanban', { kanban });
    return response.data;
  },

  // Update Calendar Settings
  updateCalendarSettings: async (calendar: Partial<CalendarSettings>): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/calendar', { calendar });
    return response.data;
  },

  // Update Privacy Settings
  updatePrivacySettings: async (privacy: Partial<PrivacySettings>): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/privacy', { privacy });
    return response.data;
  },

  // Update Theme
  updateTheme: async (theme: UserSettings['theme']): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/theme', { theme });
    return response.data;
  },

  // Update Language
  updateLanguage: async (language: UserSettings['language']): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/language', { language });
    return response.data;
  },

  // Update Timezone
  updateTimezone: async (timezone: string): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.patch('/api/settings/timezone', { timezone });
    return response.data;
  },

  // Get Available Timezones
  getAvailableTimezones: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await api.get('/api/settings/timezones');
    return response.data;
  },

  // Get Available Languages
  getAvailableLanguages: async (): Promise<{ success: boolean; data: Array<{ code: string; name: string; native_name: string }> }> => {
    const response = await api.get('/api/settings/languages');
    return response.data;
  },

  // Export Settings
  exportSettings: async (): Promise<{ success: boolean; data: { settings: UserSettings; export_date: string } }> => {
    const response = await api.get('/api/settings/export');
    return response.data;
  },

  // Import Settings
  importSettings: async (settingsData: any): Promise<{ success: boolean; data: UserSettings }> => {
    const response = await api.post('/api/settings/import', { settings: settingsData });
    return response.data;
  }
};
