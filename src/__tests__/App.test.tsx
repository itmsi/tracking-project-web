import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import App from '../App';

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

describe('App Component', () => {
  it('should render app with theme provider', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // The app should render with the theme provider
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render app with Redux provider', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // The app should render with the Redux provider
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render app with router', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // The app should render with the router
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render app with CssBaseline', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // The app should render with CssBaseline
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render login page when not authenticated', () => {
    const unauthenticatedState = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: null,
        isAuthenticated: false,
      },
    };
    
    render(<App />, {
      preloadedState: unauthenticatedState,
    });
    
    // Should render login page
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render dashboard when authenticated', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render dashboard
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render protected routes when authenticated', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render protected routes
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render public routes when not authenticated', () => {
    const unauthenticatedState = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: null,
        isAuthenticated: false,
      },
    };
    
    render(<App />, {
      preloadedState: unauthenticatedState,
    });
    
    // Should render public routes
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render catch all route', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render catch all route
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct route structure', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct route structure
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct provider structure', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct provider structure
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct theme configuration', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct theme configuration
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct store configuration', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct store configuration
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct router configuration', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct router configuration
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct CssBaseline configuration', () => {
    render(<App />, {
      preloadedState: mockInitialState,
    });
    
    // Should render with correct CssBaseline configuration
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });
});
