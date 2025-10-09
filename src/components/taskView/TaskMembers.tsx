import React, { useState } from 'react';
import { useTaskMembers } from '../../hooks/useTaskMembers';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNotifications } from '../../hooks/useNotifications';
import { canManageTaskMembers, getRoleBadgeColor } from '../../utils/permissions';

const TaskMembersContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const MembersHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const AddMemberForm = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
}));

interface TaskMembersProps {
  taskId: string;
  members: Array<{
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
    role: string;
    permissions: {
      can_edit: boolean;
      can_comment: boolean;
      can_upload: boolean;
    };
    joined_at: string;
  }>;
  permissions: {
    hasAccess?: boolean;
    userId?: string;
    isOwner: boolean;
    role: string;
    permissions?: {
      can_edit: boolean;
      can_comment: boolean;
      can_upload: boolean;
    };
  } | null;
  onUpdate?: () => void; // Callback untuk refresh data setelah update
}

const TaskMembers: React.FC<TaskMembersProps> = ({ taskId, members: initialMembers, permissions, onUpdate }) => {
  const {
    members,
    loading,
    error,
    addMember,
    updateMember,
    removeMember,
    searchUsers
  } = useTaskMembers(taskId);

  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [memberRole, setMemberRole] = useState('member');
  const [memberPermissions, setMemberPermissions] = useState({
    can_edit: true,
    can_comment: true,
    can_upload: true
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { showNotification } = useNotifications();

  const canManageMembers = canManageTaskMembers(permissions);

  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const users = await searchUsers(query);
      setSearchResults(users);
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await addMember(selectedUser.id, memberRole, memberPermissions);
      setSelectedUser(null);
      setSearchQuery('');
      setSearchResults([]);
      setShowAddMember(false);
      showNotification('Member added successfully', 'success');
      
      // Refresh data setelah add member berhasil
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleUpdateMember = async (memberId: string, updates: any) => {
    try {
      await updateMember(memberId, updates);
      showNotification('Member updated successfully', 'success');
      
      // Refresh data setelah update member berhasil
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${memberName}" from this task?`)) return;

    try {
      await removeMember(memberId);
      showNotification('Member removed successfully', 'success');
      
      // Refresh data setelah remove member berhasil
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };


  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <AdminIcon />;
      case 'admin': return <AdminIcon />;
      default: return <PersonIcon />;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, memberId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMemberId(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMemberId(null);
  };

  if (error) {
    return (
      <TaskMembersContainer>
        <Alert severity="error">
          Error loading members: {error}
        </Alert>
      </TaskMembersContainer>
    );
  }

  return (
    <TaskMembersContainer>
      <MembersHeader>
        <Typography variant="h6">
          Task Members
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="textSecondary">
            {members?.length || 0} members
          </Typography>
          {canManageMembers && (
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => setShowAddMember(!showAddMember)}
              size="small"
            >
              Add Member
            </Button>
          )}
        </Box>
      </MembersHeader>

      {showAddMember && canManageMembers && (
        <AddMemberForm>
          <Box component="form" onSubmit={handleAddMember} display="flex" flexDirection="column" gap={2}>
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              inputValue={searchQuery}
              onInputChange={(_, newInputValue) => {
                setSearchQuery(newInputValue);
                handleSearchUsers(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Users"
                  placeholder="Search by name or email..."
                  size="small"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={option.avatar_url} sx={{ width: 24, height: 24 }}>
                      {option.first_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {option.first_name} {option.last_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            />

            {selectedUser && (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={memberRole}
                    label="Role"
                    onChange={(e) => setMemberRole(e.target.value)}
                  >
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Permissions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={memberPermissions.can_edit}
                          onChange={(e) => setMemberPermissions(prev => ({ 
                            ...prev, 
                            can_edit: e.target.checked 
                          }))}
                        />
                      }
                      label="Can Edit Task"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={memberPermissions.can_comment}
                          onChange={(e) => setMemberPermissions(prev => ({ 
                            ...prev, 
                            can_comment: e.target.checked 
                          }))}
                        />
                      }
                      label="Can Comment"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={memberPermissions.can_upload}
                          onChange={(e) => setMemberPermissions(prev => ({ 
                            ...prev, 
                            can_upload: e.target.checked 
                          }))}
                        />
                      }
                      label="Can Upload Files"
                    />
                  </Box>
                </Box>

                <Box display="flex" gap={1}>
                  <Button 
                    type="submit" 
                    variant="contained"
                    size="small"
                  >
                    Add Member
                  </Button>
                  <Button 
                    type="button" 
                    variant="outlined"
                    onClick={() => setShowAddMember(false)}
                    size="small"
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </AddMemberForm>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (members?.length || 0) === 0 ? (
        <Box textAlign="center" py={3}>
          <Typography color="textSecondary">
            No members yet
          </Typography>
        </Box>
      ) : (
        <List>
          {(members || []).map((member) => (
            <ListItem key={member.id} divider>
              <ListItemAvatar>
                <Avatar src={member.avatar_url || '/default-avatar.png'}>
                  {member.first_name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle2">
                      {member.first_name} {member.last_name}
                    </Typography>
                    <Chip 
                      label={member.role} 
                      color={getRoleBadgeColor(member.role) as any}
                      size="small"
                      icon={getRoleIcon(member.role)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {member.email}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              {canManageMembers && member.role !== 'owner' && (
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleMenuClick(e, member.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedMemberId) {
            const member = (members || []).find(m => m.id === selectedMemberId);
            if (member) {
              const newRole = member.role === 'admin' ? 'member' : 'admin';
              handleUpdateMember(selectedMemberId, { role: newRole });
            }
          }
          handleMenuClose();
        }}>
          {selectedMemberId && (members || []).find(m => m.id === selectedMemberId)?.role === 'admin' ? 'Demote' : 'Promote'}
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedMemberId) {
            const member = (members || []).find(m => m.id === selectedMemberId);
            if (member) {
              handleRemoveMember(selectedMemberId, `${member.first_name} ${member.last_name}`);
            }
          }
          handleMenuClose();
        }}>
          <PersonRemoveIcon fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>
    </TaskMembersContainer>
  );
};

export default TaskMembers;
