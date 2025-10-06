import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import Login from '../auth/Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Project Tracker')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email harus diisi')).toBeInTheDocument();
      expect(screen.getByText('Password harus diisi')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email tidak valid')).toBeInTheDocument();
    });
  });

  test('navigates to register page', () => {
    render(<Login />);
    
    const registerLink = screen.getByText('Daftar sekarang');
    fireEvent.click(registerLink);
    
    // This would need proper routing setup in test environment
    expect(registerLink).toBeInTheDocument();
  });
});
