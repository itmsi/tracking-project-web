import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/authSlice';
import { LoginCredentials } from '../../services/auth';
import { getRedirectAfterLogin } from '../../utils/authUtils';

const schema = yup.object({
  email: yup.string().email('Email tidak valid').required('Email harus diisi'),
  password: yup.string().required('Password harus diisi'),
});

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  // Check untuk logout reason dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reason = params.get('reason');
    if (reason) {
      setLogoutReason(decodeURIComponent(reason));
      // Clear reason dari URL setelah ditampilkan
      window.history.replaceState({}, '', '/login');
    }
  }, [location]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setSubmitError('');
      setLogoutReason(null); // Clear logout reason saat login baru
      dispatch(clearError());
      await dispatch(login(data)).unwrap();
      
      // Redirect ke halaman sebelumnya atau dashboard
      const redirectUrl = getRedirectAfterLogin();
      navigate(redirectUrl);
    } catch (err: any) {
      if (err?.message?.includes('Network Error') || err?.code === 'ECONNREFUSED') {
        setSubmitError('Backend API tidak tersedia. Pastikan backend berjalan di port 9553');
      } else {
        setSubmitError(err || 'Login gagal');
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
              Tracking Project Team
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Masuk ke akun Anda untuk melanjutkan
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {logoutReason && (
              <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setLogoutReason(null)}>
                {logoutReason}
              </Alert>
            )}
            
            {(submitError || error) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError || error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
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

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 3 }}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Masuk'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                atau
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Belum punya akun?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ fontWeight: 600 }}
                >
                  Daftar sekarang
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
