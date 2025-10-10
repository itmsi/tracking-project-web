/**
 * Testing Utility untuk Notifikasi
 * 
 * Script ini digunakan untuk testing notifikasi secara manual dari browser console
 * HANYA untuk development mode
 */

import { AppNotification } from '../services/notifications';

// Declare global window interface for WebSocket instance
declare global {
  interface Window {
    __WEBSOCKET_INSTANCE__: any;
    testNotification: (type?: AppNotification['type']) => void;
    simulateNotification: (notification: Partial<AppNotification>) => void;
    debugWebSocket: () => void;
  }
}

/**
 * Simulasi notifikasi chat message
 */
export const simulateChatNotification = () => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket) {
    console.error('❌ WebSocket instance tidak ditemukan!');
    console.log('💡 Pastikan Anda dalam development mode dan WebSocket sudah terkoneksi');
    return;
  }

  if (!socket.connected) {
    console.error('❌ WebSocket tidak terkoneksi!');
    console.log('💡 Status:', socket.connected ? 'Connected' : 'Disconnected');
    return;
  }

  const mockNotification: AppNotification = {
    id: `test-${Date.now()}`,
    user_id: 'current-user-id',
    sender_id: 'test-sender-id',
    type: 'chat_message',
    title: 'Pesan baru dari Test User',
    message: 'Ini adalah pesan test untuk notifikasi chat',
    data: {
      task_id: 'test-task-123',
      task_title: 'Test Task',
      message_id: 'test-message-123',
      sender_name: 'Test User',
      full_message: 'Ini adalah pesan test lengkap untuk notifikasi chat'
    },
    is_read: false,
    created_at: new Date().toISOString()
  };

  console.log('📤 Mensimulasikan notifikasi chat...');
  console.log('📦 Data:', mockNotification);
  
  // Emit event notification secara manual untuk testing
  // Note: Dalam production, event ini dikirim oleh backend
  socket.emit('notification', mockNotification);
  
  console.log('✅ Notifikasi dikirim! Cek console untuk melihat hasilnya.');
};

/**
 * Simulasi notifikasi custom
 */
export const simulateCustomNotification = (notification: Partial<AppNotification>) => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket || !socket.connected) {
    console.error('❌ WebSocket tidak tersedia atau tidak terkoneksi!');
    return;
  }

  const fullNotification: AppNotification = {
    id: `test-${Date.now()}`,
    user_id: 'current-user-id',
    type: 'system',
    title: 'Test Notification',
    message: 'This is a test notification',
    is_read: false,
    created_at: new Date().toISOString(),
    ...notification
  };

  console.log('📤 Mensimulasikan notifikasi custom...');
  console.log('📦 Data:', fullNotification);
  
  socket.emit('notification', fullNotification);
  
  console.log('✅ Notifikasi dikirim!');
};

/**
 * Debug WebSocket - tampilkan semua event yang diterima
 */
export const debugWebSocket = () => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket) {
    console.error('❌ WebSocket instance tidak ditemukan!');
    return;
  }

  console.log('🔍 WebSocket Debug Info:');
  console.log('   - Socket ID:', socket.id);
  console.log('   - Connected:', socket.connected);
  console.log('   - Disconnected:', socket.disconnected);
  
  // List all registered events
  console.log('\n📋 Registered Events:');
  const events = socket._callbacks || {};
  Object.keys(events).forEach(event => {
    const cleanEvent = event.replace('$', '');
    console.log(`   - ${cleanEvent}:`, events[event].length, 'listeners');
  });

  // Listen to ALL events untuk debugging
  console.log('\n🎧 Listening to ALL events...');
  console.log('💡 Semua event WebSocket akan di-log ke console');
  
  socket.onAny((eventName: string, ...args: any[]) => {
    console.log(`📡 WebSocket Event: ${eventName}`, args);
  });

  console.log('\n✅ Debug mode aktif! Kirim chat atau notifikasi untuk melihat event yang diterima.');
};

/**
 * Test notifikasi dengan berbagai tipe
 */
export const testNotification = (type: AppNotification['type'] = 'chat_message') => {
  const notificationTemplates: Record<AppNotification['type'], Partial<AppNotification>> = {
    chat_message: {
      type: 'chat_message',
      title: 'Pesan baru dari Test User',
      message: 'Halo! Ini pesan test.',
      data: {
        task_id: 'test-task-123',
        task_title: 'Test Task',
        message_id: 'msg-123',
        sender_name: 'Test User'
      }
    },
    task_assigned: {
      type: 'task_assigned',
      title: 'Task baru ditugaskan',
      message: 'Anda ditugaskan task baru',
      data: {
        task_id: 'task-123',
        task_title: 'Complete Feature X'
      }
    },
    task_completed: {
      type: 'task_completed',
      title: 'Task selesai',
      message: 'Task telah diselesaikan',
      data: {
        task_id: 'task-123',
        task_title: 'Feature X'
      }
    },
    comment_added: {
      type: 'comment_added',
      title: 'Komentar baru',
      message: 'Seseorang menambahkan komentar',
      data: {
        task_id: 'task-123'
      }
    },
    reply: {
      type: 'reply',
      title: 'Balasan baru',
      message: 'Seseorang membalas pesan Anda',
      data: {
        task_id: 'task-123',
        message_id: 'msg-123',
        reply_to_message_id: 'msg-122'
      }
    },
    mention: {
      type: 'mention',
      title: 'Anda di-mention',
      message: 'Seseorang mention Anda di chat',
      data: {
        task_id: 'task-123',
        message_id: 'msg-123'
      }
    },
    project_updated: {
      type: 'project_updated',
      title: 'Project diupdate',
      message: 'Ada update di project',
      data: {
        project_name: 'Test Project'
      }
    },
    team_invite: {
      type: 'team_invite',
      title: 'Undangan tim',
      message: 'Anda diundang ke tim',
      data: {
        team_name: 'Test Team'
      }
    },
    task_due: {
      type: 'task_due',
      title: 'Task jatuh tempo',
      message: 'Task akan jatuh tempo besok',
      data: {
        task_id: 'task-123',
        due_date: new Date().toISOString()
      }
    },
    system: {
      type: 'system',
      title: 'Notifikasi sistem',
      message: 'Ini adalah notifikasi dari sistem'
    }
  };

  const template = notificationTemplates[type];
  
  if (!template) {
    console.error('❌ Tipe notifikasi tidak valid:', type);
    console.log('💡 Tipe yang tersedia:', Object.keys(notificationTemplates).join(', '));
    return;
  }

  simulateCustomNotification(template);
};

// Expose functions ke window untuk testing dari console
if (process.env.NODE_ENV === 'development') {
  window.testNotification = testNotification;
  window.simulateNotification = simulateCustomNotification;
  window.debugWebSocket = debugWebSocket;

  console.log('🧪 Testing utilities loaded!');
  console.log('💡 Cara penggunaan:');
  console.log('   - testNotification("chat_message") // Test notifikasi chat');
  console.log('   - testNotification("task_assigned") // Test notifikasi task');
  console.log('   - debugWebSocket() // Debug WebSocket events');
  console.log('   - simulateNotification({...}) // Custom notification');
}

export default {
  simulateChatNotification,
  simulateCustomNotification,
  debugWebSocket,
  testNotification
};

