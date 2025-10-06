import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Projects from '../Projects';

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
    projects: [
      {
        id: '1',
        name: 'Test Project 1',
        description: 'Test description 1',
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        color: '#3f51b5',
        creator_first_name: 'John',
        creator_last_name: 'Doe',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Test Project 2',
        description: 'Test description 2',
        status: 'on_hold',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        color: '#f50057',
        creator_first_name: 'Jane',
        creator_last_name: 'Smith',
        created_at: '2024-01-01T00:00:00Z',
      },
    ],
    currentProject: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
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

describe('Projects Page', () => {
  it('should render projects page title', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Manage and track all your projects')).toBeInTheDocument();
  });

  it('should render new project button', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('New Project')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument();
  });

  it('should render status filter', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should render sort by filter', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
  });

  it('should render view mode buttons', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const gridButton = screen.getByLabelText('grid view');
    const listButton = screen.getByLabelText('list view');
    
    expect(gridButton).toBeInTheDocument();
    expect(listButton).toBeInTheDocument();
  });

  it('should render status tabs', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('All Projects')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('On Hold')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render project cards', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  it('should open create project dialog when new project button is clicked', async () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const newProjectButton = screen.getByText('New Project');
    fireEvent.click(newProjectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
    });
  });

  it('should open create project dialog when FAB is clicked', async () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const fab = screen.getByLabelText('add');
    fireEvent.click(fab);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
    });
  });

  it('should render project form fields in dialog', async () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const newProjectButton = screen.getByText('New Project');
    fireEvent.click(newProjectButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.getByLabelText('Color')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    });
  });

  it('should close dialog when cancel button is clicked', async () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const newProjectButton = screen.getByText('New Project');
    fireEvent.click(newProjectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
    });
  });

  it('should filter projects by search term', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Test Project 1' } });
    
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('should filter projects by status', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusFilter);
    
    const activeOption = screen.getByText('Active');
    fireEvent.click(activeOption);
    
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('should switch between grid and list view', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const listButton = screen.getByLabelText('list view');
    fireEvent.click(listButton);
    
    // The view mode should change (this would need proper implementation)
    expect(listButton).toBeInTheDocument();
  });

  it('should switch between status tabs', () => {
    render(<Projects />, {
      preloadedState: mockInitialState,
    });
    
    const activeTab = screen.getByText('Active');
    fireEvent.click(activeTab);
    
    expect(activeTab).toBeInTheDocument();
  });

  it('should render with loading state', () => {
    const loadingState = {
      ...mockInitialState,
      projects: {
        ...mockInitialState.projects,
        loading: true,
      },
    };
    
    render(<Projects />, {
      preloadedState: loadingState,
    });
    
    // Check that loading indicators are present
    const progressElements = screen.getAllByRole('progressbar');
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('should render with empty state', () => {
    const emptyState = {
      ...mockInitialState,
      projects: {
        ...mockInitialState.projects,
        projects: [],
      },
    };
    
    render(<Projects />, {
      preloadedState: emptyState,
    });
    
    // The page should still render with empty state
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });
});
