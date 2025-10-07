import api from './api';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'reminder' | 'event';
  project_id?: string;
  task_id?: string;
  team_id?: string;
  user_id: string;
  attendees?: Array<{
    user_id: string;
    user_name: string;
    user_email: string;
    status: 'accepted' | 'declined' | 'pending';
  }>;
  is_all_day: boolean;
  location?: string;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
    days_of_week?: number[];
  };
  reminder?: {
    minutes_before: number;
    type: 'email' | 'push' | 'both';
  };
  created_at: string;
  updated_at: string;
}

export interface CalendarEventResponse {
  success: boolean;
  message: string;
  data: {
    events: CalendarEvent[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  type: CalendarEvent['type'];
  project_id?: string;
  task_id?: string;
  team_id?: string;
  attendees?: string[];
  is_all_day?: boolean;
  location?: string;
  recurring?: CalendarEvent['recurring'];
  reminder?: CalendarEvent['reminder'];
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  type?: CalendarEvent['type'];
  attendees?: string[];
  is_all_day?: boolean;
  location?: string;
  reminder?: CalendarEvent['reminder'];
}

export interface CalendarViewParams {
  start_date: string;
  end_date: string;
  project_id?: string;
  user_id?: string;
  team_id?: string;
  type?: string;
  view?: 'month' | 'week' | 'day' | 'agenda';
}

export const calendarService = {
  // Get Calendar Events
  getEvents: async (params: CalendarViewParams): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events', { params });
    return response.data;
  },

  // Get Events for Date Range
  getEventsByDateRange: async (startDate: string, endDate: string, filters: any = {}): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events', { 
      params: { 
        start_date: startDate, 
        end_date: endDate,
        ...filters 
      } 
    });
    return response.data;
  },

  // Get Project Events
  getProjectEvents: async (projectId: string, params: any = {}): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events', { 
      params: { 
        project_id: projectId,
        ...params 
      } 
    });
    return response.data;
  },

  // Get User Events
  getUserEvents: async (userId: string, params: any = {}): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events', { 
      params: { 
        user_id: userId,
        ...params 
      } 
    });
    return response.data;
  },

  // Get Team Events
  getTeamEvents: async (teamId: string, params: any = {}): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events', { 
      params: { 
        team_id: teamId,
        ...params 
      } 
    });
    return response.data;
  },

  // Create Calendar Event
  createEvent: async (eventData: CreateEventData): Promise<{ success: boolean; data: CalendarEvent }> => {
    const response = await api.post('/calendar/events', eventData);
    return response.data;
  },

  // Update Calendar Event
  updateEvent: async (id: string, eventData: UpdateEventData): Promise<{ success: boolean; data: CalendarEvent }> => {
    const response = await api.put(`/calendar/events/${id}`, eventData);
    return response.data;
  },

  // Delete Calendar Event
  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/calendar/events/${id}`);
    return response.data;
  },

  // Get Event Detail
  getEvent: async (id: string): Promise<{ success: boolean; data: CalendarEvent }> => {
    const response = await api.get(`/calendar/events/${id}`);
    return response.data;
  },

  // Respond to Event Invitation
  respondToEvent: async (id: string, response: 'accepted' | 'declined'): Promise<{ success: boolean; message: string }> => {
    const apiResponse = await api.patch(`/calendar/events/${id}/respond`, { response });
    return apiResponse.data;
  },

  // Get Upcoming Events
  getUpcomingEvents: async (days: number = 7): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events/upcoming', { 
      params: { days } 
    });
    return response.data;
  },

  // Get Today's Events
  getTodayEvents: async (): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events/today');
    return response.data;
  },

  // Get Overdue Events
  getOverdueEvents: async (): Promise<CalendarEventResponse> => {
    const response = await api.get('/calendar/events/overdue');
    return response.data;
  },

  // Create Event from Task Deadline
  createTaskDeadlineEvent: async (taskId: string, eventData: Partial<CreateEventData>): Promise<{ success: boolean; data: CalendarEvent }> => {
    const response = await api.post(`/calendar/events/task/${taskId}/deadline`, eventData);
    return response.data;
  },

  // Create Event from Project Milestone
  createProjectMilestoneEvent: async (projectId: string, eventData: Partial<CreateEventData>): Promise<{ success: boolean; data: CalendarEvent }> => {
    const response = await api.post(`/calendar/events/project/${projectId}/milestone`, eventData);
    return response.data;
  }
};
