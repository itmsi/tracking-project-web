import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchTasks, forceRefresh } from '../../store/taskSlice';
import { forceRefreshApi } from '../../services/api';

interface ForceRefreshButtonProps {
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
  onRefresh?: () => void;
}

const ForceRefreshButton: React.FC<ForceRefreshButtonProps> = ({ 
  variant = 'icon', 
  size = 'medium',
  onRefresh 
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleForceRefresh = async () => {
    try {
      // Reset state dan force refetch
      dispatch(forceRefresh());
      
      // Gunakan forceRefreshApi untuk menghindari CORS issues
      const response = await forceRefreshApi.get('/api/tasks');
      console.log('✅ Force refresh berhasil:', response.data);
      
      // Update Redux store dengan data terbaru
      dispatch(fetchTasks({}));
      
      // Callback jika ada
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('❌ Force refresh gagal:', error);
      // Fallback ke method biasa jika forceRefreshApi gagal
      dispatch(fetchTasks({}));
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={handleForceRefresh}
        size={size}
        sx={{
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }}
      >
        Refresh Data
      </Button>
    );
  }

  return (
    <Tooltip title="Force Refresh Data" arrow>
      <IconButton
        onClick={handleForceRefresh}
        size={size}
        sx={{
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
            transform: 'rotate(180deg)',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <Refresh />
      </IconButton>
    </Tooltip>
  );
};

export default ForceRefreshButton;
