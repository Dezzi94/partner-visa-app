import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 12px 24px rgba(0,0,0,0.05)',
    '0 16px 32px rgba(0,0,0,0.05)',
    '0 20px 40px rgba(0,0,0,0.05)',
    '0 24px 48px rgba(0,0,0,0.05)',
    '0 28px 56px rgba(0,0,0,0.05)',
    '0 32px 64px rgba(0,0,0,0.05)',
    '0 36px 72px rgba(0,0,0,0.05)',
    '0 40px 80px rgba(0,0,0,0.05)',
    '0 44px 88px rgba(0,0,0,0.05)',
    '0 48px 96px rgba(0,0,0,0.05)',
    '0 52px 104px rgba(0,0,0,0.05)',
    '0 56px 112px rgba(0,0,0,0.05)',
    '0 60px 120px rgba(0,0,0,0.05)',
    '0 64px 128px rgba(0,0,0,0.05)',
    '0 68px 136px rgba(0,0,0,0.05)',
    '0 72px 144px rgba(0,0,0,0.05)',
    '0 76px 152px rgba(0,0,0,0.05)',
    '0 80px 160px rgba(0,0,0,0.05)',
    '0 84px 168px rgba(0,0,0,0.05)',
    '0 88px 176px rgba(0,0,0,0.05)',
    '0 92px 184px rgba(0,0,0,0.05)',
  ],
});

export default theme; 