import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getProfile, login, logout, register } from '../store/authSlice';
import { LoginCredentials, RegisterData } from '../services/auth';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  };

  const registerUser = async (userData: RegisterData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        await dispatch(getProfile()).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error };
      }
    }
    return { success: false, error: 'No token available' };
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refreshProfile,
  };
};
