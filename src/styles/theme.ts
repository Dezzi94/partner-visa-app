import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Create theme options for both light and dark modes
const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' 
      ? {
          // Light mode colors with improved contrast
          primary: {
            main: '#1565c0', // Darker blue for better contrast
            light: '#5e92f3',
            dark: '#003c8f',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#2e7d32', // Darker green for better contrast
            light: '#60ad5e',
            dark: '#005005',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#1a1a1a', // Darker text for better contrast
            secondary: '#424242',
          },
        }
      : {
          // Dark mode colors with high contrast
          primary: {
            main: '#90caf9', // Lighter blue for dark mode
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: '#000000',
          },
          secondary: {
            main: '#81c784', // Lighter green for dark mode
            light: '#e8f5e9',
            dark: '#4caf50',
            contrastText: '#000000',
          },
          background: {
            default: '#000000',
            paper: '#121212',
          },
          text: {
            primary: '#ffffff',
            secondary: '#e0e0e0',
          },
        }),
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
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          '&:focus-visible': {
            outline: '2px solid #1565c0',
            outlineOffset: '2px',
          },
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #1565c0',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #1565c0',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Create the theme with light mode as default
const theme = createTheme(getThemeOptions('light'));

export { getThemeOptions };
export default theme; 