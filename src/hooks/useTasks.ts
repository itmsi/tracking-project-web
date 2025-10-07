import { useState, useEffect, useCallback } from 'react';
import { tasksService, Task } from '../services/tasks';

export const useTasks = (params: any = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksService.getTasks(params);
      setTasks(response.data.tasks);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await tasksService.createTask(taskData);
      await fetchTasks(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Update task
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await tasksService.updateTask(id, taskData);
      await fetchTasks(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const response = await tasksService.deleteTask(id);
      await fetchTasks(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Update task status (untuk kanban)
  const updateTaskStatus = async (id: string, status: string, position?: number) => {
    try {
      const response = await tasksService.updateTaskStatus(id, status, position);
      await fetchTasks(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Assign task
  const assignTask = async (id: string, assignedTo: string | null) => {
    try {
      const response = await tasksService.assignTask(id, assignedTo);
      await fetchTasks(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignTask,
  };
};

// Hook untuk single task
export const useTask = (id: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await tasksService.getTask(id);
      setTask(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat task');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    task,
    loading,
    error,
    refetch: fetchTask,
  };
};
