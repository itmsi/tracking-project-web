import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { User } from '../../services/auth';
import './AvatarUrlInput.css';

interface AvatarUrlInputProps {
  currentAvatar?: string;
  onUpdateSuccess?: (updatedProfile: User) => void;
}

/**
 * Component untuk update avatar via URL langsung
 * Workaround untuk backend upload yang lambat
 */
const AvatarUrlInput: React.FC<AvatarUrlInputProps> = ({ currentAvatar, onUpdateSuccess }) => {
  const { updateProfile, loading, clearError } = useProfile();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');
  const [preview, setPreview] = useState(currentAvatar);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarUrl(url);
    setError('');
    clearError();

    // Update preview jika URL valid
    if (url && isValidUrl(url)) {
      setPreview(url);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    clearError();

    console.log('🔄 AvatarUrlInput: Submitting with avatarUrl:', avatarUrl);

    // Validate URL
    if (!avatarUrl.trim()) {
      setError('URL avatar harus diisi');
      console.error('❌ AvatarUrlInput: URL is empty');
      return;
    }

    if (!isValidUrl(avatarUrl)) {
      setError('URL tidak valid. Harus dimulai dengan http:// atau https://');
      console.error('❌ AvatarUrlInput: Invalid URL format:', avatarUrl);
      return;
    }

    try {
      console.log('📤 AvatarUrlInput: Calling updateProfile with:', { avatar_url: avatarUrl });
      const updatedProfile = await updateProfile({
        avatar_url: avatarUrl
      });

      console.log('✅ AvatarUrlInput: Profile updated successfully:', updatedProfile);
      setPreview(avatarUrl);
      setIsEditing(false);

      if (onUpdateSuccess) {
        onUpdateSuccess(updatedProfile);
      }
    } catch (err: any) {
      console.error('❌ AvatarUrlInput: Update failed:', err);
      setError(err.response?.data?.message || err.message || 'Gagal update avatar');
    }
  };

  const handleCancel = () => {
    setAvatarUrl(currentAvatar || '');
    setPreview(currentAvatar);
    setError('');
    clearError();
    setIsEditing(false);
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
    <div className="avatar-url-input">
      <div className="avatar-preview">
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar Preview"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(currentAvatar)}
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="avatar-url-display">
          <p className="current-url">
            {currentAvatar ? (
              <a href={currentAvatar} target="_blank" rel="noopener noreferrer">
                {currentAvatar.length > 50 ? currentAvatar.substring(0, 50) + '...' : currentAvatar}
              </a>
            ) : (
              'Belum ada avatar'
            )}
          </p>
          <button 
            className="btn btn-edit"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Ubah Avatar URL
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="avatar-url-form">
          <div className="form-group">
            <label htmlFor="avatar-url">URL Avatar</label>
            <input
              type="url"
              id="avatar-url"
              value={avatarUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
              className={error ? 'error' : ''}
              disabled={loading}
            />
            {error && <span className="error-message">{error}</span>}
            <small className="form-hint">
              Gunakan URL gambar dari internet (contoh: gravatar, imgur, dll)
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="avatar-url-suggestions">
        <p><strong>🎯 Quick Test - Klik untuk coba:</strong></p>
        <div className="quick-test-buttons">
          <button
            type="button"
            className="quick-test-btn"
            onClick={() => {
              const url = 'https://ui-avatars.com/api/?name=Test+User&size=200&background=3498db&color=fff';
              setAvatarUrl(url);
              setPreview(url);
              setIsEditing(true);
            }}
          >
            UI Avatar (Blue)
          </button>
          <button
            type="button"
            className="quick-test-btn"
            onClick={() => {
              const url = 'https://i.pravatar.cc/300';
              setAvatarUrl(url);
              setPreview(url);
              setIsEditing(true);
            }}
          >
            Pravatar (Random)
          </button>
          <button
            type="button"
            className="quick-test-btn"
            onClick={() => {
              const url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser';
              setAvatarUrl(url);
              setPreview(url);
              setIsEditing(true);
            }}
          >
            DiceBear (Cartoon)
          </button>
        </div>

        <p style={{ marginTop: '1rem' }}><strong>Saran URL Avatar Gratis:</strong></p>
        <ul>
          <li>
            <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
              Gravatar
            </a> - Avatar berdasarkan email
          </li>
          <li>
            <a href="https://ui-avatars.com" target="_blank" rel="noopener noreferrer">
              UI Avatars
            </a> - Generate avatar dari nama
          </li>
          <li>
            <a href="https://pravatar.cc" target="_blank" rel="noopener noreferrer">
              Pravatar
            </a> - Random avatar placeholder
          </li>
        </ul>
      </div>

      <p className="upload-note">
        <strong>💡 Tips:</strong> Cara tercepat untuk update avatar! 
        Gunakan URL dari layanan avatar gratis atau hosting image Anda.
      </p>
    </div>
  );
};

export default AvatarUrlInput;

