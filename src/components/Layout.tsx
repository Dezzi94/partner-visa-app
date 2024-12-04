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
            px: { xs: 1, sm: 2 },
            '& .MuiBreadcrumbs-root': {
              mt: 1,
              mb: 1,
            },
            '& .MuiTypography-h1': {
              mt: 1,
              mb: 0.5,
              fontSize: '2rem',
              fontWeight: 500,
            },
            '& .MuiTypography-subtitle1': {
              mb: 1.5,
              color: 'text.secondary',
            },
            '& .MuiCard-root': {
              p: { xs: 1, sm: 1.5 },
              mb: 1.5,
              '&:last-child': {
                mb: 0,
              },
            },
            '& .progress-section': {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              '& > *': {
                flex: '1 1 auto',
                minWidth: { 
                  xs: '100%',
                  sm: 'calc(50% - 4px)',
                  md: 'calc(25% - 6px)',
                },
              },
            },
            '& .MuiGrid-container': {
              mt: 0,
              '& .MuiGrid-item': {
                pb: 1,
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