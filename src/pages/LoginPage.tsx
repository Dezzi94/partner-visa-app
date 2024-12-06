import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common/Toast';
import { Favorite as HeartIcon } from '@mui/icons-material';

const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123'
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      showToast('Login successful', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    try {
      await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      showToast('Demo login successful', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Demo login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

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
                mb: 2
              }}
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleDemoLogin}
              sx={{ 
                height: 48,
                textTransform: 'none',
                fontSize: '1rem',
                mb: 3
              }}
              disabled={loading}
            >
              Try Demo Account
            </Button>

            <Box sx={{ textAlign: 'center' }}>
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