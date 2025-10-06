import * as yup from 'yup';

/**
 * Validation schemas for forms
 */

// Login form validation
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email harus diisi'),
  password: yup
    .string()
    .required('Password harus diisi'),
});

// Register form validation
export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Email tidak valid')
    .required('Email harus diisi'),
  password: yup
    .string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password harus diisi'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Password tidak cocok')
    .required('Konfirmasi password harus diisi'),
  first_name: yup
    .string()
    .required('Nama depan harus diisi'),
  last_name: yup
    .string()
    .required('Nama belakang harus diisi'),
  role: yup
    .string()
    .required('Role harus dipilih'),
});

// Project form validation
export const projectSchema = yup.object({
  name: yup
    .string()
    .required('Nama proyek harus diisi')
    .min(3, 'Nama proyek minimal 3 karakter'),
  description: yup
    .string()
    .required('Deskripsi harus diisi')
    .min(10, 'Deskripsi minimal 10 karakter'),
  status: yup
    .string()
    .oneOf(['active', 'on_hold', 'completed', 'cancelled'])
    .required('Status harus dipilih'),
  start_date: yup
    .date()
    .required('Tanggal mulai harus diisi'),
  end_date: yup
    .date()
    .min(yup.ref('start_date'), 'Tanggal selesai harus setelah tanggal mulai')
    .required('Tanggal selesai harus diisi'),
  color: yup
    .string()
    .matches(/^#[0-9a-f]{6}$/i, 'Format warna tidak valid')
    .required('Warna harus dipilih'),
});

// Task form validation
export const taskSchema = yup.object({
  title: yup
    .string()
    .required('Judul tugas harus diisi')
    .min(3, 'Judul tugas minimal 3 karakter'),
  description: yup
    .string()
    .required('Deskripsi harus diisi')
    .min(10, 'Deskripsi minimal 10 karakter'),
  status: yup
    .string()
    .oneOf(['todo', 'in_progress', 'done', 'blocked'])
    .required('Status harus dipilih'),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'urgent'])
    .required('Prioritas harus dipilih'),
  due_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),
  assigned_to: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),
});

// Team form validation
export const teamSchema = yup.object({
  name: yup
    .string()
    .required('Nama tim harus diisi')
    .min(3, 'Nama tim minimal 3 karakter'),
  description: yup
    .string()
    .required('Deskripsi harus diisi')
    .min(10, 'Deskripsi minimal 10 karakter'),
});

// Profile form validation
export const profileSchema = yup.object({
  first_name: yup
    .string()
    .required('Nama depan harus diisi'),
  last_name: yup
    .string()
    .required('Nama belakang harus diisi'),
  avatar_url: yup
    .string()
    .url('URL avatar tidak valid')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),
});

// Change password form validation
export const changePasswordSchema = yup.object({
  current_password: yup
    .string()
    .required('Password saat ini harus diisi'),
  new_password: yup
    .string()
    .min(6, 'Password baru minimal 6 karakter')
    .required('Password baru harus diisi'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Password tidak cocok')
    .required('Konfirmasi password harus diisi'),
});

// Comment form validation
export const commentSchema = yup.object({
  content: yup
    .string()
    .required('Komentar harus diisi')
    .min(1, 'Komentar tidak boleh kosong'),
});

/**
 * Custom validation functions
 */

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate phone number (Indonesian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone);
};

// Validate date range
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

// Validate file size (in bytes)
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Validate file type
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Error message helpers
 */
export const getValidationErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'Terjadi kesalahan validasi';
};

export const getFieldErrorMessage = (errors: any, fieldName: string): string => {
  return errors[fieldName]?.message || '';
};
