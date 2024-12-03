import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  ListItemSecondary,
  Tab,
  Tabs,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNotifications, Notification } from '../context/NotificationContext';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const { state, markAsRead, dismissNotification, clearAll } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatNotificationDate = (date: Date) => {
    if (isToday(date)) {
      return `Today ${format(date, 'HH:mm')}`;
    }
    if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    }
    return format(date, 'MMM d, yyyy HH:mm');
  };

  const getTimeUntilDue = (dueDate: Date) => {
    const daysUntil = differenceInDays(dueDate, new Date());
    if (daysUntil < 0) {
      return 'Overdue';
    }
    if (daysUntil === 0) {
      return 'Due today';
    }
    if (daysUntil === 1) {
      return 'Due tomorrow';
    }
    return `Due in ${daysUntil} days`;
  };

  const activeNotifications = state.notifications.filter((n) => !n.isDismissed);
  const tasks = activeNotifications.filter((n) => n.category === 'task');
  const deadlines = activeNotifications.filter((n) => n.category === 'deadline');
  const alerts = activeNotifications.filter((n) => n.category === 'alert');

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-describedby={id}
      >
        <Badge badgeContent={state.unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 },
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Notifications</Typography>
          <Button
            startIcon={<ClearAllIcon />}
            onClick={clearAll}
            size="small"
          >
            Clear All
          </Button>
        </Box>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="notification tabs">
          <Tab label={`All (${activeNotifications.length})`} />
          <Tab label={`Tasks (${tasks.length})`} />
          <Tab label={`Deadlines (${deadlines.length})`} />
          <Tab label={`Alerts (${alerts.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <NotificationList notifications={activeNotifications} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <NotificationList notifications={tasks} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <NotificationList notifications={deadlines} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <NotificationList notifications={alerts} />
        </TabPanel>
      </Popover>
    </>
  );
};

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const { markAsRead, dismissNotification } = useNotifications();

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No notifications</Typography>
      </Box>
    );
  }

  return (
    <List>
      {notifications.map((notification) => (
        <React.Fragment key={notification.id}>
          <ListItem
            alignItems="flex-start"
            sx={{
              bgcolor: notification.isRead ? 'transparent' : 'action.hover',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box sx={{ mr: 2, mt: 1 }}>
              {getNotificationIcon(notification.type)}
            </Box>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">{notification.title || notification.message}</Typography>
                  <Chip
                    size="small"
                    label={notification.priority}
                    color={getPriorityColor(notification.priority)}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatNotificationDate(notification.timestamp)}
                    </Typography>
                    {notification.dueDate && (
                      <Chip
                        size="small"
                        label={getTimeUntilDue(notification.dueDate)}
                        color={differenceInDays(notification.dueDate, new Date()) < 3 ? 'error' : 'default'}
                      />
                    )}
                  </Box>
                </Box>
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {!notification.isRead && (
                <Button
                  size="small"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
              <Button
                size="small"
                color="error"
                onClick={() => dismissNotification(notification.id)}
              >
                Dismiss
              </Button>
            </Box>
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationCenter; 