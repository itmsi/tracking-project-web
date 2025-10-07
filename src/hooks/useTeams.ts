import { useState, useEffect, useCallback } from 'react';
import { teamsService, Team } from '../services/teams';

export const useTeams = (params: any = {}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsService.getTeams(params);
      setTeams(response.data.teams);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat teams');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Create team
  const createTeam = async (teamData: Partial<Team>) => {
    try {
      const response = await teamsService.createTeam(teamData);
      await fetchTeams(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Update team
  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    try {
      const response = await teamsService.updateTeam(id, teamData);
      await fetchTeams(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Delete team
  const deleteTeam = async (id: string) => {
    try {
      const response = await teamsService.deleteTeam(id);
      await fetchTeams(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    teams,
    loading,
    error,
    pagination,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};

// Hook untuk single team
export const useTeam = (id: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await teamsService.getTeam(id);
      setTeam(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat team');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return {
    team,
    loading,
    error,
    refetch: fetchTeam,
  };
};
