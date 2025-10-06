import { tasksService } from '../tasks';
import api from '../api';

// Mock the API module
jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Tasks Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should call API with correct endpoint and return response', async () => {
      const mockResponse = {
        data: {
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
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getTasks();

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call API with parameters', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Tasks fetched successfully',
          data: {
            tasks: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0,
            },
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const params = { project_id: '1', status: 'todo', priority: 'high' };
      await tasksService.getTasks(params);

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks', { params });
    });
  });

  describe('createTask', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
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
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const taskData = {
        title: 'New Task',
        description: 'New description',
        status: 'todo',
        priority: 'high',
        project_id: '1',
      };

      const result = await tasksService.createTask(taskData);

      expect(mockedApi.post).toHaveBeenCalledWith('/tasks', taskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getTask', () => {
    it('should call API with correct ID and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
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
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getTask('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTask', () => {
    it('should call API with correct ID and data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            title: 'Updated Task',
            description: 'Updated description',
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
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const taskData = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const result = await tasksService.updateTask('1', taskData);

      expect(mockedApi.put).toHaveBeenCalledWith('/tasks/1', taskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteTask', () => {
    it('should call API with correct ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Task deleted successfully',
        },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await tasksService.deleteTask('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            title: 'Test Task',
            description: 'Test description',
            status: 'in_progress',
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
        },
      };

      mockedApi.patch.mockResolvedValue(mockResponse);

      const result = await tasksService.updateTaskStatus('1', 'in_progress', 0);

      expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1/status', { status: 'in_progress', position: 0 });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('assignTask', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
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
        },
      };

      mockedApi.patch.mockResolvedValue(mockResponse);

      const result = await tasksService.assignTask('1', 'user1');

      expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1/assign', { assigned_to: 'user1' });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle unassigning task', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            title: 'Test Task',
            description: 'Test description',
            status: 'todo',
            priority: 'high',
            project_id: '1',
            assigned_to: null,
            assignee_first_name: null,
            assignee_last_name: null,
            assignee_avatar_url: null,
            due_date: '2024-12-31',
            position: 0,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.patch.mockResolvedValue(mockResponse);

      const result = await tasksService.assignTask('1', null);

      expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1/assign', { assigned_to: null });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTaskPosition', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
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
            position: 1,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.patch.mockResolvedValue(mockResponse);

      const result = await tasksService.updateTaskPosition('1', 1);

      expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1/position', { position: 1 });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSubtasks', () => {
    it('should call API with correct task ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: '2',
              title: 'Subtask 1',
              description: 'Subtask description',
              status: 'todo',
              priority: 'medium',
              project_id: '1',
              parent_task_id: '1',
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
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getSubtasks('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks/1/subtasks');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createSubtask', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '2',
            title: 'New Subtask',
            description: 'New subtask description',
            status: 'todo',
            priority: 'medium',
            project_id: '1',
            parent_task_id: '1',
            assigned_to: 'user1',
            assignee_first_name: 'John',
            assignee_last_name: 'Doe',
            assignee_avatar_url: '',
            due_date: '2024-12-31',
            position: 0,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const subtaskData = {
        title: 'New Subtask',
        description: 'New subtask description',
        status: 'todo',
        priority: 'medium',
        project_id: '1',
      };

      const result = await tasksService.createSubtask('1', subtaskData);

      expect(mockedApi.post).toHaveBeenCalledWith('/tasks/1/subtasks', subtaskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('addTaskAttachment', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            filename: 'test.jpg',
            url: 'https://example.com/test.jpg',
            size: 1024,
            mime_type: 'image/jpeg',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const attachmentData = {
        filename: 'test.jpg',
        url: 'https://example.com/test.jpg',
        size: 1024,
        mime_type: 'image/jpeg',
      };

      const result = await tasksService.addTaskAttachment('1', attachmentData);

      expect(mockedApi.post).toHaveBeenCalledWith('/tasks/1/attachments', attachmentData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('removeTaskAttachment', () => {
    it('should call API with correct IDs', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Attachment removed successfully',
        },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await tasksService.removeTaskAttachment('1', 'attachment1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/tasks/1/attachments/attachment1');
      expect(result).toEqual(mockResponse.data);
    });
  });
});