import { projectsService } from '../projects';
import api from '../api';

// Mock the API module
jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Projects Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should call API with correct endpoint and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Projects fetched successfully',
          data: {
            projects: [
              {
                id: '1',
                name: 'Test Project',
                description: 'Test description',
                status: 'active',
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                color: '#3f51b5',
                creator_first_name: 'John',
                creator_last_name: 'Doe',
                created_at: '2024-01-01T00:00:00Z',
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

      const result = await projectsService.getProjects();

      expect(mockedApi.get).toHaveBeenCalledWith('/projects', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call API with parameters', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Projects fetched successfully',
          data: {
            projects: [],
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

      const params = { page: 2, limit: 20, status: 'active' };
      await projectsService.getProjects(params);

      expect(mockedApi.get).toHaveBeenCalledWith('/projects', { params });
    });
  });

  describe('createProject', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            name: 'New Project',
            description: 'New description',
            status: 'active',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            color: '#3f51b5',
            creator_first_name: 'John',
            creator_last_name: 'Doe',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const projectData = {
        name: 'New Project',
        description: 'New description',
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        color: '#3f51b5',
      };

      const result = await projectsService.createProject(projectData);

      expect(mockedApi.post).toHaveBeenCalledWith('/projects', projectData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProject', () => {
    it('should call API with correct ID and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            name: 'Test Project',
            description: 'Test description',
            status: 'active',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            color: '#3f51b5',
            creator_first_name: 'John',
            creator_last_name: 'Doe',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getProject('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProject', () => {
    it('should call API with correct ID and data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            name: 'Updated Project',
            description: 'Updated description',
            status: 'active',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            color: '#3f51b5',
            creator_first_name: 'John',
            creator_last_name: 'Doe',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const projectData = {
        name: 'Updated Project',
        description: 'Updated description',
      };

      const result = await projectsService.updateProject('1', projectData);

      expect(mockedApi.put).toHaveBeenCalledWith('/projects/1', projectData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteProject', () => {
    it('should call API with correct ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Project deleted successfully',
        },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await projectsService.deleteProject('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProjectMembers', () => {
    it('should call API with correct project ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: '1',
              user_id: 'user1',
              role: 'member',
              user: {
                id: 'user1',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
              },
            },
          ],
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getProjectMembers('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/projects/1/members');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('addProjectMember', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            user_id: 'user1',
            role: 'member',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const memberData = {
        user_id: 'user1',
        role: 'member',
      };

      const result = await projectsService.addProjectMember('1', memberData);

      expect(mockedApi.post).toHaveBeenCalledWith('/projects/1/members', memberData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProjectMember', () => {
    it('should call API with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            user_id: 'user1',
            role: 'admin',
          },
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const result = await projectsService.updateProjectMember('1', 'user1', 'admin');

      expect(mockedApi.put).toHaveBeenCalledWith('/projects/1/members/user1', { role: 'admin' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('removeProjectMember', () => {
    it('should call API with correct IDs', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Member removed successfully',
        },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await projectsService.removeProjectMember('1', 'user1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/projects/1/members/user1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProjectStats', () => {
    it('should call API with correct project ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            tasks: [
              { status: 'todo', count: '5' },
              { status: 'in_progress', count: '3' },
              { status: 'done', count: '12' },
            ],
            members: 8,
            overdue_tasks: 2,
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getProjectStats('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/projects/1/stats');
      expect(result).toEqual(mockResponse.data);
    });
  });
});