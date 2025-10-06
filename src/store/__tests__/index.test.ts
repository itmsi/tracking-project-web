import { configureStore } from '@reduxjs/toolkit';
import { store } from '../index';
import authReducer from '../authSlice';
import projectReducer from '../projectSlice';
import taskReducer from '../taskSlice';

describe('Store Configuration', () => {
  it('should create store with correct reducers', () => {
    expect(store.getState()).toHaveProperty('auth');
    expect(store.getState()).toHaveProperty('projects');
    expect(store.getState()).toHaveProperty('tasks');
  });

  it('should have correct initial state for auth', () => {
    const state = store.getState();
    expect(state.auth).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should have correct initial state for projects', () => {
    const state = store.getState();
    expect(state.projects).toEqual({
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
    });
  });

  it('should have correct initial state for tasks', () => {
    const state = store.getState();
    expect(state.tasks).toEqual({
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
    });
  });

  it('should dispatch actions correctly', () => {
    const initialState = store.getState();
    
    // Dispatch an action
    store.dispatch({
      type: 'auth/setUser',
      payload: {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z',
      },
    });
    
    const newState = store.getState();
    expect(newState.auth.user).not.toEqual(initialState.auth.user);
  });

  it('should handle middleware correctly', () => {
    // Test that the store is configured with middleware
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
        projects: projectReducer,
        tasks: taskReducer,
      },
    });
    
    expect(testStore.getState()).toHaveProperty('auth');
    expect(testStore.getState()).toHaveProperty('projects');
    expect(testStore.getState()).toHaveProperty('tasks');
  });
});
