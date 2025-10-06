import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Dashboard from '../../pages/Dashboard';

// Mock the Redux store
const mockInitialState = {
  auth: {
    user: {
      id: '1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      created_at: '2024-01-01T00:00:00Z',
    },
    token: 'mock-token',
    loading: false,
    error: null,
    isAuthenticated: true,
  },
  projects: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
  },
  tasks: {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
  },
};

describe('Dashboard Component', () => {
  it('should render welcome message with user name', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Selamat datang, John! 👋')).toBeInTheDocument();
  });

  it('should render dashboard description', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Berikut adalah ringkasan aktivitas proyek Anda hari ini.')).toBeInTheDocument();
  });

  it('should render statistics cards', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('should render recent tasks section', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
  });

  it('should render recent projects section', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Recent Projects')).toBeInTheDocument();
  });

  it('should render add buttons for tasks and projects', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    const addButtons = screen.getAllByLabelText('add');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('should display statistics with correct values', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    // Check that statistics are displayed
    expect(screen.getByText('0')).toBeInTheDocument(); // Total Projects
    expect(screen.getByText('0')).toBeInTheDocument(); // Active Tasks
    expect(screen.getByText('24')).toBeInTheDocument(); // Team Members
    expect(screen.getByText('78%')).toBeInTheDocument(); // Completion Rate
  });

  it('should render progress indicators', () => {
    render(<Dashboard />, {
      preloadedState: mockInitialState,
    });
    
    // Check that progress indicators are present
    const progressElements = screen.getAllByRole('progressbar');
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('should render with loading state', () => {
    const loadingState = {
      ...mockInitialState,
      projects: {
        ...mockInitialState.projects,
        loading: true,
      },
      tasks: {
        ...mockInitialState.tasks,
        loading: true,
      },
    };
    
    render(<Dashboard />, {
      preloadedState: loadingState,
    });
    
    // Check that loading indicators are present
    const progressElements = screen.getAllByRole('progressbar');
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('should render with user without first name', () => {
    const stateWithoutFirstName = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: {
          ...mockInitialState.auth.user,
          first_name: '',
        },
      },
    };
    
    render(<Dashboard />, {
      preloadedState: stateWithoutFirstName,
    });
    
    expect(screen.getByText('Selamat datang, ! 👋')).toBeInTheDocument();
  });
});
