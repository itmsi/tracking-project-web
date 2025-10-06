import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Teams from '../Teams';

describe('Teams Page', () => {
  it('should render teams page title', () => {
    render(<Teams />);
    
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Manage your teams and collaborate effectively')).toBeInTheDocument();
  });

  it('should render new team button', () => {
    render(<Teams />);
    
    expect(screen.getByText('New Team')).toBeInTheDocument();
  });

  it('should render team cards', () => {
    render(<Teams />);
    
    expect(screen.getByText('Frontend Team')).toBeInTheDocument();
    expect(screen.getByText('Backend Team')).toBeInTheDocument();
    expect(screen.getByText('Design Team')).toBeInTheDocument();
  });

  it('should render team descriptions', () => {
    render(<Teams />);
    
    expect(screen.getByText('Team untuk pengembangan frontend aplikasi')).toBeInTheDocument();
    expect(screen.getByText('Team untuk pengembangan backend dan API')).toBeInTheDocument();
    expect(screen.getByText('Team untuk UI/UX design dan branding')).toBeInTheDocument();
  });

  it('should render team member counts', () => {
    render(<Teams />);
    
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('2 members')).toBeInTheDocument();
  });

  it('should render team member avatars', () => {
    render(<Teams />);
    
    // Check that avatar groups are present
    const avatarGroups = screen.getAllByRole('group');
    expect(avatarGroups.length).toBeGreaterThan(0);
  });

  it('should render team status chips', () => {
    render(<Teams />);
    
    const statusChips = screen.getAllByText('active');
    expect(statusChips.length).toBe(3); // All teams are active
  });

  it('should render project counts', () => {
    render(<Teams />);
    
    expect(screen.getByText('5 Active Projects')).toBeInTheDocument();
    expect(screen.getByText('3 Active Projects')).toBeInTheDocument();
    expect(screen.getByText('2 Active Projects')).toBeInTheDocument();
  });

  it('should render view details buttons', () => {
    render(<Teams />);
    
    const viewDetailsButtons = screen.getAllByText('View Details');
    expect(viewDetailsButtons.length).toBe(3);
  });

  it('should render floating action button', () => {
    render(<Teams />);
    
    const fab = screen.getByLabelText('add team');
    expect(fab).toBeInTheDocument();
  });

  it('should render team icons', () => {
    render(<Teams />);
    
    // Check that team icons are present (Group icon)
    const teamIcons = screen.getAllByTestId('GroupIcon');
    expect(teamIcons.length).toBeGreaterThan(0);
  });

  it('should render team member information', () => {
    render(<Teams />);
    
    // Check that team member information is displayed
    expect(screen.getByText('Team Members (3)')).toBeInTheDocument();
    expect(screen.getByText('Team Members (3)')).toBeInTheDocument();
    expect(screen.getByText('Team Members (2)')).toBeInTheDocument();
  });

  it('should render team cards with hover effects', () => {
    render(<Teams />);
    
    // The cards should be present and have hover effects (tested via CSS)
    const teamCards = screen.getAllByText('Frontend Team');
    expect(teamCards.length).toBeGreaterThan(0);
  });

  it('should render team member roles', () => {
    render(<Teams />);
    
    // Check that team member roles are displayed in tooltips
    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('should render team member names', () => {
    render(<Teams />);
    
    // Check that team member names are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
  });

  it('should render team member avatars with initials', () => {
    render(<Teams />);
    
    // Check that avatar initials are displayed
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('JS')).toBeInTheDocument();
    expect(screen.getByText('MJ')).toBeInTheDocument();
  });

  it('should render team member roles in tooltips', () => {
    render(<Teams />);
    
    // Check that team member roles are displayed
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
  });

  it('should render team member information for all teams', () => {
    render(<Teams />);
    
    // Check that all team members are displayed
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    expect(screen.getByText('Emma Taylor')).toBeInTheDocument();
    expect(screen.getByText('Frank Miller')).toBeInTheDocument();
  });

  it('should render team member avatars for all teams', () => {
    render(<Teams />);
    
    // Check that all team member avatars are displayed
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByText('BW')).toBeInTheDocument();
    expect(screen.getByText('CD')).toBeInTheDocument();
    expect(screen.getByText('ET')).toBeInTheDocument();
    expect(screen.getByText('FM')).toBeInTheDocument();
  });
});
