import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { validatePasswordForm, PasswordValidationErrors } from '../../utils/passwordValidation';
import { getPasswordStrength } from '../../utils/passwordValidation';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
  const { changePassword, loading, error, clearError } = useProfile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [formErrors, setFormErrors] = useState<PasswordValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    clearError();
    
    // Validate form
    const validation = validatePasswordForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      await changePassword(formData);
      
      setSuccessMessage('Password berhasil diubah! Anda akan logout dalam 3 detik...');
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Logout after 3 seconds
      setTimeout(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login', { replace: true });
      }, 3000);
      
    } catch (err) {
      // Error handled by hook
    }
  };

  const passwordStrength = formData.new_password 
    ? getPasswordStrength(formData.new_password) 
    : null;

  return (
    <div className="change-password">
      <h2>Ganti Password</h2>
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="current_password">Password Lama *</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleInputChange}
              className={formErrors.current_password ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('current')}
              tabIndex={-1}
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formErrors.current_password && (
            <span className="error-message">{formErrors.current_password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="new_password">Password Baru *</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              className={formErrors.new_password ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new')}
              tabIndex={-1}
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formErrors.new_password && (
            <span className="error-message">{formErrors.new_password}</span>
          )}
          {formErrors.password_strength && (
            <span className="error-message">{formErrors.password_strength}</span>
          )}
          
          {/* Password Strength Indicator */}
          {formData.new_password && passwordStrength && (
            <div className="password-strength">
              <div className={`strength-bar strength-${passwordStrength.level}`}>
                <div 
                  className="strength-fill" 
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                ></div>
              </div>
              <span className={`strength-text strength-${passwordStrength.level}`}>
                {passwordStrength.message}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirm_password">Konfirmasi Password Baru *</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className={formErrors.confirm_password ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirm')}
              tabIndex={-1}
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formErrors.confirm_password && (
            <span className="error-message">{formErrors.confirm_password}</span>
          )}
        </div>

        <div className="password-requirements">
          <p><strong>Persyaratan Password:</strong></p>
          <ul>
            <li>Minimal 6 karakter</li>
            <li>Mengandung huruf besar dan kecil</li>
            <li>Mengandung angka</li>
            <li>Berbeda dari password lama</li>
          </ul>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Mengubah Password...' : 'Ganti Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

