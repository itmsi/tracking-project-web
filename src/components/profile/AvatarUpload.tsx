import React, { useState, useRef } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { validateAvatarFile } from '../../utils/profileValidation';
import { previewImage } from '../../utils/imagePreview';
import { User } from '../../services/auth';
import './AvatarUpload.css';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (updatedProfile: User) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onUploadSuccess }) => {
  const { uploadAvatar, uploading, uploadProgress, clearError } = useProfile();
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentAvatar changes
  React.useEffect(() => {
    setPreview(currentAvatar);
  }, [currentAvatar]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    clearError();

    if (!file) return;

    // Validate file
    const validation = validateAvatarFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'File tidak valid');
      return;
    }

    // Show preview
    previewImage(file, (imageUrl) => {
      setPreview(imageUrl);
    });

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setError('');
      console.log('📤 AvatarUpload: Starting upload for file:', file.name);
      
      const updatedProfile = await uploadAvatar(file);
      
      console.log('✅ AvatarUpload: Upload successful, profile:', updatedProfile);
      
      if (updatedProfile && updatedProfile.avatar_url) {
        setPreview(updatedProfile.avatar_url);
        
        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess(updatedProfile);
        }
      } else {
        console.error('❌ AvatarUpload: Updated profile missing avatar_url:', updatedProfile);
        throw new Error('Response tidak lengkap. Avatar URL tidak ditemukan.');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('❌ AvatarUpload: Upload failed:', err);
      
      // Better error message
      let errorMessage = 'Gagal mengupload avatar';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint upload tidak ditemukan. Pastikan backend running.';
      }
      
      setError(errorMessage);
      // Restore previous avatar on error
      setPreview(currentAvatar);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(currentAvatar)}
          </div>
        )}
        
        {uploading && (
          <div className="avatar-uploading-overlay">
            <div className="spinner"></div>
            {uploadProgress && (
              <span className="upload-percentage">{uploadProgress.percentage}%</span>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <button 
        className="btn btn-upload"
        onClick={handleClickUpload}
        disabled={uploading}
        type="button"
      >
        {uploading ? 'Mengupload...' : 'Ganti Avatar'}
      </button>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <p className="upload-hint">
        Format: JPG, PNG, GIF, WEBP. Max: 10MB
      </p>

      <div className="upload-info">
        <strong>ℹ️ Info:</strong>
        <ul>
          <li>Upload file langsung dari device Anda</li>
          <li>Jika upload lambat, gunakan <strong>Input URL</strong> sebagai alternatif</li>
          <li>File akan disimpan di server</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarUpload;

