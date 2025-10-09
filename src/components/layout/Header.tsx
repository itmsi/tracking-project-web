import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  Search,
  Task,
  Folder,
  Group,
  Comment,
  Close,
  MarkEmailRead,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { notificationsService, Notification } from '../../services/notifications';
import { useFocusManagement } from '../../hooks/useFocusManagement';
import { useAriaHiddenFix } from '../../hooks/useAriaHiddenFix';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Focus management untuk notification menu
  const notificationFocusManagement = useFocusManagement(Boolean(notificationAnchorEl));
  const accountFocusManagement = useFocusManagement(Boolean(anchorEl));

  // Fix aria-hidden issues
  useAriaHiddenFix(Boolean(notificationAnchorEl) || Boolean(anchorEl));

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getNotifications({ limit: 10 });
      setNotifications(response.data.notifications);
      
      const unreadResponse = await notificationsService.getUnreadCount();
      setUnreadCount(unreadResponse.data.count ?? 0);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      // Jika error 404, tidak perlu set error karena sudah dihandle di service
      if (err.response?.status !== 404) {
        setError('Gagal memuat notifikasi');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount();
      setUnreadCount(response.data.count ?? 0);
    } catch (err: any) {
      console.error('Error loading unread count:', err);
      // Jika error 404, set count ke 0 (sudah dihandle di service)
      if (err.response?.status === 404) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      loadNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      loadNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_completed':
      case 'task_due':
        return <Task />;
      case 'project_updated':
        return <Folder />;
      case 'team_invite':
        return <Group />;
      case 'comment_added':
        return <Comment />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return 'primary';
      case 'task_completed':
        return 'success';
      case 'task_due':
        return 'warning';
      case 'project_updated':
        return 'info';
      case 'team_invite':
        return 'secondary';
      case 'comment_added':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Tracking Project Team
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" size="large">
            <Search />
          </IconButton>

          <IconButton 
            id="notification-button"
            color="inherit" 
            size="large"
            onClick={handleNotificationMenu}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-haspopup="true"
            aria-expanded={Boolean(notificationAnchorEl)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            id="account-button"
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              src={user?.avatar_url}
              sx={{ width: 32, height: 32 }}
            >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onKeyDown={accountFocusManagement.handleKeyDown}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'account-button',
              role: 'menu',
            }}
            disableAutoFocusItem={false}
            autoFocus={true}
            disableEnforceFocus={true}
            disableRestoreFocus={true}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profil</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Pengaturan</ListItemText>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Keluar</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            onKeyDown={notificationFocusManagement.handleKeyDown}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 350,
                maxWidth: 400,
                maxHeight: 500,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            MenuListProps={{
              'aria-labelledby': 'notification-button',
              role: 'menu',
            }}
            slotProps={{
              root: {
                slotProps: {
                  backdrop: {
                    invisible: false,
                  },
                },
              },
            }}
            disableAutoFocusItem={false}
            autoFocus={true}
            disableEnforceFocus={true}
            disableRestoreFocus={true}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
                {notifications.some(n => !n.is_read) && (
                  <Button
                    size="small"
                    startIcon={<MarkEmailRead />}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All Read
                  </Button>
                )}
              </Box>
            </Box>

            {error && (
              <Box sx={{ px: 2, py: 1 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }} role="menu">
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    role="menuitem"
                    sx={{
                      bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                      borderLeft: notification.is_read ? 'none' : '3px solid',
                      borderLeftColor: `${getNotificationColor(notification.type)}.main`,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(notification.type)}.main`,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={notification.is_read ? 'normal' : 'bold'}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type.replace('_', ' ')}
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {!notification.is_read && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read"
                            aria-label={`Mark notification "${notification.title}" as read`}
                            role="menuitem"
                            tabIndex={0}
                          >
                            <MarkEmailRead fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Delete"
                          color="error"
                          aria-label={`Delete notification "${notification.title}"`}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
