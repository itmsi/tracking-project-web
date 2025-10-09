# 🔔 Implementasi Notifikasi Chat

## 📋 Overview

Sistem notifikasi chat telah diintegrasikan ke dalam aplikasi Project Tracker. Ketika ada chat baru di task, semua member task (kecuali pengirim) akan menerima notifikasi real-time melalui WebSocket.

## ✨ Fitur yang Telah Diimplementasikan

### 1. ✅ Real-time Notification via WebSocket
- Notifikasi langsung diterima saat ada chat baru
- Menggunakan WebSocket event `notification`
- Otomatis increment badge count di header

### 2. ✅ Tipe Notifikasi Chat
- **chat_message**: Notifikasi untuk pesan baru di task
- **reply**: Notifikasi ketika seseorang membalas pesan Anda
- **mention**: Notifikasi ketika seseorang mention Anda (coming soon di backend)

### 3. ✅ Notification Center di Header
- Icon bell dengan badge counter untuk unread notifications
- Dropdown menu yang menampilkan daftar notifikasi terbaru
- Support mark as read individual atau mark all as read
- Support delete notification

### 4. ✅ Navigate ke Task Detail
- Klik notifikasi akan membuka halaman task detail
- Untuk notifikasi chat, otomatis scroll ke section chat
- URL format: `/tasks/{taskId}?tab=chat`
- Highlight animation pada chat section selama 2 detik

### 5. ✅ Browser Notification
- Request permission untuk browser notification
- Show native notification ketika ada chat baru
- Support klik untuk navigate ke task

### 6. ✅ Notification Sound (Optional)
- Play sound ketika ada notifikasi baru
- Volume set ke 30% untuk tidak mengganggu
- Graceful fallback jika browser block autoplay

## 🔧 File yang Telah Dimodifikasi

### 1. `src/services/notifications.ts`
**Perubahan:**
- Update `Notification` interface untuk support chat notifications
- Tambah field `sender_id`, `data`, `sender`
- Tambah type `chat_message`, `reply`, `mention`

```typescript
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'task_due' | 'project_updated' | 
        'team_invite' | 'comment_added' | 'chat_message' | 'reply' | 'mention' | 'system';
  sender_id?: string;
  data?: {
    task_id?: string;
    task_title?: string;
    message_id?: string;
    sender_name?: string;
    full_message?: string;
    // ... other fields
  };
  sender?: {
    id?: string;
    name?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  // ... other fields
}
```

### 2. `src/hooks/useNotifications.ts`
**Perubahan:**
- Import `useWebSocket` untuk listen WebSocket events
- Setup WebSocket listener untuk event `notification`
- Auto-increment unread count saat notifikasi baru
- Play notification sound
- Show browser notification

```typescript
// WebSocket listener untuk notifikasi real-time
useEffect(() => {
  if (!socket || !isConnected || hasSetupWebSocket.current) {
    return;
  }

  const handleNotification = (notification: Notification) => {
    // Tambahkan notifikasi baru ke list
    setNotifications(prev => [notification, ...prev]);
    
    // Increment unread count
    setUnreadCount(prev => prev + 1);
    
    // Play sound & show browser notification
    playNotificationSound();
    showBrowserNotification(notification);
  };

  socket.on('notification', handleNotification);
  return () => socket.off('notification', handleNotification);
}, [socket, isConnected]);
```

### 3. `src/components/layout/Header.tsx`
**Perubahan:**
- Update `getNotificationIcon()` untuk support chat icons
- Update `getNotificationColor()` untuk chat notifications
- Tambah `handleNotificationClick()` untuk navigate ke task detail
- Update ListItem dengan ListItemButton untuk clickable notification

```typescript
const handleNotificationClick = async (notification: Notification) => {
  // Mark as read
  if (!notification.is_read) {
    await handleMarkAsRead(notification.id);
  }
  
  // Navigate based on notification type
  if (notification.type === 'chat_message' || notification.type === 'reply' || notification.type === 'mention') {
    const taskId = notification.data?.task_id || notification.related_id;
    if (taskId) {
      navigate(`/tasks/${taskId}?tab=chat`);
    }
  }
  // ... handle other types
};
```

### 4. `src/components/taskView/TaskViewPage.tsx`
**Perubahan:**
- Import `useSearchParams` untuk read query parameters
- Tambah ref untuk chat section
- Auto-scroll ke chat section jika `?tab=chat`
- Highlight animation pada chat section

```typescript
const [searchParams] = useSearchParams();
const chatRef = useRef<HTMLDivElement>(null);

// Auto-scroll ke chat section jika ada query parameter ?tab=chat
useEffect(() => {
  const tab = searchParams.get('tab');
  if (tab === 'chat' && !loading && taskView && chatRef.current) {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      chatRef.current?.classList.add('chat-highlight');
      setTimeout(() => {
        chatRef.current?.classList.remove('chat-highlight');
      }, 2000);
    }, 300);
  }
}, [searchParams, loading, taskView]);
```

### 5. `src/styles/TaskView.css`
**Perubahan:**
- Tambah CSS untuk chat highlight animation
- Tambah scroll-margin-top untuk offset header

```css
/* Chat Highlight Animation (untuk notifikasi) */
#task-chat-section {
  transition: all 0.3s ease;
  scroll-margin-top: 80px;
}

.chat-highlight {
  animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0.3);
  }
}
```

## 🚀 Cara Kerja

### Flow Notifikasi Chat

```
1. User A kirim chat di Task X
         ↓
2. Backend create notifikasi untuk semua member Task X (kecuali User A)
         ↓
3. Backend save notifikasi ke database
         ↓
4. Backend broadcast notifikasi via WebSocket ke user yang online
         ↓
5. Frontend receive event 'notification'
         ↓
6. useNotifications hook process notification:
   - Tambah ke list notifications
   - Increment unread count
   - Play sound
   - Show browser notification
         ↓
7. Header component update badge count
         ↓
8. User klik notifikasi
         ↓
9. Navigate ke /tasks/{taskId}?tab=chat
         ↓
10. TaskViewPage auto-scroll ke chat section
         ↓
11. Chat section highlighted selama 2 detik
```

## 📊 Backend API Requirements

Backend harus support:

### 1. WebSocket Event: `notification`
**Payload:**
```json
{
  "id": "uuid",
  "user_id": "uuid-receiver",
  "sender_id": "uuid-sender",
  "type": "chat_message",
  "title": "Pesan baru dari John Doe",
  "message": "Halo, bagaimana progress task ini?",
  "data": {
    "task_id": "uuid-task",
    "task_title": "Implementasi Chat Feature",
    "message_id": "uuid-message",
    "sender_name": "John Doe",
    "full_message": "Halo, bagaimana progress task ini?"
  },
  "is_read": false,
  "created_at": "2025-01-09T10:00:00Z"
}
```

### 2. HTTP Endpoints
- `GET /api/v1/notifications` - Get list notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## 🧪 Testing

### Manual Testing

1. **Test Notifikasi Real-time:**
   ```
   - Buka 2 browser/tab (User A dan User B)
   - Login sebagai user berbeda di masing-masing tab
   - User A dan User B harus member dari task yang sama
   - User A kirim chat di task
   - User B harus menerima notifikasi real-time
   - Badge count di User B harus bertambah
   ```

2. **Test Navigate ke Task:**
   ```
   - Klik notifikasi chat
   - Harus redirect ke halaman task detail
   - Chat section harus ter-scroll dan ter-highlight
   ```

3. **Test Mark as Read:**
   ```
   - Klik notifikasi
   - Notifikasi harus marked as read
   - Badge count berkurang
   ```

4. **Test Browser Notification:**
   ```
   - Minimize browser atau buka tab lain
   - Kirim chat baru
   - Harus muncul browser notification
   - Klik browser notification harus buka task
   ```

## ✅ Checklist Implementasi

- [x] Update Notification type untuk support chat
- [x] Update useNotifications untuk listen WebSocket
- [x] Implement notification click handler di Header
- [x] Auto-scroll ke chat section dengan query parameter
- [x] CSS highlight animation untuk chat section
- [x] Browser notification support
- [x] Notification sound (optional)
- [x] Mark as read on click
- [x] Badge counter update real-time

## 🎯 Next Steps (Optional Enhancements)

1. **Notification Settings**
   - Allow user enable/disable notification sound
   - Allow user enable/disable browser notification
   - Notification frequency settings

2. **Rich Notifications**
   - Show avatar di notification
   - Show preview gambar untuk attachment
   - Interactive quick reply

3. **Notification History**
   - Dedicated page untuk semua notifikasi
   - Filter by type
   - Search notifications

4. **Email Notifications**
   - Send email untuk important notifications
   - Digest email (daily/weekly summary)

## 🐛 Known Issues

- Notification sound memerlukan file `/public/notification-sound.mp3` (saat ini optional)
- Browser notification memerlukan user permission (request otomatis di first notification)
- WebSocket reconnection mungkin menyebabkan duplicate listeners (sudah di-handle dengan `hasSetupWebSocket` ref)

## 📝 Notes

- Notifikasi hanya dikirim untuk user yang menjadi member task
- Pengirim chat tidak mendapat notifikasi dari chat mereka sendiri
- Notifikasi tersimpan di database untuk diakses nanti (persistent)
- WebSocket mengirim notifikasi real-time hanya untuk user yang online
- Browser notification hanya muncul jika user sudah memberikan permission

---

**Implementation Date:** January 9, 2025  
**Author:** AI Assistant  
**Version:** 1.0

