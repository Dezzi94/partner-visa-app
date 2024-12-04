import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  LibraryBooks as ResourcesIcon,
  Assessment as SummaryIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle,
  Logout,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import ContactDialog from './common/ContactDialog';

const drawerWidth = 240;

const menuItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/documents', label: 'Documents', icon: DocumentIcon },
  { path: '/forms', label: 'Forms', icon: FormsIcon },
  { path: '/timeline', label: 'Timeline', icon: TimelineIcon },
  { path: '/interview-prep', label: 'Interview Prep', icon: InterviewIcon },
  { path: '/resources', label: 'Resources', icon: ResourcesIcon },
  { path: '/summary', label: 'Summary Report', icon: SummaryIcon },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();

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

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          minHeight: '64px'
        }}
      >
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 500,
            py: 2
          }}
        >
          Partner Visa
        </Typography>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ position: 'absolute', right: 8 }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon>
                  <Icon color={location.pathname === item.path ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
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
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Partner Visa Guide'}
          </Typography>
          
          <Button
            color="inherit"
            startIcon={<SupportIcon />}
            onClick={() => setContactDialogOpen(true)}
            sx={{ 
              mr: 2,
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Contact Support
          </Button>
          
          <NotificationCenter />
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label="toggle dark mode"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            {user && (
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={user.email || 'User'} />
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
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
                      <SupportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contact Support" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
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