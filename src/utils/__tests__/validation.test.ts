import {
  loginSchema,
  registerSchema,
  projectSchema,
  taskSchema,
  teamSchema,
  profileSchema,
  changePasswordSchema,
  commentSchema,
  isValidEmail,
  isStrongPassword,
  isValidUrl,
  isValidPhoneNumber,
  isValidDateRange,
  isValidFileSize,
  isValidFileType,
  getValidationErrorMessage,
  getFieldErrorMessage,
} from '../validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(loginSchema.validate(validData)).resolves.toBe(validData);
    });

    it('should reject invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Email tidak valid');
    });

    it('should reject empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Password harus diisi');
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      };

      await expect(registerSchema.validate(validData)).resolves.toBe(validData);
    });

    it('should reject password mismatch', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Password tidak cocok');
    });

    it('should reject short password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        confirmPassword: '123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Password minimal 6 karakter');
    });
  });

  describe('projectSchema', () => {
    it('should validate correct project data', async () => {
      const validData = {
        name: 'Test Project',
        description: 'This is a test project description',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        color: '#3f51b5',
      };

      await expect(projectSchema.validate(validData)).resolves.toBe(validData);
    });

    it('should reject invalid color format', async () => {
      const invalidData = {
        name: 'Test Project',
        description: 'This is a test project description',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        color: 'invalid-color',
      };

      await expect(projectSchema.validate(invalidData)).rejects.toThrow('Format warna tidak valid');
    });
  });

  describe('taskSchema', () => {
    it('should validate correct task data', async () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'todo',
        priority: 'high',
        due_date: new Date('2024-12-31'),
        assigned_to: 'user-id',
      };

      await expect(taskSchema.validate(validData)).resolves.toBe(validData);
    });

    it('should handle null values for optional fields', async () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'todo',
        priority: 'high',
        due_date: null,
        assigned_to: null,
      };

      await expect(taskSchema.validate(validData)).resolves.toBe(validData);
    });
  });
});

describe('Custom Validation Functions', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong password', () => {
      expect(isStrongPassword('Password123')).toBe(true);
      expect(isStrongPassword('MyStr0ngP@ss')).toBe(true);
    });

    it('should return false for weak password', () => {
      expect(isStrongPassword('password')).toBe(false);
      expect(isStrongPassword('12345678')).toBe(false);
      expect(isStrongPassword('PASSWORD')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for valid Indonesian phone number', () => {
      expect(isValidPhoneNumber('081234567890')).toBe(true);
      expect(isValidPhoneNumber('+6281234567890')).toBe(true);
      expect(isValidPhoneNumber('6281234567890')).toBe(true);
    });

    it('should return false for invalid phone number', () => {
      expect(isValidPhoneNumber('123456789')).toBe(false);
      expect(isValidPhoneNumber('08123456789')).toBe(false);
    });
  });

  describe('isValidDateRange', () => {
    it('should return true for valid date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      expect(isValidDateRange(startDate, endDate)).toBe(true);
    });

    it('should return false for invalid date range', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');
      expect(isValidDateRange(startDate, endDate)).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should return true for valid file size', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      expect(isValidFileSize(file, 5)).toBe(true);
    });

    it('should return false for file too large', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      expect(isValidFileSize(file, 5)).toBe(false);
    });
  });

  describe('isValidFileType', () => {
    it('should return true for allowed file type', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(isValidFileType(file, ['image/jpeg', 'image/png'])).toBe(true);
    });

    it('should return false for disallowed file type', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      expect(isValidFileType(file, ['image/jpeg', 'image/png'])).toBe(false);
    });
  });
});

describe('Error Message Helpers', () => {
  describe('getValidationErrorMessage', () => {
    it('should return error message from error object', () => {
      const error = { message: 'Custom error message' };
      expect(getValidationErrorMessage(error)).toBe('Custom error message');
    });

    it('should return default message for error without message', () => {
      const error = {};
      expect(getValidationErrorMessage(error)).toBe('Terjadi kesalahan validasi');
    });
  });

  describe('getFieldErrorMessage', () => {
    it('should return field error message', () => {
      const errors = {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' },
      };
      expect(getFieldErrorMessage(errors, 'email')).toBe('Email is required');
    });

    it('should return empty string for field without error', () => {
      const errors = {
        email: { message: 'Email is required' },
      };
      expect(getFieldErrorMessage(errors, 'password')).toBe('');
    });
  });
});
