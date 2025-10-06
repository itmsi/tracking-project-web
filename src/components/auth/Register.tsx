import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { register as registerUser, clearError } from '../../store/authSlice';
import { RegisterData } from '../../services/auth';

const schema = yup.object({
  email: yup.string().email('Email tidak valid').required('Email harus diisi'),
  password: yup.string().min(6, 'Password minimal 6 karakter').required('Password harus diisi'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Password tidak cocok')
    .required('Konfirmasi password harus diisi'),
  first_name: yup.string().required('Nama depan harus diisi'),
  last_name: yup.string().required('Nama belakang harus diisi'),
  role: yup.string().required('Role harus dipilih'),
});

interface RegisterFormData extends Omit<RegisterData, 'role'> {
  confirmPassword: string;
  role: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError('');
      dispatch(clearError());
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerUser(registerData)).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.message?.includes('Network Error') || err?.code === 'ECONNREFUSED') {
        setSubmitError('Backend API tidak tersedia. Pastikan backend berjalan di port 9552');
      } else {
        setSubmitError(err || 'Registrasi gagal');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Daftar Akun
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Buat akun baru untuk mulai menggunakan Project Tracker
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {(submitError || error) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError || error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Nama Depan"
                  margin="normal"
                  {...register('first_name')}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
                <TextField
                  fullWidth
                  label="Nama Belakang"
                  margin="normal"
                  {...register('last_name')}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </Box>

              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  {...register('role')}
                  value={watch('role') || ''}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                  <MenuItem value="project_manager">Project Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.role.message}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Konfirmasi Password"
                type={showConfirmPassword ? 'text' : 'password'}
                margin="normal"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Daftar'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                atau
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Sudah punya akun?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 600 }}
                >
                  Masuk sekarang
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
