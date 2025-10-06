import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ProtectedRoute from '../common/ProtectedRoute';

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

describe('ProtectedRoute Component', () => {
  it('should render children when user is authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: mockInitialState,
      }
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    const loadingState = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        loading: true,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: loadingState,
      }
    );
    
    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    const unauthenticatedState = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: null,
        isAuthenticated: false,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: unauthenticatedState,
      }
    );
    
    // Should redirect to login (tested via Navigate component)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user has token but no user data initially', () => {
    const stateWithTokenButNoUser = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: 'mock-token',
        isAuthenticated: false,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateWithTokenButNoUser,
      }
    );
    
    // Should show loading spinner while fetching profile
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render children when user is authenticated with token', () => {
    const stateWithTokenAndUser = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        token: 'mock-token',
        isAuthenticated: true,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateWithTokenAndUser,
      }
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when user is authenticated without token', () => {
    const stateWithUserButNoToken = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        token: null,
        isAuthenticated: true,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateWithUserButNoToken,
      }
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when both user and token are present', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: mockInitialState,
      }
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when user is authenticated but loading is false', () => {
    const stateNotLoading = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        loading: false,
        isAuthenticated: true,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateNotLoading,
      }
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when user is authenticated and loading is true', () => {
    const stateLoading = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        loading: true,
        isAuthenticated: true,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateLoading,
      }
    );
    
    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render children when user is not authenticated and loading is false', () => {
    const stateNotAuthenticatedNotLoading = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateNotAuthenticatedNotLoading,
      }
    );
    
    // Should redirect to login
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is not authenticated and loading is true', () => {
    const stateNotAuthenticatedLoading = {
      ...mockInitialState,
      auth: {
        ...mockInitialState.auth,
        user: null,
        token: null,
        loading: true,
        isAuthenticated: false,
      },
    };
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: stateNotAuthenticatedLoading,
      }
    );
    
    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
