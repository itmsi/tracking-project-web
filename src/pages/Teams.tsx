import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  Fab,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Group,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { teamsService, Team, TeamMember } from '../services/teams';
import { usersService, User } from '../services/users';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Load teams data
  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsService.getTeams();
      // Ensure teams data is valid
      const teamsData = Array.isArray(response.data.teams) 
        ? response.data.teams.filter(team => team && team.id).map(team => ({
            ...team,
            status: team.status || 'active'
          }))
        : [];
      setTeams(teamsData);
      
      // Load members for each team
      const membersData: Record<string, TeamMember[]> = {};
      for (const team of teamsData) {
        try {
          const membersResponse = await teamsService.getTeamMembers(team.id);
          // Ensure data is an array and validate structure
          const members = Array.isArray(membersResponse.data) 
            ? membersResponse.data.filter(member => 
                member && 
                member.user && 
                typeof member.user === 'object'
              )
            : [];
          membersData[team.id] = members;
        } catch (err) {
          console.warn(`Failed to load members for team ${team.id}:`, err);
          membersData[team.id] = [];
        }
      }
      setTeamMembers(membersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data teams');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load users for adding members
  const loadUsers = async () => {
    try {
      const response = await usersService.getUsers({ limit: 100 });
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  useEffect(() => {
    loadTeams();
    loadUsers();
  }, []);

  const handleCreateTeam = async () => {
    try {
      await teamsService.createTeam(formData);
      setOpenDialog(false);
      setFormData({ name: '', description: '', status: 'active' });
      loadTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat team');
    }
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;
    
    try {
      await teamsService.updateTeam(editingTeam.id, formData);
      setOpenDialog(false);
      setEditingTeam(null);
      setFormData({ name: '', description: '', status: 'active' });
      loadTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengupdate team');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus team ini?')) return;
    
    try {
      await teamsService.deleteTeam(teamId);
      loadTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus team');
    }
  };

  const handleOpenDialog = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name || '',
        description: team.description || '',
        status: team.status || 'active',
      });
    } else {
      setEditingTeam(null);
      setFormData({ name: '', description: '', status: 'active' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTeam(null);
    setFormData({ name: '', description: '', status: 'active' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Teams
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your teams and collaborate effectively
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
            },
          }}
        >
          New Team
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        {teams.map((team) => {
          const members = teamMembers[team.id] || [];
          return (
          <Box key={team.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Group />
                  </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {team.name}
                    </Typography>
                    <Chip
                      label={team.status || 'active'}
                      size="small"
                      color={(team.status || 'active') === 'active' ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(team)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {team.description || 'No description available'}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Team Members ({members.length})
                  </Typography>
                  <AvatarGroup max={4}>
                      {members.map((member, index) => {
                        const firstName = member?.user?.first_name || 'Unknown';
                        const lastName = member?.user?.last_name || 'User';
                        const fullName = `${firstName} ${lastName}`;
                        const initials = `${firstName[0] || 'U'}${lastName[0] || 'U'}`;
                        
                        return (
                          <Avatar
                            key={index}
                            sx={{ width: 32, height: 32 }}
                            title={`${fullName} - ${member?.role || 'member'}`}
                            src={member?.user?.avatar_url}
                          >
                            {initials}
                          </Avatar>
                        );
                      })}
                  </AvatarGroup>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                      Created: {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'Unknown'}
                  </Typography>
                    <Button size="small" variant="outlined" startIcon={<Visibility />}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          );
        })}
      </Box>

      {teams.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No teams found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first team to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Create Team
          </Button>
        </Box>
      )}

      {/* Create/Edit Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeam ? 'Edit Team' : 'Create New Team'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={editingTeam ? handleUpdateTeam : handleCreateTeam}
            variant="contained"
          >
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add team"
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
          },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Teams;
