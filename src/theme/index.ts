import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define spacing constants
const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
};

// Define consistent border radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

// Common theme options
const commonOptions: ThemeOptions = {
  spacing: (factor: number) => `${factor * 8}px`,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: spacing.lg,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: spacing.md,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: spacing.md,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: spacing.sm,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: spacing.sm,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: spacing.sm,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      marginBottom: spacing.sm,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: spacing.sm,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      marginBottom: spacing.sm,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: spacing.sm,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          transition: 'box-shadow 0.3s ease-in-out',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: spacing.lg,
          '&:last-child': {
            paddingBottom: spacing.lg,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          padding: `${spacing.sm}px ${spacing.md}px`,
          fontWeight: 500,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          padding: spacing.sm,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          marginBottom: spacing.xs,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          height: 32,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.md,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: spacing.lg,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: spacing.lg,
          paddingTop: `${spacing.lg}px !important`,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: spacing.lg,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: spacing.md,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '& > .MuiGrid-item': {
            paddingTop: spacing.md,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: `${spacing.md}px 0`,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    ...commonOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    ...commonOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
}); 