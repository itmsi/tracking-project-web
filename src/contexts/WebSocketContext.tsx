import React, { createContext, useContext, useEffect, useState } from 'react';
import websocketService from '../services/websocketService';
import { performLogout } from '../utils/authUtils';

interface WebSocketContextType {
  socket: any;
  isConnected: boolean;
  connectionError: string | null;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;
    
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token && !isConnecting && mounted) {
        setIsConnecting(true);
        console.log('🔌 WebSocketContext: Connecting with token');
        
        try {
          const socketInstance = websocketService.connect(token);
          
          if (mounted) {
            setSocket(socketInstance);

            const handleConnect = () => {
              if (mounted) {
                console.log('✅ WebSocketContext: Connected');
                setIsConnected(true);
                setConnectionError(null);
                setIsConnecting(false);
              }
            };

            const handleDisconnect = () => {
              if (mounted) {
                console.log('❌ WebSocketContext: Disconnected');
                setIsConnected(false);
                setIsConnecting(false);
              }
            };

            const handleConnectError = (error: any) => {
              if (mounted) {
                console.error('🚨 WebSocketContext: Connection error:', error);
                console.error('🔧 Error message:', error.message);
                
                // Check jika error adalah authentication error
                if (error.message && (
                    error.message.includes('Invalid token') || 
                    error.message.includes('Authentication error') ||
                    error.message.includes('jwt expired') ||
                    error.message.includes('invalid signature') ||
                    error.message.includes('Unauthorized')
                )) {
                  console.error('🚪 WebSocket Authentication Error - Triggering auto-logout');
                  performLogout('Sesi Anda telah berakhir (WebSocket authentication error). Silakan login kembali.');
                  return;
                }
                
                setConnectionError(error.message);
                setIsConnected(false);
                setIsConnecting(false);
              }
            };

            socketInstance.on('connect', handleConnect);
            socketInstance.on('disconnect', handleDisconnect);
            socketInstance.on('connect_error', handleConnectError);

            // Store cleanup function
            return () => {
              if (mounted) {
                console.log('🧹 WebSocketContext: Cleaning up');
                socketInstance.off('connect', handleConnect);
                socketInstance.off('disconnect', handleDisconnect);
                socketInstance.off('connect_error', handleConnectError);
                websocketService.disconnect();
              }
            };
          }
        } catch (error) {
          if (mounted) {
            console.error('🚨 WebSocketContext: Initialization error:', error);
            setConnectionError(error instanceof Error ? error.message : 'Unknown error');
            setIsConnecting(false);
          }
        }
      }
    };

    // Debounce initialization to prevent double calls in StrictMode
    initTimeout = setTimeout(initializeWebSocket, 100);

    return () => {
      mounted = false;
      setIsConnecting(false);
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  const reconnect = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      websocketService.connect(token);
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    connectionError,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
