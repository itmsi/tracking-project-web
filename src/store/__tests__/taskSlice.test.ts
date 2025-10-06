import { configureStore } from '@reduxjs/toolkit';
import taskReducer, { fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask, setCurrentTask, clearError, updateTaskInList } from '../taskSlice';
import { tasksService } from '../../services/tasks';

// Mock the tasks service
jest.mock('../../services/tasks');
const mockedTasksService = tasksService as jest.Mocked<typeof tasksService>;

describe('Task Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: taskReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().tasks;
      expect(state).toEqual({
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
  });

  describe('fetchTasks async thunk', () => {
    it('should handle successful tasks fetch', async () => {
      const mockResponse = {
        success: true,
        message: 'Tasks fetched successfully',
        data: {
          tasks: [
            {
              id: '1',
              title: 'Test Task',
              description: 'Test description',
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
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1,
          },
        },
      };

      mockedTasksService.getTasks.mockResolvedValue(mockResponse);

      await store.dispatch(fetchTasks());

      const state = store.getState().tasks;
      expect(state.tasks).toEqual(mockResponse.data.tasks);
      expect(state.pagination).toEqual(mockResponse.data.pagination);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle tasks fetch failure', async () => {
      const mockError = 'Failed to fetch tasks';
      mockedTasksService.getTasks.mockRejectedValue(mockError);

      await store.dispatch(fetchTasks());

      const state = store.getState().tasks;
      expect(state.tasks).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch tasks');
    });
  });

  describe('createTask async thunk', () => {
    it('should handle successful task creation', async () => {
      const mockTask = {
        id: '1',
        title: 'New Task',
        description: 'New description',
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
      };

      const mockResponse = {
        success: true,
        data: mockTask,
      };

      mockedTasksService.createTask.mockResolvedValue(mockResponse);

      const taskData = {
        title: 'New Task',
        description: 'New description',
        status: 'todo',
        priority: 'high',
        project_id: '1',
      };

      await store.dispatch(createTask(taskData));

      const state = store.getState().tasks;
      expect(state.tasks).toContain(mockTask);
    });

    it('should handle task creation failure', async () => {
      const mockError = 'Failed to create task';
      mockedTasksService.createTask.mockRejectedValue(mockError);

      const taskData = {
        title: 'New Task',
        description: 'New description',
      };

      await store.dispatch(createTask(taskData));

      const state = store.getState().tasks;
      expect(state.tasks).toEqual([]);
    });
  });

  describe('updateTask async thunk', () => {
    it('should handle successful task update', async () => {
      const initialTask = {
        id: '1',
        title: 'Old Task',
        description: 'Old description',
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
      };

      const updatedTask = {
        ...initialTask,
        title: 'Updated Task',
        description: 'Updated description',
      };

      const mockResponse = {
        success: true,
        data: updatedTask,
      };

      mockedTasksService.updateTask.mockResolvedValue(mockResponse);

      // First add a task to the store
      store.dispatch({
        type: 'tasks/createTask/fulfilled',
        payload: initialTask,
      });

      // Then update it
      await store.dispatch(updateTask({
        id: '1',
        taskData: { title: 'Updated Task', description: 'Updated description' },
      }));

      const state = store.getState().tasks;
      expect(state.tasks[0]).toEqual(updatedTask);
    });
  });

  describe('updateTaskStatus async thunk', () => {
    it('should handle successful task status update', async () => {
      const initialTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
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
      };

      const updatedTask = {
        ...initialTask,
        status: 'in_progress',
      };

      const mockResponse = {
        success: true,
        data: updatedTask,
      };

      mockedTasksService.updateTaskStatus.mockResolvedValue(mockResponse);

      // First add a task to the store
      store.dispatch({
        type: 'tasks/createTask/fulfilled',
        payload: initialTask,
      });

      // Then update its status
      await store.dispatch(updateTaskStatus({
        id: '1',
        status: 'in_progress',
        position: 0,
      }));

      const state = store.getState().tasks;
      expect(state.tasks[0]).toEqual(updatedTask);
    });
  });

  describe('deleteTask async thunk', () => {
    it('should handle successful task deletion', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
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
      };

      const mockResponse = {
        success: true,
        message: 'Task deleted successfully',
      };

      mockedTasksService.deleteTask.mockResolvedValue(mockResponse);

      // First add a task to the store
      store.dispatch({
        type: 'tasks/createTask/fulfilled',
        payload: mockTask,
      });

      // Then delete it
      await store.dispatch(deleteTask('1'));

      const state = store.getState().tasks;
      expect(state.tasks).not.toContain(mockTask);
    });
  });

  describe('setCurrentTask action', () => {
    it('should set current task', () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
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
      };

      store.dispatch(setCurrentTask(mockTask));

      const state = store.getState().tasks;
      expect(state.currentTask).toEqual(mockTask);
    });

    it('should clear current task when null is passed', () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
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
      };

      // First set a task
      store.dispatch(setCurrentTask(mockTask));
      
      // Then clear it
      store.dispatch(setCurrentTask(null));

      const state = store.getState().tasks;
      expect(state.currentTask).toBeNull();
    });
  });

  describe('updateTaskInList action', () => {
    it('should update task in the list', () => {
      const initialTask = {
        id: '1',
        title: 'Old Task',
        description: 'Old description',
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
      };

      const updatedTask = {
        ...initialTask,
        title: 'Updated Task',
        description: 'Updated description',
      };

      // First add a task to the store
      store.dispatch({
        type: 'tasks/createTask/fulfilled',
        payload: initialTask,
      });

      // Then update it in the list
      store.dispatch(updateTaskInList(updatedTask));

      const state = store.getState().tasks;
      expect(state.tasks[0]).toEqual(updatedTask);
    });
  });

  describe('clearError action', () => {
    it('should clear error state', () => {
      // First set an error
      store.dispatch({
        type: 'tasks/fetchTasks/rejected',
        payload: 'Some error',
      });

      // Then clear it
      store.dispatch(clearError());

      const state = store.getState().tasks;
      expect(state.error).toBeNull();
    });
  });
});
