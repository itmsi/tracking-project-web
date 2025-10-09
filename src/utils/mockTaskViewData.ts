// Mock data untuk testing Task View jika API belum tersedia

import { TaskViewResponse } from '../services/taskViewService';

export const mockTaskViewData: TaskViewResponse = {
  task: {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Implement Task View Feature",
    description: "Create a comprehensive task view with details, chat, attachments, and member management",
    status: "in_progress",
    priority: "high",
    due_date: "2024-01-15T10:00:00Z",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-10T14:30:00Z"
  },
  details: {
    id: "22222222-2222-2222-2222-222222222223",
    description: "This task involves creating a comprehensive task view page that includes:\n\n1. Task details management\n2. Real-time chat system\n3. File attachments\n4. Member management with permissions",
    requirements: "1. Create TaskViewPage component with responsive design\n2. Implement TaskDetails component with edit functionality\n3. Build TaskChat component with real-time messaging\n4. Develop TaskAttachments component for file management\n5. Create TaskMembers component with role-based permissions\n6. Add proper error handling and loading states\n7. Implement permission system for different user roles",
    acceptance_criteria: "1. User can view complete task information\n2. User can edit task details (if permitted)\n3. User can participate in task chat\n4. User can upload and manage files\n5. User can manage task members (if permitted)\n6. All components are responsive and mobile-friendly\n7. Proper error handling for all operations",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-10T14:30:00Z"
  },
  members: [
    {
      id: "11111111-1111-1111-1111-111111111111",
      user_id: "11111111-1111-1111-1111-111111111111",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      avatar_url: "https://via.placeholder.com/40",
      role: "owner",
      permissions: {
        can_edit: true,
        can_comment: true,
        can_upload: true
      },
      joined_at: "2024-01-01T09:00:00Z"
    },
    {
      id: "22222222-2222-2222-2222-222222222224",
      user_id: "22222222-2222-2222-2222-222222222224",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      avatar_url: "https://via.placeholder.com/40",
      role: "admin",
      permissions: {
        can_edit: true,
        can_comment: true,
        can_upload: true
      },
      joined_at: "2024-01-02T10:00:00Z"
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      user_id: "33333333-3333-3333-3333-333333333333",
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob.johnson@example.com",
      avatar_url: "https://via.placeholder.com/40",
      role: "member",
      permissions: {
        can_edit: false,
        can_comment: true,
        can_upload: true
      },
      joined_at: "2024-01-03T11:00:00Z"
    }
  ],
  attachments: [
    {
      id: "44444444-4444-4444-4444-444444444444",
      original_name: "task-requirements.pdf",
      file_path: "https://example.com/files/task-requirements.pdf",
      file_size: 1024000,
      file_type: "document",
      description: "Detailed requirements document",
      is_public: true,
      user_id: "11111111-1111-1111-1111-111111111111",
      uploader_first_name: "John",
      uploader_last_name: "Doe",
      created_at: "2024-01-05T12:00:00Z"
    },
    {
      id: "55555555-5555-5555-5555-555555555555",
      original_name: "design-mockup.png",
      file_path: "https://example.com/files/design-mockup.png",
      file_size: 2048000,
      file_type: "image",
      description: "UI design mockup for task view",
      is_public: true,
      user_id: "22222222-2222-2222-2222-222222222224",
      uploader_first_name: "Jane",
      uploader_last_name: "Smith",
      created_at: "2024-01-07T15:30:00Z"
    }
  ],
  chat: {
    messages: [
      {
        id: "66666666-6666-6666-6666-666666666666",
        message: "I've started working on the task view implementation. The basic structure is ready.",
        user_id: "11111111-1111-1111-1111-111111111111",
        first_name: "John",
        last_name: "Doe",
        avatar_url: "https://via.placeholder.com/40",
        is_edited: false,
        created_at: "2024-01-08T09:00:00Z",
        updated_at: "2024-01-08T09:00:00Z",
        attachments: []
      },
      {
        id: "77777777-7777-7777-7777-777777777777",
        message: "Great! I can help with the chat component. Should we use WebSocket for real-time updates?",
        user_id: "22222222-2222-2222-2222-222222222224",
        first_name: "Jane",
        last_name: "Smith",
        avatar_url: "https://via.placeholder.com/40",
        is_edited: false,
        created_at: "2024-01-08T10:30:00Z",
        updated_at: "2024-01-08T10:30:00Z",
        attachments: []
      },
      {
        id: "88888888-8888-8888-8888-888888888888",
        message: "Yes, WebSocket would be perfect for real-time chat. I'll set up the backend for that.",
        user_id: "11111111-1111-1111-1111-111111111111",
        first_name: "John",
        last_name: "Doe",
        avatar_url: "https://via.placeholder.com/40",
        is_edited: true,
        created_at: "2024-01-08T11:00:00Z",
        updated_at: "2024-01-08T11:15:00Z",
        attachments: []
      },
      {
        id: "99999999-9999-9999-9999-999999999999",
        message: "I've uploaded the design mockup. Please check if this matches the requirements.",
        user_id: "22222222-2222-2222-2222-222222222224",
        first_name: "Jane",
        last_name: "Smith",
        avatar_url: "https://via.placeholder.com/40",
        is_edited: false,
        created_at: "2024-01-08T14:00:00Z",
        updated_at: "2024-01-08T14:00:00Z",
        attachments: [
          {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            name: "design-mockup.png",
            url: "https://example.com/files/design-mockup.png"
          }
        ]
      }
    ]
  },
  user_permissions: {
    userId: "11111111-1111-1111-1111-111111111111",
    isOwner: true,
    role: "owner",
    permissions: {
      can_edit: true,
      can_comment: true,
      can_upload: true
    }
  }
};

// Mock data untuk testing dengan permissions yang berbeda
export const mockTaskViewDataMember: TaskViewResponse = {
  ...mockTaskViewData,
  user_permissions: {
    userId: "33333333-3333-3333-3333-333333333333",
    isOwner: false,
    role: "member",
    permissions: {
      can_edit: false,
      can_comment: true,
      can_upload: true
    }
  }
};

// Mock data untuk testing dengan permissions viewer
export const mockTaskViewDataViewer: TaskViewResponse = {
  ...mockTaskViewData,
  user_permissions: {
    userId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    isOwner: false,
    role: "viewer",
    permissions: {
      can_edit: false,
      can_comment: false,
      can_upload: false
    }
  }
};
