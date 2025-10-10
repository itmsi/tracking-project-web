/**
 * Debugging Utility untuk Chat WebSocket
 * 
 * Script ini untuk membantu debug masalah chat yang tidak terkirim
 * HANYA untuk development mode
 */

declare global {
  interface Window {
    debugChat: () => void;
    testSendMessage: (taskId: string, message?: string) => void;
    checkChatStatus: () => void;
  }
}

/**
 * Quick debug untuk cek status chat
 */
export const checkChatStatus = () => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  console.log('=== 🔍 CHAT STATUS DEBUG ===\n');
  
  // 1. Cek WebSocket instance
  if (!socket) {
    console.error('❌ WebSocket instance tidak ditemukan!');
    console.log('💡 Tips: Pastikan aplikasi sudah berjalan dan Anda sudah login');
    return;
  }
  
  console.log('✅ WebSocket instance ditemukan');
  
  // 2. Cek connection status
  console.log('\n📡 Connection Status:');
  console.log('   - Connected:', socket.connected);
  console.log('   - Socket ID:', socket.id);
  console.log('   - Disconnected:', socket.disconnected);
  
  if (!socket.connected) {
    console.error('❌ WebSocket TIDAK TERKONEKSI!');
    console.log('💡 Tips:');
    console.log('   1. Cek backend WebSocket server berjalan');
    console.log('   2. Logout dan login kembali');
    console.log('   3. Restart aplikasi');
    return;
  }
  
  console.log('✅ WebSocket TERKONEKSI');
  
  // 3. Cek registered events
  console.log('\n📋 Registered Events:');
  const events = socket._callbacks || {};
  const chatEvents = [
    'send_message',
    'new_message',
    'message_edited',
    'message_deleted',
    'join_task',
    'leave_task',
    'typing_start',
    'typing_stop',
    'user_typing',
    'user_stopped_typing'
  ];
  
  chatEvents.forEach(eventName => {
    const fullEventName = `$${eventName}`;
    const listeners = events[fullEventName];
    if (listeners && listeners.length > 0) {
      console.log(`   ✅ ${eventName}: ${listeners.length} listener(s)`);
    } else {
      console.log(`   ❌ ${eventName}: NO LISTENERS`);
    }
  });
  
  // 4. Cek notification events (untuk memastikan tidak conflict)
  console.log('\n🔔 Notification Events:');
  const notifEvent = events['$notification'];
  if (notifEvent && notifEvent.length > 0) {
    console.log(`   ✅ notification: ${notifEvent.length} listener(s)`);
  } else {
    console.log(`   ⚠️ notification: NO LISTENERS (notifikasi mungkin tidak akan berfungsi)`);
  }
  
  // 5. Tips untuk test
  console.log('\n🧪 Test Commands:');
  console.log('   testSendMessage("YOUR_TASK_ID", "Test message")');
  console.log('   debugWebSocket() // untuk listen semua events');
  
  console.log('\n✅ Status check selesai!');
};

/**
 * Test kirim message manual
 */
export const testSendMessage = (taskId: string, message: string = 'Test message dari console') => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket) {
    console.error('❌ WebSocket instance tidak ditemukan!');
    return;
  }
  
  if (!socket.connected) {
    console.error('❌ WebSocket tidak terkoneksi!');
    return;
  }
  
  if (!taskId) {
    console.error('❌ Task ID diperlukan!');
    console.log('💡 Usage: testSendMessage("task-uuid", "Your message")');
    return;
  }
  
  console.log('📤 Sending test message...');
  console.log('   Task ID:', taskId);
  console.log('   Message:', message);
  
  // Emit send_message event
  socket.emit('send_message', {
    taskId: taskId,
    message: message,
    attachments: [],
    replyTo: null
  });
  
  console.log('✅ Message sent!');
  console.log('💡 Tunggu 1-2 detik, harus ada event "new_message" diterima');
  console.log('💡 Jika tidak ada, cek backend logs');
  
  // Listen untuk response
  const responseListener = (data: any) => {
    console.log('📨 Response received: new_message');
    console.log('   Data:', data);
    socket.off('new_message', responseListener);
  };
  
  socket.once('new_message', responseListener);
  
  // Timeout untuk warning
  setTimeout(() => {
    socket.off('new_message', responseListener);
    console.warn('⚠️ Tidak ada response setelah 5 detik');
    console.log('💡 Kemungkinan:');
    console.log('   1. Backend tidak menerima event');
    console.log('   2. Backend error saat process message');
    console.log('   3. User belum join task room');
  }, 5000);
};

/**
 * Full debug untuk chat
 */
export const debugChat = () => {
  console.log('=== 🔧 CHAT DEBUG MODE ===\n');
  
  // 1. Check status
  checkChatStatus();
  
  // 2. Setup event listener untuk monitoring
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket || !socket.connected) {
    console.error('\n❌ Cannot setup monitoring - WebSocket not available');
    return;
  }
  
  console.log('\n📡 Setting up event monitoring...');
  console.log('💡 Semua chat events akan di-log ke console\n');
  
  // Monitor chat events
  const chatEvents = [
    'send_message',
    'new_message',
    'message_edited',
    'message_deleted',
    'join_task',
    'leave_task',
    'typing_start',
    'typing_stop',
    'user_typing',
    'user_stopped_typing',
    'user_joined',
    'user_left'
  ];
  
  chatEvents.forEach(eventName => {
    socket.on(eventName, (...args: any[]) => {
      console.log(`📡 Chat Event: ${eventName}`, args);
    });
  });
  
  console.log('✅ Monitoring aktif!');
  console.log('💡 Coba kirim chat untuk melihat events\n');
};

/**
 * Test join task
 */
export const testJoinTask = (taskId: string) => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket || !socket.connected) {
    console.error('❌ WebSocket tidak tersedia');
    return;
  }
  
  if (!taskId) {
    console.error('❌ Task ID diperlukan!');
    console.log('💡 Usage: testJoinTask("task-uuid")');
    return;
  }
  
  console.log('🚪 Joining task:', taskId);
  socket.emit('join_task', taskId);
  
  console.log('✅ Join event sent!');
  console.log('💡 Cek backend logs untuk konfirmasi');
  
  // Listen untuk confirmation
  const confirmListener = (data: any) => {
    console.log('✅ Joined task successfully!', data);
    socket.off('user_joined', confirmListener);
  };
  
  socket.once('user_joined', confirmListener);
  
  setTimeout(() => {
    socket.off('user_joined', confirmListener);
  }, 3000);
};

/**
 * Check if user is in task room
 */
export const checkTaskRoom = () => {
  const socket = window.__WEBSOCKET_INSTANCE__;
  
  if (!socket || !socket.connected) {
    console.error('❌ WebSocket tidak tersedia');
    return;
  }
  
  console.log('🏠 Checking current rooms...');
  
  // Socket.io stores rooms in socket.rooms (if available)
  if (socket.rooms) {
    console.log('Current rooms:', Array.from(socket.rooms));
  } else {
    console.log('⚠️ Room info tidak tersedia dari client side');
    console.log('💡 Cek backend logs untuk melihat room membership');
  }
};

// Expose functions ke window untuk testing dari console
if (process.env.NODE_ENV === 'development') {
  window.debugChat = debugChat;
  window.testSendMessage = testSendMessage;
  window.checkChatStatus = checkChatStatus;
  
  // Extend window dengan additional functions
  (window as any).testJoinTask = testJoinTask;
  (window as any).checkTaskRoom = checkTaskRoom;

  console.log('🧪 Chat debugging utilities loaded!');
  console.log('💡 Available commands:');
  console.log('   - checkChatStatus() // Cek status WebSocket dan events');
  console.log('   - testSendMessage("task-id", "message") // Test kirim message');
  console.log('   - debugChat() // Full debug mode dengan monitoring');
  console.log('   - testJoinTask("task-id") // Test join task');
  console.log('   - checkTaskRoom() // Cek current rooms');
}

export default {
  checkChatStatus,
  testSendMessage,
  debugChat,
  testJoinTask,
  checkTaskRoom
};

