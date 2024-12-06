import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const RegisterSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Only start countdown if we're actually on this page
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use replace to prevent back navigation
          navigate('/login', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
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
            Redirecting to login in {countdown} seconds...
          </Typography>
          <CircularProgress size={24} />
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterSuccessPage; 