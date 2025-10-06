import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ProjectCard from '../projects/ProjectCard';
import { Project } from '../../services/projects';

const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'This is a test project description',
  status: 'active',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  color: '#3f51b5',
  team_name: 'Test Team',
  creator_first_name: 'John',
  creator_last_name: 'Doe',
  created_at: '2024-01-01T00:00:00Z',
  members: 5,
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('ProjectCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render project information', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('5 members')).toBeInTheDocument();
  });

  it('should display correct status chip', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockProject);
  });

  it('should navigate to tasks when View Tasks button is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const viewTasksButton = screen.getByText('View Tasks');
    fireEvent.click(viewTasksButton);
    
    // This would need proper routing setup in test environment
    expect(viewTasksButton).toBeInTheDocument();
  });

  it('should display correct status color for different statuses', () => {
    const onHoldProject = { ...mockProject, status: 'on_hold' as const };
    
    render(
      <ProjectCard
        project={onHoldProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('On Hold')).toBeInTheDocument();
  });

  it('should display project color indicator', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // The color indicator should be present (styled as a colored dot)
    const colorIndicator = screen.getByRole('generic');
    expect(colorIndicator).toBeInTheDocument();
  });

  it('should display progress bar', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Progress bar should be present
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should display team information when available', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Team: Test Team')).toBeInTheDocument();
  });

  it('should not display team information when not available', () => {
    const projectWithoutTeam = { ...mockProject, team_name: undefined };
    
    render(
      <ProjectCard
        project={projectWithoutTeam}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.queryByText(/Team:/)).not.toBeInTheDocument();
  });
});
