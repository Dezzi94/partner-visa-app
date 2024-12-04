import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Divider,
  Chip,
} from '@mui/material';
import {
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
  title: string;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  read: boolean;
  timestamp: Date;
  dueDate?: Date;
}

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Document Expiring',
      message: 'Your police check will expire in 30 days.',
      type: 'warning',
      read: false,
      timestamp: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Application Update',
      message: 'Your application status has been updated.',
      type: 'info',
      read: true,
      timestamp: new Date(),
    },
  ]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
        return <InfoIcon color="info" />;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'PPp');
  };

  const getDueDateStatus = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    return `Due in ${days} days`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <NotificationsActiveIcon />
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
          sx: { width: 360, maxHeight: 500 },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <Tabs
          value={currentTab}
          onChange={(_event, newValue) => setCurrentTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab label="All" />
          <Tab label="Unread" />
        </Tabs>
        <Divider />
        <Box sx={{ mt: 1 }}>
          {notifications
            .filter(notification => currentTab === 0 || !notification.read)
            .map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <MenuItem sx={{ py: 2, px: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getNotificationIcon(notification.type)}
                      <Typography variant="subtitle2" sx={{ ml: 1, flexGrow: 1 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    {notification.dueDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          {getDueDateStatus(notification.dueDate)}
                        </Typography>
                        <Chip
                          size="small"
                          sx={{ ml: 1 }}
                          label={getDueDateStatus(notification.dueDate)}
                          color={differenceInDays(notification.dueDate, new Date()) < 3 ? 'error' : 'default'}
                        />
                      </Box>
                    )}
                  </Box>
                </MenuItem>
              </React.Fragment>
            ))}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationCenter; 