import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  Favorite as HeartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  HelpOutline as HelpIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

interface CategoryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  completionStatus: number;
  actionText: string;
  actionIcon: React.ReactNode;
  nextSteps: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info';
  category: 'documents' | 'forms' | 'timeline' | 'interview';
  action?: {
    text: string;
    path: string;
  };
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  // Check if it's the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  const categories: CategoryCard[] = [
    {
      title: 'Documents',
      description: 'Upload and manage your visa application documents',
      icon: <DocumentIcon fontSize="large" />,
      path: '/documents',
      completionStatus: 75,
      actionText: 'Upload Documents',
      actionIcon: <UploadIcon />,
      nextSteps: [
        'Upload police clearance certificate',
        'Submit proof of identity',
        'Provide relationship evidence'
      ],
    },
    {
      title: 'Forms',
      description: 'Fill out required visa application forms',
      icon: <FormsIcon fontSize="large" />,
      path: '/forms',
      completionStatus: 50,
      actionText: 'Continue Forms',
      actionIcon: <EditIcon />,
      nextSteps: [
        'Complete Form 47SP',
        'Fill statutory declaration',
        'Review form submissions'
      ],
    },
    {
      title: 'Timeline',
      description: 'Track important dates and milestones',
      icon: <TimelineIcon fontSize="large" />,
      path: '/timeline',
      completionStatus: 30,
      actionText: 'View Timeline',
      actionIcon: <ViewIcon />,
      nextSteps: [
        'Add relationship milestones',
        'Document shared experiences',
        'Update important dates'
      ],
    },
    {
      title: 'Interview Prep',
      description: 'Prepare for your visa interview',
      icon: <InterviewIcon fontSize="large" />,
      path: '/interview-prep',
      completionStatus: 0,
      actionText: 'Start Preparation',
      actionIcon: <InterviewIcon fontSize="small" />,
      nextSteps: [
        'Review common questions',
        'Practice responses',
        'Schedule mock interview'
      ],
    },
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Document Upload Required',
      message: 'Please upload your police clearance certificate',
      type: 'warning',
      category: 'documents',
      action: {
        text: 'Upload Now',
        path: '/documents',
      },
    },
    {
      id: '2',
      title: 'Form 47SP Completed',
      message: 'You have successfully completed Form 47SP',
      type: 'success',
      category: 'forms',
    },
    {
      id: '3',
      title: 'Interview Preparation Available',
      message: 'New practice questions have been added',
      type: 'info',
      category: 'interview',
      action: {
        text: 'Start Practice',
        path: '/interview-prep',
      },
    },
  ];

  const quickStats = [
    {
      label: 'Document Collection',
      value: '75%',
      icon: <DocumentIcon />,
      path: '/documents',
      tooltip: 'Based on required documents uploaded: 9 out of 12 documents completed',
    },
    {
      label: 'Forms Completed',
      value: '50%',
      icon: <FormsIcon />,
      path: '/forms',
      tooltip: 'Progress on mandatory forms: 2 out of 4 forms completed',
    },
    {
      label: 'Relationship Evidence',
      value: '30%',
      icon: <HeartIcon />,
      path: '/timeline',
      tooltip: 'Timeline entries and supporting documents: 6 out of 20 recommended items provided',
    },
    {
      label: 'Interview Readiness',
      value: '0%',
      icon: <InterviewIcon />,
      path: '/interview-prep',
      tooltip: 'Practice sessions completed: 0 out of 5 recommended sessions',
    },
  ];

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 28 }} color="success" />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 28 }} color="warning" />;
      default:
        return <InfoIcon sx={{ fontSize: 28 }} color="info" />;
    }
  };

  const calculateOverallProgress = () => {
    const total = categories.reduce((sum, category) => sum + category.completionStatus, 0);
    return Math.round(total / categories.length);
  };

  const handleDismissNotification = (id: string) => {
    setDismissedNotifications([...dismissedNotifications, id]);
  };

  const activeNotifications = notifications.filter(
    notification => !dismissedNotifications.includes(notification.id)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PageHeader
          title="Welcome to Partner Visa Guide"
          subtitle="Track and manage your partner visa application process"
        />
        <Tooltip title="Get Help" arrow>
          <IconButton
            color="primary"
            onClick={() => setShowHelp(true)}
            sx={{ ml: 2 }}
            aria-label="Get help with dashboard"
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Progress Overview Card */}
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              height: '100%', 
              bgcolor: 'background.default', 
              boxShadow: 2,
              position: 'relative',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Progress
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                my: 2 
              }}>
                <Tooltip
                  title="Overall progress based on completed tasks across all categories"
                  arrow
                  placement="top"
                >
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress
                      variant="determinate"
                      value={calculateOverallProgress()}
                      size={140}
                      thickness={4}
                      sx={{ color: 'primary.main' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        component="div" 
                        color="primary.main"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {calculateOverallProgress()}%
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
                <List sx={{ width: '100%' }}>
                  {quickStats.map((stat, index) => (
                    <Tooltip
                      key={index}
                      title={stat.tooltip}
                      arrow
                      placement="right"
                    >
                      <ListItem
                        button
                        onClick={() => navigate(stat.path)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            '& .MuiListItemIcon-root': {
                              color: 'primary.main',
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {stat.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body1" color="textPrimary">
                              {stat.label}
                            </Typography>
                          }
                          secondary={stat.value}
                        />
                        <Chip 
                          label={stat.value} 
                          color={
                            parseInt(stat.value) === 100
                              ? 'success'
                              : parseInt(stat.value) > 0
                              ? 'primary'
                              : 'default'
                          }
                          size="small"
                        />
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Cards and Notifications */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} key={category.title}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    bgcolor: 'background.default',
                    position: 'relative',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          color: 'primary.main',
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {category.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {category.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Tooltip 
                        title={`Click for details about ${category.title} progress`}
                        arrow
                      >
                        <Chip
                          label={`${category.completionStatus}% Complete`}
                          color={
                            category.completionStatus === 100
                              ? 'success'
                              : category.completionStatus > 0
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => setSelectedCategory(category)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={category.actionIcon}
                        onClick={() => navigate(category.path)}
                        sx={{ 
                          minWidth: 140,
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                      >
                        {category.actionText}
                      </Button>
                    </Box>
                  </CardContent>

                  {/* Category-specific notifications */}
                  {activeNotifications
                    .filter(notif => notif.category === category.title.toLowerCase())
                    .map((notification) => (
                      <Box
                        key={notification.id}
                        sx={{
                          p: 1,
                          bgcolor: 
                            notification.type === 'warning'
                              ? 'warning.light'
                              : notification.type === 'success'
                              ? 'success.light'
                              : 'info.light',
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(notification.type)}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">
                              {notification.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {notification.action && (
                              <Button
                                size="small"
                                variant="contained"
                                color={notification.type === 'warning' ? 'warning' : 'primary'}
                                onClick={() => navigate(notification.action!.path)}
                              >
                                {notification.action.text}
                              </Button>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleDismissNotification(notification.id)}
                              aria-label="Dismiss notification"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Progress Details Dialog */}
      <Dialog
        open={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory?.title} Progress Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Current Progress: {selectedCategory?.completionStatus}%
          </Typography>
          <Typography variant="h6" gutterBottom>
            Next Steps:
          </Typography>
          <List>
            {selectedCategory?.nextSteps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color={index === 0 ? 'primary' : 'disabled'} />
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCategory(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate(selectedCategory!.path);
              setSelectedCategory(null);
            }}
          >
            Go to {selectedCategory?.title}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Dashboard Help Guide</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Understanding Your Dashboard
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CircularProgress variant="determinate" value={100} size={24} />
              </ListItemIcon>
              <ListItemText 
                primary="Overall Progress"
                secondary="Shows your total application progress across all categories"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DocumentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Category Cards"
                secondary="Click on cards to access specific sections and track individual progress"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Notifications"
                secondary="Important updates and required actions appear under each relevant category"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* First-time User Onboarding */}
      <Dialog
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Welcome to Your Partner Visa Dashboard</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dashboard will help you track and manage your partner visa application process.
            Here's a quick guide to get you started:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <DocumentIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Document Management"
                secondary="Upload and organize all required visa documents"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FormsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Form Completion"
                secondary="Fill out necessary visa application forms"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HeartIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Relationship Timeline"
                secondary="Document your relationship milestones and evidence"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InterviewIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Interview Preparation"
                secondary="Practice for your visa interview with guided sessions"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOnboarding(false)}>Get Started</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage; 