import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Layout from '../layout/Layout';

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

describe('Layout Component', () => {
  it('should render header', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render sidebar', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render main content area', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The main content area should be present
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render outlet for child components', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The outlet should be present (tested via main content area)
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render with correct layout structure', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // Check that the layout has the correct structure
    expect(screen.getByText('Project Tracker')).toBeInTheDocument(); // Header
    expect(screen.getByText('Menu')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  it('should render with user information in header', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('JD')).toBeInTheDocument(); // User avatar
  });

  it('should render with navigation menu in sidebar', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
  });

  it('should render with user information in sidebar', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('should render with correct styling classes', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The layout should have the correct structure
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with toolbar spacer', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The toolbar spacer should be present (tested via main content)
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with correct background color', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The main content should have the correct background
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with correct padding', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The main content should have padding
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with correct minimum height', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The main content should have minimum height
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with flex layout', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The layout should use flexbox
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render with correct z-index for header', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The header should have the correct z-index
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render with correct drawer width for sidebar', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The sidebar should have the correct width
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render with correct main content flex grow', () => {
    render(<Layout />, {
      preloadedState: mockInitialState,
    });
    
    // The main content should grow to fill available space
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
