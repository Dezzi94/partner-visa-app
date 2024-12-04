import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  SvgIcon,
} from '@mui/material';
import {
  Home as HomeIcon,
  Description as DocumentIcon,
  Assignment as FormIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  LibraryBooks as ResourceIcon,
  Summarize as SummaryIcon,
  ContactSupport as ContactIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateUniqueId } from '@/utils/helpers';

interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: typeof SvgIcon;
}

interface SidebarProps {
  drawerWidth: number;
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

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuItems] = React.useState(createMenuItems);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleToggleDrawer = () => {
      setMobileOpen((prev) => !prev);
    };

    window.addEventListener('toggleDrawer', handleToggleDrawer);
    return () => {
      window.removeEventListener('toggleDrawer', handleToggleDrawer);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Partner Visa
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} edge="end">
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
                  window.dispatchEvent(new CustomEvent('openContactDialog'));
                  setMobileOpen(false);
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
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 