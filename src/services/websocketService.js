import { io } from 'socket.io-client';
import { performLogout } from '../utils/authUtils';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:9553';
    console.log('🔌 Connecting to WebSocket server:', wsUrl);
    console.log('🔧 Environment variables:');
    console.log('   REACT_APP_WS_URL:', process.env.REACT_APP_WS_URL);
    console.log('   REACT_APP_WEBSOCKET_URL:', process.env.REACT_APP_WEBSOCKET_URL);
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    
    this.socket = io(wsUrl, {
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      autoConnect: true,
      upgrade: true, // Allow upgrade from polling to websocket
      rememberUpgrade: false // Don't remember upgrade preference
    });

    this.setupEventHandlers();
    return this.socket;
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnected = false;
      
      // Auto-reconnect untuk beberapa kasus disconnect
      if (reason === 'io server disconnect') {
        // Server disconnect, coba reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 WebSocket connection error:', error);
      console.error('🔧 Error details:', error.message);
      
      // Check jika error adalah authentication error
      if (error.message && (
          error.message.includes('Invalid token') || 
          error.message.includes('Authentication error') ||
          error.message.includes('jwt expired') ||
          error.message.includes('invalid signature')
      )) {
        console.error('🚪 WebSocket Authentication Error - Auto logout triggered');
        performLogout('Sesi Anda telah berakhir (WebSocket auth failed). Silakan login kembali.');
        return; // Tidak perlu reconnect karena sudah logout
      }
      
      console.error('🔧 Troubleshooting tips:');
      console.error('   1. Pastikan backend server berjalan di port 9553');
      console.error('   2. Check apakah WebSocket server sudah diimplementasi');
      console.error('   3. Verify CORS settings di backend');
      this.isConnected = false;
      
      // Coba reconnect dengan delay hanya untuk non-auth errors
      this.handleReconnect();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket reconnect failed:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('💥 WebSocket reconnection failed after max attempts');
    });

    // Listen untuk authentication error dari server
    this.socket.on('auth_error', (data) => {
      console.error('🚪 WebSocket auth_error event received:', data);
      performLogout('Sesi Anda telah berakhir (WebSocket auth error). Silakan login kembali.');
    });

    // Listen untuk error event dari server
    this.socket.on('error', (error) => {
      console.error('🚨 WebSocket error event:', error);
      
      // Check jika error adalah authentication related
      if (error && typeof error === 'object') {
        const errorMessage = error.message || error.error || '';
        if (errorMessage.includes('Invalid token') || 
            errorMessage.includes('Authentication') ||
            errorMessage.includes('Unauthorized')) {
          console.error('🚪 WebSocket authentication error - Auto logout triggered');
          performLogout('Sesi Anda telah berakhir (WebSocket error). Silakan login kembali.');
        }
      }
    });
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.socket.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Task room management
  joinTask(taskId) {
    if (this.socket && this.isConnected) {
      console.log('🔄 Attempting to join task:', taskId);
      this.socket.emit('join_task', taskId);
    } else {
      console.warn('⚠️ Cannot join task - WebSocket not connected');
    }
  }

  leaveTask(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_task', taskId);
    }
  }

  // Message events
  sendMessage(taskId, message, attachments = [], replyTo) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        taskId,
        message,
        attachments,
        replyTo
      });
    }
  }

  editMessage(taskId, messageId, newMessage) {
    if (this.socket && this.isConnected) {
      this.socket.emit('edit_message', {
        taskId,
        messageId,
        newMessage
      });
    }
  }

  deleteMessage(taskId, messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_message', {
        taskId,
        messageId
      });
    }
  }

  // Typing indicators
  startTyping(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { taskId });
    }
  }

  stopTyping(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { taskId });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

const websocketService = new WebSocketService();
export default websocketService;
