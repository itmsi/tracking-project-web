import React, { useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { Box, Alert, Button, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { performLogout } from '../../utils/authUtils';

const WebSocketErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectionError, reconnect } = useWebSocket();

  // Auto-logout jika error adalah authentication error
  useEffect(() => {
    if (connectionError && (
        connectionError.includes('Invalid token') || 
        connectionError.includes('Authentication error') ||
        connectionError.includes('jwt expired') ||
        connectionError.includes('invalid signature') ||
        connectionError.includes('Unauthorized')
    )) {
      console.error('🚪 WebSocketErrorBoundary: Authentication error detected - Auto logout');
      // Delay sebentar untuk menampilkan error ke user
      setTimeout(() => {
        performLogout('Sesi Anda telah berakhir (WebSocket authentication failed). Silakan login kembali.');
      }, 2000);
    }
  }, [connectionError]);

  if (connectionError) {
    // Check jika ini authentication error
    const isAuthError = connectionError.includes('Invalid token') || 
                       connectionError.includes('Authentication error') ||
                       connectionError.includes('jwt expired') ||
                       connectionError.includes('invalid signature') ||
                       connectionError.includes('Unauthorized');

    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '200px',
          p: 3
        }}
      >
        <Alert 
          severity={isAuthError ? "warning" : "error"}
          action={
            !isAuthError && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={reconnect}
                startIcon={<Refresh />}
              >
                Reconnect
              </Button>
            )
          }
          sx={{ width: '100%', maxWidth: 500 }}
        >
          <Typography variant="h6" gutterBottom>
            {isAuthError ? 'Session Expired' : 'WebSocket Connection Error'}
          </Typography>
          <Typography variant="body2">
            {isAuthError 
              ? 'Your session has expired. You will be redirected to login page...'
              : connectionError
            }
          </Typography>
          {!isAuthError && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Please check your internet connection and try again.
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default WebSocketErrorBoundary;
