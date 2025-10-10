export interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordValidationErrors {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  password_strength?: string;
  [key: string]: string | undefined;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: PasswordValidationErrors;
}

/**
 * Validate password form data
 */
export function validatePasswordForm(data: PasswordFormData): PasswordValidationResult {
  const errors: PasswordValidationErrors = {};

  // Validate current_password
  if (!data.current_password) {
    errors.current_password = 'Password lama harus diisi';
  }

  // Validate new_password
  if (!data.new_password) {
    errors.new_password = 'Password baru harus diisi';
  } else if (data.new_password.length < 6) {
    errors.new_password = 'Password baru minimal 6 karakter';
  } else if (data.new_password === data.current_password) {
    errors.new_password = 'Password baru tidak boleh sama dengan password lama';
  }

  // Validate confirm_password
  if (!data.confirm_password) {
    errors.confirm_password = 'Konfirmasi password harus diisi';
  } else if (data.new_password !== data.confirm_password) {
    errors.confirm_password = 'Konfirmasi password tidak cocok';
  }

  // Password strength validation
  if (data.new_password) {
    const hasUpperCase = /[A-Z]/.test(data.new_password);
    const hasLowerCase = /[a-z]/.test(data.new_password);
    const hasNumbers = /\d/.test(data.new_password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.new_password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      errors.password_strength = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Get password strength level
 */
export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  message: string;
} {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 2) {
    return { level: 'weak', score, message: 'Lemah' };
  } else if (score <= 3) {
    return { level: 'medium', score, message: 'Sedang' };
  } else if (score <= 4) {
    return { level: 'strong', score, message: 'Kuat' };
  } else {
    return { level: 'very-strong', score, message: 'Sangat Kuat' };
  }
}

