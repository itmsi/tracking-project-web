import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksService, Task } from '../services/tasks';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: any = {}) => {
    const response = await tasksService.getTasks(params);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue, dispatch }) => {
    try {
      const response = await tasksService.createTask(taskData);
      // Force refetch tasks setelah create untuk memastikan data terbaru
      dispatch(fetchTasks({}));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: string; taskData: Partial<Task> }, { rejectWithValue, dispatch }) => {
    try {
      const response = await tasksService.updateTask(id, taskData);
      // Force refetch tasks setelah update untuk memastikan data terbaru
      dispatch(fetchTasks({}));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status, position }: { id: string; status: string; position?: number }, { rejectWithValue, dispatch }) => {
    try {
      const response = await tasksService.updateTaskStatus(id, status, position);
      // Force refetch tasks setelah update status untuk memastikan data terbaru
      dispatch(fetchTasks({}));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await tasksService.deleteTask(id);
      // Force refetch tasks setelah delete untuk memastikan data terbaru
      dispatch(fetchTasks({}));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: TaskState = {
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
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTaskInList: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    forceRefresh: (state) => {
      // Reset state untuk memaksa refetch
      state.tasks = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload?.tasks || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.unshift(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          if (state.currentTask?.id === action.payload.id) {
            state.currentTask = action.payload;
          }
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          if (state.currentTask?.id === action.payload.id) {
            state.currentTask = action.payload;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      });
  },
});

export const { setCurrentTask, clearError, updateTaskInList, forceRefresh } = taskSlice.actions;
export default taskSlice.reducer;
