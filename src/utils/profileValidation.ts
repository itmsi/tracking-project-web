export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface ProfileValidationErrors {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ProfileValidationErrors;
}

/**
 * Validate profile form data
 */
export function validateProfileForm(data: ProfileFormData): ValidationResult {
  const errors: ProfileValidationErrors = {};

  // Validate first_name
  if (data.first_name !== undefined) {
    if (data.first_name.trim().length === 0) {
      errors.first_name = 'Nama depan tidak boleh kosong';
    } else if (data.first_name.length > 100) {
      errors.first_name = 'Nama depan maksimal 100 karakter';
    }
  }

  // Validate last_name
  if (data.last_name !== undefined) {
    if (data.last_name.trim().length === 0) {
      errors.last_name = 'Nama belakang tidak boleh kosong';
    } else if (data.last_name.length > 100) {
      errors.last_name = 'Nama belakang maksimal 100 karakter';
    }
  }

  // Validate avatar_url
  if (data.avatar_url !== undefined && data.avatar_url.trim().length > 0) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(data.avatar_url)) {
      errors.avatar_url = 'URL avatar tidak valid';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate file for avatar upload
 */
export function validateAvatarFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 10MB'
    };
  }

  return { isValid: true };
}

