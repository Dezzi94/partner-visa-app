import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Tab,
  Tabs,
  Chip,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Document Expiring',
      message: 'Your police check will expire in 30 days.',
      timestamp: new Date(),
      read: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'info',
      title: 'Application Update',
      message: 'Your application status has been updated.',
      timestamp: new Date(),
      read: true,
      priority: 'medium',
    },
  ]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
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

  const formatNotificationDate = (date: Date): string => {
    return format(date, 'PPp');
  };

  const getTimeUntilDue = (dueDate: Date): string => {
    const days = differenceInDays(dueDate, new Date());
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`${unreadCount} unread notifications`}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <NotificationsActiveIcon />
          ) : notifications.length > 0 ? (
            <NotificationsIcon />
          ) : (
            <NotificationsOffIcon />
          )}
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="notification tabs"
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>
        </Box>
        {notifications
          .filter(notification => currentTab === 0 || !notification.read)
          .map((notification, index) => (
            <React.Fragment key={notification.id}>
              {index > 0 && <Divider />}
              <MenuItem sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {getNotificationIcon(notification.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                        {notification.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={notification.priority}
                        color={getPriorityColor(notification.priority)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          {formatNotificationDate(notification.timestamp)}
                        </Typography>
                      </Box>
                      {notification.dueDate && (
                        <Chip
                          size="small"
                          label={getTimeUntilDue(notification.dueDate)}
                          color={differenceInDays(notification.dueDate, new Date()) < 3 ? 'error' : 'default'}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
            </React.Fragment>
          ))}
        {notifications.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter; 