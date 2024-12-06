import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          pt: { xs: '56px', sm: '64px' },
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1200px',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
            '& > *:first-of-type': {
              mt: 0
            },
            '& .MuiTypography-h4': {
              fontSize: { xs: '1.75rem', sm: '2rem' },
              fontWeight: 500,
              mb: 1
            },
            '& .MuiTypography-subtitle1': {
              color: 'text.secondary',
              mb: 3
            },
            '& .MuiCard-root': {
              p: { xs: 2, sm: 3 },
              mb: 2,
              '&:last-child': {
                mb: 0,
              },
            },
            '& .progress-section': {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
              '& > *': {
                flex: '1 1 auto',
                minWidth: { 
                  xs: '100%',
                  sm: 'calc(50% - 8px)',
                  md: 'calc(25% - 12px)',
                },
              },
            },
            '& .MuiGrid-container': {
              mt: 0,
              '& .MuiGrid-item': {
                pb: 2,
              },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 