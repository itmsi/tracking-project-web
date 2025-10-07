import { useState, useEffect, useCallback } from 'react';
import { projectsService, Project } from '../services/projects';

export const useProjects = (params: any = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsService.getProjects(params);
      setProjects(response.data.projects);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat projects');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create project
  const createProject = async (projectData: Partial<Project>) => {
    try {
      const response = await projectsService.createProject(projectData);
      await fetchProjects(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Update project
  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const response = await projectsService.updateProject(id, projectData);
      await fetchProjects(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    try {
      const response = await projectsService.deleteProject(id);
      await fetchProjects(); // Refresh list
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

// Hook untuk single project
export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await projectsService.getProject(id);
      setProject(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
};
