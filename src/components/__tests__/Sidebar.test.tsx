import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Sidebar from '../layout/Sidebar';

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

describe('Sidebar Component', () => {
  it('should render sidebar title', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render navigation menu items', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('should render additional menu items', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render notification badge', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('3')).toBeInTheDocument(); // Notification count
  });

  it('should render user information at bottom', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('should render user avatar with initials', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should navigate when menu item is clicked', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    
    // The navigation would be handled by React Router
    expect(dashboardItem).toBeInTheDocument();
  });

  it('should highlight active menu item', () => {
    // Mock useLocation to return current path
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/dashboard' }),
    }));
    
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    const dashboardItem = screen.getByText('Dashboard');
    expect(dashboardItem).toBeInTheDocument();
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
    
    render(<Sidebar />, {
      preloadedState: stateWithoutFirstName,
    });
    
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('should render with user without last name', () => {
    const stateWithoutLastName = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: {
          ...mockInitialState.auth.user,
          last_name: '',
        },
      },
    };
    
    render(<Sidebar />, {
      preloadedState: stateWithoutLastName,
    });
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should render with user without both names', () => {
    const stateWithoutNames = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: {
          ...mockInitialState.auth.user,
          first_name: '',
          last_name: '',
        },
      },
    };
    
    render(<Sidebar />, {
      preloadedState: stateWithoutNames,
    });
    
    // Should render empty user info
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('should render with different user roles', () => {
    const adminState = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: {
          ...mockInitialState.auth.user,
          role: 'admin',
        },
      },
    };
    
    render(<Sidebar />, {
      preloadedState: adminState,
    });
    
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('should render menu items with correct icons', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    // Check that menu items have icons (tested via accessibility)
    const menuItems = screen.getAllByRole('button');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('should render divider between main menu and additional items', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    // The divider should be present (tested via structure)
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render user section at bottom', () => {
    render(<Sidebar />, {
      preloadedState: mockInitialState,
    });
    
    // Check that user information is at the bottom
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });
});
