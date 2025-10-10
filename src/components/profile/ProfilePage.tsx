import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { validateProfileForm, ProfileValidationErrors } from '../../utils/profileValidation';
import { User } from '../../services/auth';
import AvatarUpload from './AvatarUpload';
import AvatarUrlInput from './AvatarUrlInput';
import ChangePassword from './ChangePassword';
import './ProfilePage.css';

type TabType = 'profile' | 'password';
type AvatarMethodType = 'url' | 'upload';

const ProfilePage: React.FC = () => {
  const { profile, loading, error, updateProfile, clearError } = useProfile();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [avatarMethod, setAvatarMethod] = useState<AvatarMethodType>('url');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: ''
  });
  const [formErrors, setFormErrors] = useState<ProfileValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Update form data when profile is loaded
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    clearError();
    
    // Validate form
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      await updateProfile(formData);
      setEditing(false);
      setSuccessMessage('Profil berhasil diperbarui!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormErrors({});
    setSuccessMessage('');
    clearError();
    
    // Reset form to current profile data
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  };

  const handleAvatarUploadSuccess = (updatedProfile: User) => {
    setSuccessMessage('Avatar berhasil diperbarui!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading && !profile) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profil Saya</h1>
        
        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Ganti Password
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="tab-content">
            {/* Avatar Section dengan 2 opsi */}
            <div className="avatar-section">
              <h3>Avatar / Foto Profil</h3>
              <p className="avatar-section-description">
                Pilih cara untuk mengatur avatar Anda
              </p>
              
              {/* Avatar Options Tabs */}
              <div className="avatar-options-tabs">
                <button
                  className={`avatar-tab-button ${avatarMethod === 'url' ? 'active' : ''}`}
                  onClick={() => setAvatarMethod('url')}
                  type="button"
                >
                  📝 Input URL
                </button>
                <button
                  className={`avatar-tab-button ${avatarMethod === 'upload' ? 'active' : ''}`}
                  onClick={() => setAvatarMethod('upload')}
                  type="button"
                >
                  📤 Upload File
                </button>
              </div>

              {/* Avatar Method Content */}
              {avatarMethod === 'url' ? (
                <AvatarUrlInput
                  currentAvatar={profile?.avatar_url}
                  onUpdateSuccess={handleAvatarUploadSuccess}
                />
              ) : (
                <AvatarUpload
                  currentAvatar={profile?.avatar_url}
                  onUploadSuccess={handleAvatarUploadSuccess}
                />
              )}
            </div>

            {!editing ? (
              // View Mode
              <div className="profile-view">
                <div className="profile-info">
                  <div className="info-group">
                    <label>Email:</label>
                    <span>{profile?.email}</span>
                  </div>
                  
                  <div className="info-group">
                    <label>Nama Depan:</label>
                    <span>{profile?.first_name || '-'}</span>
                  </div>
                  
                  <div className="info-group">
                    <label>Nama Belakang:</label>
                    <span>{profile?.last_name || '-'}</span>
                  </div>
                  
                  <div className="info-group">
                    <label>Role:</label>
                    <span className={`badge badge-${profile?.role}`}>
                      {profile?.role}
                    </span>
                  </div>
                  
                  <div className="info-group">
                    <label>Bergabung Sejak:</label>
                    <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profil
                </button>
              </div>
            ) : (
              // Edit Mode
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="first_name">Nama Depan *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={formErrors.first_name ? 'error' : ''}
                  />
                  {formErrors.first_name && (
                    <span className="error-message">{formErrors.first_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Nama Belakang *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={formErrors.last_name ? 'error' : ''}
                  />
                  {formErrors.last_name && (
                    <span className="error-message">{formErrors.last_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_url">Avatar URL</label>
                  <input
                    type="text"
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className={formErrors.avatar_url ? 'error' : ''}
                  />
                  {formErrors.avatar_url && (
                    <span className="error-message">{formErrors.avatar_url}</span>
                  )}
                  <small className="form-hint">
                    Atau gunakan tombol upload avatar di atas
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
          </div>
        ) : (
          // Password Tab
          <div className="tab-content">
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

