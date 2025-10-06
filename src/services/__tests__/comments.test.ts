import { commentsService } from '../comments';
import api from '../api';

// Mock the API module
jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Comments Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('should call API with correct endpoint and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Comments fetched successfully',
          data: {
            comments: [
              {
                id: '1',
                content: 'This is a test comment',
                task_id: '1',
                user_id: 'user1',
                user: {
                  id: 'user1',
                  first_name: 'John',
                  last_name: 'Doe',
                  email: 'john@example.com',
                },
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

      const result = await commentsService.getComments('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/comments/task/1', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call API with parameters', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Comments fetched successfully',
          data: {
            comments: [],
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

      const params = { page: 2, limit: 20 };
      await commentsService.getComments('1', params);

      expect(mockedApi.get).toHaveBeenCalledWith('/comments/task/1', { params });
    });
  });

  describe('createComment', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            content: 'This is a new comment',
            task_id: '1',
            user_id: 'user1',
            user: {
              id: 'user1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
            },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const commentData = {
        content: 'This is a new comment',
        parent_comment_id: null,
        attachments: [],
      };

      const result = await commentsService.createComment('1', commentData);

      expect(mockedApi.post).toHaveBeenCalledWith('/comments/task/1', commentData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateComment', () => {
    it('should call API with correct ID and data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            content: 'This is an updated comment',
            task_id: '1',
            user_id: 'user1',
            user: {
              id: 'user1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
            },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const commentData = {
        content: 'This is an updated comment',
      };

      const result = await commentsService.updateComment('1', commentData);

      expect(mockedApi.put).toHaveBeenCalledWith('/comments/1', commentData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteComment', () => {
    it('should call API with correct ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Comment deleted successfully',
        },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await commentsService.deleteComment('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/comments/1');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
