import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle as CheckCircleIcon, Email as EmailIcon } from '@mui/icons-material';

const RegisterSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

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
            Registration Successful!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmailIcon color="primary" />
            <Typography variant="body1" color="text.secondary">
              Confirmation email sent to:
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight="500" gutterBottom>
            {email}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please check your email and click the confirmation link to activate your account.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/login', { replace: true })}
            sx={{ mb: 2 }}
          >
            Go to Login
          </Button>
          <Typography variant="body2" color="text.secondary">
            Didn't receive the email?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => {
                // TODO: Implement resend confirmation email
                alert('Resend functionality will be implemented soon.');
              }}
            >
              Resend
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterSuccessPage; 