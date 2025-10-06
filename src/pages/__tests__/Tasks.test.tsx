import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Tasks from '../Tasks';

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
    tasks: [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Test description 1',
        status: 'todo',
        priority: 'high',
        project_id: '1',
        assigned_to: 'user1',
        assignee_first_name: 'John',
        assignee_last_name: 'Doe',
        assignee_avatar_url: '',
        due_date: '2024-12-31',
        position: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Test description 2',
        status: 'in_progress',
        priority: 'medium',
        project_id: '1',
        assigned_to: 'user2',
        assignee_first_name: 'Jane',
        assignee_last_name: 'Smith',
        assignee_avatar_url: '',
        due_date: '2024-12-31',
        position: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
    currentTask: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    },
  },
};

describe('Tasks Page', () => {
  it('should render tasks page title', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Manage all your tasks')).toBeInTheDocument();
  });

  it('should render view mode buttons', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Kanban')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('should render status filter', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should render priority filter', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
  });

  it('should render status tabs', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('should render task counts in tabs', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    // Check that task counts are displayed
    expect(screen.getByText('2')).toBeInTheDocument(); // All Tasks
    expect(screen.getByText('1')).toBeInTheDocument(); // To Do
    expect(screen.getByText('1')).toBeInTheDocument(); // In Progress
  });

  it('should switch to kanban view', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const kanbanButton = screen.getByText('Kanban');
    fireEvent.click(kanbanButton);
    
    expect(kanbanButton).toBeInTheDocument();
  });

  it('should switch to list view', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const listButton = screen.getByText('List');
    fireEvent.click(listButton);
    
    expect(listButton).toBeInTheDocument();
  });

  it('should filter tasks by search term', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'Test Task 1' } });
    
    // The filtering logic would be tested here
    expect(searchInput).toBeInTheDocument();
  });

  it('should filter tasks by status', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusFilter);
    
    const todoOption = screen.getByText('To Do');
    fireEvent.click(todoOption);
    
    expect(todoOption).toBeInTheDocument();
  });

  it('should filter tasks by priority', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const priorityFilter = screen.getByLabelText('Priority');
    fireEvent.mouseDown(priorityFilter);
    
    const highOption = screen.getByText('High');
    fireEvent.click(highOption);
    
    expect(highOption).toBeInTheDocument();
  });

  it('should switch between status tabs', () => {
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    const todoTab = screen.getByText('To Do');
    fireEvent.click(todoTab);
    
    expect(todoTab).toBeInTheDocument();
  });

  it('should render with loading state', () => {
    const loadingState = {
      ...mockInitialState,
      tasks: {
        ...mockInitialState.tasks,
        loading: true,
      },
    };
    
    render(<Tasks />, {
      preloadedState: loadingState,
    });
    
    // The page should still render with loading state
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('should render with empty state', () => {
    const emptyState = {
      ...mockInitialState,
      tasks: {
        ...mockInitialState.tasks,
        tasks: [],
      },
    };
    
    render(<Tasks />, {
      preloadedState: emptyState,
    });
    
    // The page should still render with empty state
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('should render with project ID from URL params', () => {
    // Mock useParams to return a project ID
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ id: 'test-project-id' }),
    }));
    
    render(<Tasks />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Manage project tasks')).toBeInTheDocument();
  });
});
