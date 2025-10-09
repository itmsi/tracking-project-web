import { useState, useEffect } from 'react';
import { taskViewService, TaskViewResponse } from '../services/taskViewService';

export const useTaskView = (taskId: string | null) => {
  const [taskView, setTaskView] = useState<TaskViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskView = async (forceRefresh: boolean = false) => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      
      if (forceRefresh) {
        console.log('🔄 Force refreshing TaskView for task:', taskId);
      }
      
      // Try to fetch from API first
      const response = await taskViewService.getTaskView(taskId);
      
      console.log('✅ TaskView API full response:', response);
      console.log('✅ TaskView response.data:', response.data);
      
      // API returns: { success: true, message: "...", data: { task, details, ... } }
      // Axios wraps it in response.data, so actual data is in response.data.data
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to fetch task view');
      }
      
      const taskViewData = apiResponse.data;
      console.log('✅ TaskView extracted data:', taskViewData);
      
      // Validate response structure
      if (!taskViewData || !taskViewData.task) {
        console.error('❌ Invalid task data structure:', { response, taskViewData });
        throw new Error('Invalid task data structure received from server');
      }
      
      setTaskView(taskViewData);
      console.log('✅ TaskView state updated successfully', taskViewData);
    } catch (err: any) {
      console.error('TaskView fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load task view');
      setTaskView(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      console.log('🔄 useTaskView: Fetching data for task:', taskId);
      fetchTaskView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return { 
    taskView, 
    loading, 
    error, 
    refetch: fetchTaskView 
  };
};
