import { configureStore } from '@reduxjs/toolkit';
import projectReducer, { fetchProjects, createProject, updateProject, deleteProject, setCurrentProject, clearError } from '../projectSlice';
import { projectsService } from '../../services/projects';

// Mock the projects service
jest.mock('../../services/projects');
const mockedProjectsService = projectsService as jest.Mocked<typeof projectsService>;

describe('Project Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projects: projectReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().projects;
      expect(state).toEqual({
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
  });

  describe('fetchProjects async thunk', () => {
    it('should handle successful projects fetch', async () => {
      const mockResponse = {
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
      };

      mockedProjectsService.getProjects.mockResolvedValue(mockResponse);

      await store.dispatch(fetchProjects());

      const state = store.getState().projects;
      expect(state.projects).toEqual(mockResponse.data.projects);
      expect(state.pagination).toEqual(mockResponse.data.pagination);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle projects fetch failure', async () => {
      const mockError = 'Failed to fetch projects';
      mockedProjectsService.getProjects.mockRejectedValue(mockError);

      await store.dispatch(fetchProjects());

      const state = store.getState().projects;
      expect(state.projects).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch projects');
    });
  });

  describe('createProject async thunk', () => {
    it('should handle successful project creation', async () => {
      const mockProject = {
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
      };

      const mockResponse = {
        success: true,
        data: mockProject,
      };

      mockedProjectsService.createProject.mockResolvedValue(mockResponse);

      const projectData = {
        name: 'New Project',
        description: 'New description',
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        color: '#3f51b5',
      };

      await store.dispatch(createProject(projectData));

      const state = store.getState().projects;
      expect(state.projects).toContain(mockProject);
    });

    it('should handle project creation failure', async () => {
      const mockError = 'Failed to create project';
      mockedProjectsService.createProject.mockRejectedValue(mockError);

      const projectData = {
        name: 'New Project',
        description: 'New description',
      };

      await store.dispatch(createProject(projectData));

      const state = store.getState().projects;
      expect(state.projects).toEqual([]);
    });
  });

  describe('updateProject async thunk', () => {
    it('should handle successful project update', async () => {
      const initialProject = {
        id: '1',
        name: 'Old Project',
        description: 'Old description',
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        color: '#3f51b5',
        creator_first_name: 'John',
        creator_last_name: 'Doe',
        created_at: '2024-01-01T00:00:00Z',
      };

      const updatedProject = {
        ...initialProject,
        name: 'Updated Project',
        description: 'Updated description',
      };

      const mockResponse = {
        success: true,
        data: updatedProject,
      };

      mockedProjectsService.updateProject.mockResolvedValue(mockResponse);

      // First add a project to the store
      store.dispatch({
        type: 'projects/createProject/fulfilled',
        payload: initialProject,
      });

      // Then update it
      await store.dispatch(updateProject({
        id: '1',
        projectData: { name: 'Updated Project', description: 'Updated description' },
      }));

      const state = store.getState().projects;
      expect(state.projects[0]).toEqual(updatedProject);
    });
  });

  describe('deleteProject async thunk', () => {
    it('should handle successful project deletion', async () => {
      const mockProject = {
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
      };

      const mockResponse = {
        success: true,
        message: 'Project deleted successfully',
      };

      mockedProjectsService.deleteProject.mockResolvedValue(mockResponse);

      // First add a project to the store
      store.dispatch({
        type: 'projects/createProject/fulfilled',
        payload: mockProject,
      });

      // Then delete it
      await store.dispatch(deleteProject('1'));

      const state = store.getState().projects;
      expect(state.projects).not.toContain(mockProject);
    });
  });

  describe('setCurrentProject action', () => {
    it('should set current project', () => {
      const mockProject = {
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
      };

      store.dispatch(setCurrentProject(mockProject));

      const state = store.getState().projects;
      expect(state.currentProject).toEqual(mockProject);
    });

    it('should clear current project when null is passed', () => {
      const mockProject = {
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
      };

      // First set a project
      store.dispatch(setCurrentProject(mockProject));
      
      // Then clear it
      store.dispatch(setCurrentProject(null));

      const state = store.getState().projects;
      expect(state.currentProject).toBeNull();
    });
  });

  describe('clearError action', () => {
    it('should clear error state', () => {
      // First set an error
      store.dispatch({
        type: 'projects/fetchProjects/rejected',
        payload: 'Some error',
      });

      // Then clear it
      store.dispatch(clearError());

      const state = store.getState().projects;
      expect(state.error).toBeNull();
    });
  });
});
