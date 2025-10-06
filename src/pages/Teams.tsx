import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  Grid,
  Fab,
} from '@mui/material';
import {
  Add,
  Group,
  Person,
  Email,
  Phone,
} from '@mui/icons-material';

const Teams: React.FC = () => {
  const mockTeams = [
    {
      id: 1,
      name: 'Frontend Team',
      description: 'Team untuk pengembangan frontend aplikasi',
      members: [
        { name: 'John Doe', role: 'Lead', avatar: 'JD' },
        { name: 'Jane Smith', role: 'Developer', avatar: 'JS' },
        { name: 'Mike Johnson', role: 'Developer', avatar: 'MJ' },
      ],
      projects: 5,
      status: 'active',
    },
    {
      id: 2,
      name: 'Backend Team',
      description: 'Team untuk pengembangan backend dan API',
      members: [
        { name: 'Alice Brown', role: 'Lead', avatar: 'AB' },
        { name: 'Bob Wilson', role: 'Developer', avatar: 'BW' },
        { name: 'Carol Davis', role: 'Developer', avatar: 'CD' },
      ],
      projects: 3,
      status: 'active',
    },
    {
      id: 3,
      name: 'Design Team',
      description: 'Team untuk UI/UX design dan branding',
      members: [
        { name: 'Emma Taylor', role: 'Lead', avatar: 'ET' },
        { name: 'Frank Miller', role: 'Designer', avatar: 'FM' },
      ],
      projects: 2,
      status: 'active',
    },
  ];

  return (
    <Box>
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
        {mockTeams.map((team) => (
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
                  <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {team.name}
                    </Typography>
                    <Chip
                      label={team.status}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {team.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Team Members ({team.members.length})
                  </Typography>
                  <AvatarGroup max={4}>
                    {team.members.map((member, index) => (
                      <Avatar
                        key={index}
                        sx={{ width: 32, height: 32 }}
                        title={`${member.name} - ${member.role}`}
                      >
                        {member.avatar}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {team.projects} Active Projects
                  </Typography>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Fab
        color="primary"
        aria-label="add team"
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
