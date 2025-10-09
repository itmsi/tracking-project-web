# 🔧 Task View - Troubleshooting Guide

## 🚨 **Common Runtime Errors & Solutions**

### **1. "Cannot read properties of undefined (reading 'title')"**

**Error**: `TypeError: Cannot read properties of undefined (reading 'title')`

**Cause**: Task object is undefined when component tries to render

**Solution**: ✅ **FIXED** - Added proper null checking in TaskViewPage:

```typescript
// Before (causing error)
if (!taskView) {
  return <div>Task not found</div>;
}
const { task } = taskView; // task could still be undefined

// After (fixed)
if (!taskView || !taskView.task) {
  return <div>Task not found</div>;
}
const { task } = taskView; // task is guaranteed to exist
```

**Additional Safety Measures**:
- Added fallback values for all task properties
- Added validation in useTaskView hook
- Added mock data fallback for development

### **2. "Invalid task ID" Error**

**Error**: User navigates to `/tasks/abc` (non-numeric ID)

**Solution**: ✅ **FIXED** - Added ID validation:

```typescript
const parsedTaskId = taskId ? parseInt(taskId) : null;

if (taskId && isNaN(parsedTaskId!)) {
  return (
    <Alert severity="error">
      Invalid task ID: {taskId}
    </Alert>
  );
}
```

### **3. API Connection Issues**

**Error**: Network errors, 404, 500, etc.

**Solution**: ✅ **FIXED** - Added graceful fallback:

```typescript
try {
  const response = await taskViewService.getTaskView(taskId);
  setTaskView(response.data);
} catch (apiError) {
  // Fallback to mock data in development
  if (process.env.NODE_ENV === 'development') {
    setTaskView(mockTaskViewData);
    return;
  }
  throw apiError;
}
```

### **4. Permission Errors**

**Error**: User can't access task or perform actions

**Solution**: ✅ **IMPLEMENTED** - Comprehensive permission system:

```typescript
// Check permissions before rendering actions
const canEdit = canEditTask(permissions);
const canComment = canCommentOnTask(permissions);
const canUpload = canUploadToTask(permissions);
const canManageMembers = canManageTaskMembers(permissions);
```

## 🛠️ **Development Setup**

### **Mock Data Usage**

If API is not available, Task View will automatically use mock data in development:

```typescript
// Mock data includes:
- Complete task information
- Sample chat messages
- File attachments
- Team members with different roles
- Various permission scenarios
```

### **Testing Different Permission Levels**

```typescript
// Owner permissions
mockTaskViewData // Full access

// Member permissions  
mockTaskViewDataMember // Limited access

// Viewer permissions
mockTaskViewDataViewer // Read-only access
```

## 🔍 **Debugging Tips**

### **1. Check Browser Console**

Look for these log messages:
- `TaskView fetch error:` - API connection issues
- `API not available, using mock data:` - Fallback to mock data
- `Invalid task data received from server` - API response structure issues

### **2. Network Tab**

Check API calls in browser DevTools:
- `GET /api/tasks/{id}/view` - Main task view endpoint
- Response status codes (200, 404, 500, etc.)
- Response body structure

### **3. React DevTools**

Inspect component state:
- `taskView` - Main data object
- `loading` - Loading state
- `error` - Error messages
- `permissions` - User permissions

### **4. Common API Response Issues**

```typescript
// Expected response structure:
{
  data: {
    task: { id, title, status, priority, ... },
    details: { description, requirements, ... },
    members: [...],
    attachments: [...],
    chat: { messages: [...] },
    user_permissions: { userId, role, permissions }
  }
}
```

## 🚀 **Production Deployment**

### **Environment Variables**

```bash
# .env.production
REACT_APP_API_URL=https://your-api-domain.com
NODE_ENV=production
```

### **API Endpoints Required**

Ensure these endpoints are available:
```
GET    /api/tasks/{id}/view
GET    /api/tasks/{id}/details
POST   /api/tasks/{id}/details
PUT    /api/tasks/{id}/details
GET    /api/tasks/{id}/chat
POST   /api/tasks/{id}/chat
PUT    /api/tasks/{id}/chat/{msgId}
DELETE /api/tasks/{id}/chat/{msgId}
GET    /api/tasks/{id}/attachments
POST   /api/tasks/{id}/attachments/upload
DELETE /api/tasks/{id}/attachments/{id}
GET    /api/tasks/{id}/members
POST   /api/tasks/{id}/members
PUT    /api/tasks/{id}/members/{id}
DELETE /api/tasks/{id}/members/{id}
GET    /api/tasks/{id}/members/search
```

## 📱 **Mobile Issues**

### **Responsive Design**

Task View is fully responsive with:
- Mobile-first CSS
- Touch-friendly interactions
- Optimized layouts for small screens
- Proper scrolling behavior

### **Common Mobile Issues**

1. **Chat scrolling**: Fixed with proper CSS
2. **File upload**: Works with mobile file picker
3. **Touch interactions**: All buttons are touch-friendly
4. **Keyboard handling**: Proper input focus management

## 🔄 **Performance Optimization**

### **Loading States**

All components show loading indicators:
- Skeleton screens for better UX
- Progressive loading of data
- Error boundaries for crash prevention

### **Memory Management**

- Proper cleanup in useEffect hooks
- Optimized re-renders with React.memo
- Efficient state updates

## 📞 **Getting Help**

### **Log Collection**

When reporting issues, include:
1. Browser console logs
2. Network tab screenshots
3. Component state from React DevTools
4. Steps to reproduce
5. Expected vs actual behavior

### **Common Solutions**

1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Check API connectivity** - Verify backend is running
3. **Validate permissions** - Check user role and permissions
4. **Update dependencies** - Run `npm update`
5. **Rebuild project** - Run `npm run build`

## ✅ **Error Prevention**

### **Best Practices**

1. **Always check for null/undefined** before accessing properties
2. **Use TypeScript** for type safety
3. **Implement proper error boundaries**
4. **Add loading states** for all async operations
5. **Validate API responses** before using data
6. **Use mock data** for development and testing
7. **Test with different permission levels**
8. **Handle network failures gracefully**

### **Code Quality**

- ESLint warnings are non-critical but should be addressed
- All TypeScript errors are resolved
- Build process completes successfully
- No runtime errors in production build
