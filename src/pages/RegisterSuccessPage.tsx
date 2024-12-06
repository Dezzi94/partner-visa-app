import React, { useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const RegisterSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
          alignItems: 'center',
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
            textAlign: 'center'
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 64,
              color: 'success.main',
              mb: 2
            }} 
          />
          <Typography variant="h5" gutterBottom>
            Account Created Successfully!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Redirecting you to login...
          </Typography>
          <CircularProgress size={24} />
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterSuccessPage; 