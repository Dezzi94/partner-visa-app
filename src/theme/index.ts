import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define base spacing unit (8px)
const BASE_SPACING = 8;

// Define spacing scale
const spacing = {
  xs: BASE_SPACING / 2,    // 4px
  sm: BASE_SPACING,        // 8px
  md: BASE_SPACING * 2,    // 16px
  lg: BASE_SPACING * 3,    // 24px
  xl: BASE_SPACING * 4,    // 32px
  xxl: BASE_SPACING * 6,   // 48px
};

// Define layout constants
const layout = {
  sidebarWidth: 240,
  maxContentWidth: 1200,
  spacing: {
    // Content spacing
    contentPadding: {
      desktop: spacing.xl,    // 32px padding on desktop
      mobile: spacing.md,     // 16px padding on mobile
    },
    
    // Vertical spacing
    pageHeaderSpacing: spacing.xl,    // 32px spacing for page headers
    sectionSpacing: spacing.lg,       // 24px between sections
    elementSpacing: spacing.md,       // 16px between elements
    
    // Card spacing
    cardPadding: {
      vertical: spacing.md,           // 16px top/bottom padding
      horizontal: spacing.lg,         // 24px left/right padding
    },
    cardMargin: spacing.lg,          // 24px margin between cards
    
    // Navigation
    breadcrumbSpacing: spacing.md,    // 16px below breadcrumbs
    navbarHeight: {
      desktop: 64,
      mobile: 56,
    },
  },
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
  spacing: (factor: number) => `${factor * BASE_SPACING}px`,
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
          padding: layout.spacing.contentPadding.mobile,
          '@media (min-width: 600px)': {
            padding: layout.spacing.contentPadding.desktop,
          },
          maxWidth: layout.maxContentWidth,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: layout.spacing.cardMargin,
          padding: `${layout.spacing.cardPadding.vertical}px ${layout.spacing.cardPadding.horizontal}px`,
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
        container: {
          marginTop: layout.spacing.elementSpacing,
          marginBottom: layout.spacing.sectionSpacing,
        },
        item: {
          paddingTop: layout.spacing.elementSpacing,
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: layout.sidebarWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          marginBottom: layout.spacing.breadcrumbSpacing,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          marginBottom: spacing.md,
          marginTop: layout.spacing.pageHeaderSpacing,
        },
        h2: {
          marginBottom: spacing.md,
          marginTop: layout.spacing.sectionSpacing,
        },
        h3: {
          marginBottom: layout.spacing.elementSpacing,
          marginTop: layout.spacing.sectionSpacing,
        },
        h4: {
          marginBottom: layout.spacing.elementSpacing,
          marginTop: layout.spacing.elementSpacing,
        },
        h5: {
          marginBottom: layout.spacing.elementSpacing,
          marginTop: layout.spacing.elementSpacing,
        },
        h6: {
          marginBottom: layout.spacing.elementSpacing,
          marginTop: layout.spacing.elementSpacing,
        },
        subtitle1: {
          marginBottom: layout.spacing.sectionSpacing,
          color: 'text.secondary',
        },
        subtitle2: {
          marginBottom: layout.spacing.elementSpacing,
        },
        body1: {
          marginBottom: layout.spacing.elementSpacing,
        },
        body2: {
          marginBottom: layout.spacing.elementSpacing,
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