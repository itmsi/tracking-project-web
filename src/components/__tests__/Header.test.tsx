import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Header from '../layout/Header';

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

describe('Header Component', () => {
  it('should render header title', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
  });

  it('should render search icon', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const searchIcon = screen.getByLabelText('search');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should render notifications icon', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const notificationsIcon = screen.getByLabelText('notifications');
    expect(notificationsIcon).toBeInTheDocument();
  });

  it('should render user avatar', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const userAvatar = screen.getByLabelText('account of current user');
    expect(userAvatar).toBeInTheDocument();
  });

  it('should render user initials in avatar', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should open user menu when avatar is clicked', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const userAvatar = screen.getByLabelText('account of current user');
    fireEvent.click(userAvatar);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render user menu items', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const userAvatar = screen.getByLabelText('account of current user');
    fireEvent.click(userAvatar);
    
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan')).toBeInTheDocument();
    expect(screen.getByText('Keluar')).toBeInTheDocument();
  });

  it('should close user menu when clicking outside', () => {
    render(<Header />, {
      preloadedState: mockInitialState,
    });
    
    const userAvatar = screen.getByLabelText('account of current user');
    fireEvent.click(userAvatar);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Click outside the menu
    fireEvent.click(document.body);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should render with user without avatar URL', () => {
    const stateWithoutAvatar = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: {
          ...mockInitialState.auth.user,
          avatar_url: undefined,
        },
      },
    };
    
    render(<Header />, {
      preloadedState: stateWithoutAvatar,
    });
    
    expect(screen.getByText('JD')).toBeInTheDocument();
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
    
    render(<Header />, {
      preloadedState: stateWithoutFirstName,
    });
    
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
    
    render(<Header />, {
      preloadedState: stateWithoutLastName,
    });
    
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
    
    render(<Header />, {
      preloadedState: stateWithoutNames,
    });
    
    // Should render empty avatar
    const userAvatar = screen.getByLabelText('account of current user');
    expect(userAvatar).toBeInTheDocument();
  });
});
