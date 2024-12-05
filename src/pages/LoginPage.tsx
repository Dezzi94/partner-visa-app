import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Favorite as HeartIcon } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      showToast('Login successful', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      showToast('Failed to login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Container 
        maxWidth="xs" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
            borderRadius: 2,
            boxShadow: 1,
            p: 4,
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HeartIcon sx={{ color: '#1976d2', fontSize: 32 }} />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
              Partner Visa Guide
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
            Sign in to your account
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ width: '100%' }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                height: 48,
                textTransform: 'none',
                fontSize: '1rem',
                mb: 3
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1
                }}
              >
                Demo Credentials:
                <br />
                Email: admin@example.com
                <br />
                Password: admin123
              </Typography>

              <Link 
                component={RouterLink} 
                to="/register" 
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 