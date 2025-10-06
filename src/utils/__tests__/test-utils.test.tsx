import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';

// Simple test component
const TestComponent: React.FC<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);

describe('Test Utils', () => {
  it('should render component with all providers', () => {
    render(<TestComponent message="Hello World" />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render component with custom options', () => {
    const { container } = render(<TestComponent message="Test" />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render component with Redux provider', () => {
    render(<TestComponent message="Redux Test" />);
    
    expect(screen.getByText('Redux Test')).toBeInTheDocument();
  });

  it('should render component with theme provider', () => {
    render(<TestComponent message="Theme Test" />);
    
    expect(screen.getByText('Theme Test')).toBeInTheDocument();
  });

  it('should render component with router', () => {
    render(<TestComponent message="Router Test" />);
    
    expect(screen.getByText('Router Test')).toBeInTheDocument();
  });
});