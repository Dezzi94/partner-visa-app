import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Button,
  Stack,
  SvgIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Description as DocumentIcon,
  Assignment as FormIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  LibraryBooks as ResourceIcon,
  Summarize as SummaryIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ContactSupport as ContactIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/NotificationCenter';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import ContactDialog from '@/components/common/ContactDialog';
import { generateUniqueId } from '@/utils/helpers';

const drawerWidth = 240;

interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: typeof SvgIcon;
}

const createMenuItems = (): MenuItem[] => [
  { id: generateUniqueId('menu'), path: '/', label: 'Home', icon: HomeIcon },
  { id: generateUniqueId('menu'), path: '/documents', label: 'Documents', icon: DocumentIcon },
  { id: generateUniqueId('menu'), path: '/forms', label: 'Forms', icon: FormIcon },
  { id: generateUniqueId('menu'), path: '/timeline', label: 'Timeline', icon: TimelineIcon },
  { id: generateUniqueId('menu'), path: '/interview-prep', label: 'Interview Prep', icon: InterviewIcon },
  { id: generateUniqueId('menu'), path: '/resources', label: 'Resources', icon: ResourceIcon },
  { id: generateUniqueId('menu'), path: '/summary', label: 'Summary Report', icon: SummaryIcon },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [menuItems] = useState(createMenuItems);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();

  // Handle bfcache and message port cleanup
  useEffect(() => {
    const cleanup = () => {
      // Clean up component state
      setMobileOpen(false);
      setAnchorEl(null);
      setContactDialogOpen(false);

      // Clean up message ports if they exist
      if (window.chrome?.runtime?.connect && window.__messagePorts) {
        window.__messagePorts.forEach(port => {
          if (port && typeof port.disconnect === 'function') {
            port.disconnect();
          }
        });
        window.__messagePorts = [];
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        cleanup();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      cleanup();
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Partner Visa
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} edge="end">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = location.pathname === item.path || 
            (item.path === '/' && location.pathname === '');
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon>
                  <Icon color={isSelected ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {isMobile && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setContactDialogOpen(true);
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon>
                  <ContactIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Support" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Partner Visa Guide
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname || 
              (item.path === '/' && location.pathname === ''))?.label || 'Partner Visa Guide'}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ContactIcon />}
              onClick={() => setContactDialogOpen(true)}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Contact Support
            </Button>

            <NotificationCenter />

            <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <IconButton onClick={toggleTheme} color="inherit" size="large">
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 32, height: 32 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {user && (
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={user.email || 'User'} />
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          p: 3,
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>

      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />
    </Box>
  );
};

export default Layout; 