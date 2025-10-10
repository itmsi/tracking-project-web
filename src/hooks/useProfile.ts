import { useState, useEffect, useCallback } from 'react';
import { authService, User } from '../services/auth';
import { uploadService, UploadProgress } from '../services/upload';

interface UseProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: UploadProgress | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  uploadAvatar: (file: File) => Promise<User>;
  changePassword: (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook untuk mengelola state profile user
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  /**
   * Fetch user profile
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getProfile();
      setProfile(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil data profil';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: Partial<User>): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(data);
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal memperbarui profil';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload avatar and update profile
   */
  const uploadAvatar = useCallback(async (file: File): Promise<User> => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(null);

      // Step 1: Upload file
      const uploadResponse = await uploadService.uploadAvatar(file, (progress) => {
        setUploadProgress(progress);
      });

      const avatarUrl = uploadResponse.data.url;

      // Step 2: Update profile with new avatar URL
      const profileResponse = await authService.updateProfile({
        avatar_url: avatarUrl
      });

      setProfile(profileResponse.data);
      setUploadProgress(null);
      
      return profileResponse.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal mengupload avatar';
      setError(errorMessage);
      console.error('Error uploading avatar:', err);
      setUploadProgress(null);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.changePassword(passwordData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal mengubah password';
      setError(errorMessage);
      console.error('Error changing password:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    uploading,
    uploadProgress,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    changePassword,
    clearError
  };
}

