# 🎯 Task View - Panduan Penggunaan

## 📋 **Overview**

Task View adalah fitur lengkap untuk melihat dan mengelola detail task dengan semua komponennya:
- ✅ **Task Details** - Description, requirements, acceptance criteria
- ✅ **Task Chat** - Real-time chat antar member
- ✅ **File Attachments** - Upload dan manage file attachments
- ✅ **Member Management** - Add/remove members dengan permissions

## 🚀 **Cara Menggunakan**

### **1. Akses Task View**

Task View dapat diakses melalui:
- **Dari halaman Tasks**: Klik menu "View Task Details" pada task card
- **Dari Kanban Board**: Klik menu "View Details" pada task card
- **Direct URL**: `/tasks/{taskId}`

### **2. Fitur yang Tersedia**

#### **Task Details**
- Lihat dan edit description, requirements, acceptance criteria
- Hanya owner dan admin yang bisa edit
- Auto-save dengan notifikasi

#### **Task Chat**
- Chat real-time dengan semua member task
- Edit dan delete pesan sendiri
- Load more messages dengan pagination
- Support file attachments di chat

#### **File Attachments**
- Upload berbagai jenis file (image, video, audio, document)
- Set file sebagai public atau private
- Download dan delete file
- Preview file berdasarkan tipe

#### **Member Management**
- Lihat semua member task dengan role dan permissions
- Add member baru dengan search user
- Update role dan permissions member
- Remove member (kecuali owner)

### **3. Permissions System**

#### **Owner**
- Semua permissions (edit, comment, upload, manage members)
- Tidak bisa dihapus dari task

#### **Admin**
- Semua permissions kecuali manage owner
- Bisa promote/demote member lain

#### **Member**
- Bisa comment dan upload (default)
- Bisa edit jika diberikan permission

#### **Viewer**
- Hanya bisa melihat task
- Tidak bisa comment atau upload

### **4. API Endpoints**

Semua API menggunakan prefix `/api/tasks/{taskId}`:

```
GET    /api/tasks/{taskId}/view           # Complete task view
GET    /api/tasks/{taskId}/details        # Task details
POST   /api/tasks/{taskId}/details        # Create task details
PUT    /api/tasks/{taskId}/details        # Update task details

GET    /api/tasks/{taskId}/chat           # Chat messages
POST   /api/tasks/{taskId}/chat           # Send message
PUT    /api/tasks/{taskId}/chat/{msgId}   # Update message
DELETE /api/tasks/{taskId}/chat/{msgId}   # Delete message

GET    /api/tasks/{taskId}/attachments    # Get attachments
POST   /api/tasks/{taskId}/attachments/upload # Upload file
DELETE /api/tasks/{taskId}/attachments/{id}   # Delete file

GET    /api/tasks/{taskId}/members        # Get members
POST   /api/tasks/{taskId}/members        # Add member
PUT    /api/tasks/{taskId}/members/{id}   # Update member
DELETE /api/tasks/{taskId}/members/{id}   # Remove member
GET    /api/tasks/{taskId}/members/search # Search users
```

### **5. Custom Hooks**

```typescript
// Task View Hook
const { taskView, loading, error, refetch } = useTaskView(taskId);

// Task Chat Hook
const { messages, sendMessage, updateMessage, deleteMessage } = useTaskChat(taskId);

// Task Attachments Hook
const { attachments, uploadFile, deleteFile } = useTaskAttachments(taskId);

// Task Members Hook
const { members, addMember, updateMember, removeMember } = useTaskMembers(taskId);
```

### **6. Context Provider**

Task View menggunakan Context Provider untuk global state management:

```typescript
import { TaskViewProvider, useTaskViewActions } from '../contexts/TaskViewContext';

// Actions available
const { setTaskView, updateTaskDetails, addChatMessage, addAttachment, addMember } = useTaskViewActions();
```

### **7. Utility Functions**

```typescript
import { 
  checkPermission, 
  canEditTask, 
  canCommentOnTask, 
  canUploadToTask,
  canManageTaskMembers,
  getRoleBadgeColor,
  getStatusColor 
} from '../utils/permissions';
```

## 🎨 **Styling**

Task View menggunakan:
- **Material-UI** untuk komponen UI
- **Custom CSS** di `src/styles/TaskView.css`
- **Responsive design** untuk mobile dan desktop
- **Dark/Light theme** support

## 🔧 **Development**

### **File Structure**
```
src/
├── components/taskView/
│   ├── TaskViewPage.tsx      # Main page component
│   ├── TaskDetails.tsx       # Task details component
│   ├── TaskChat.tsx          # Chat component
│   ├── TaskAttachments.tsx   # Attachments component
│   ├── TaskMembers.tsx       # Members component
│   └── index.ts              # Export file
├── hooks/
│   ├── useTaskView.ts        # Main task view hook
│   ├── useTaskChat.ts        # Chat hook
│   ├── useTaskAttachments.ts # Attachments hook
│   └── useTaskMembers.ts     # Members hook
├── services/
│   └── taskViewService.ts    # API service
├── contexts/
│   └── TaskViewContext.tsx   # Context provider
├── utils/
│   └── permissions.ts        # Permission utilities
└── styles/
    └── TaskView.css          # Custom styles
```

### **Testing**

```bash
# Run tests
npm test

# Test specific components
npm test -- --testNamePattern="TaskView"
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Task not found**: Pastikan taskId valid dan user memiliki akses
2. **Permission denied**: Check user permissions untuk task
3. **Upload failed**: Check file size dan format yang didukung
4. **Chat not loading**: Check network connection dan API response

### **Debug Mode**

Enable debug mode untuk melihat detailed logs:

```typescript
// Add to component
console.log('Task View Debug:', { taskView, permissions, error });
```

## 📱 **Mobile Support**

Task View fully responsive dengan:
- **Mobile-first design**
- **Touch-friendly interactions**
- **Optimized layouts** untuk small screens
- **Swipe gestures** untuk navigation

## 🔄 **Updates**

### **v1.0.0** (Current)
- ✅ Complete Task View implementation
- ✅ Real-time chat system
- ✅ File attachments management
- ✅ Member management dengan permissions
- ✅ Responsive design
- ✅ Context provider untuk state management

### **Future Updates**
- 🔄 Real-time notifications
- 🔄 Advanced file preview
- 🔄 Task templates
- 🔄 Bulk operations
- 🔄 Advanced search dan filtering
