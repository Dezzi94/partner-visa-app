import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

interface CategoryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  completionStatus: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const categories: CategoryCard[] = [
    {
      title: 'Documents',
      description: 'Upload and manage your visa application documents',
      icon: <DocumentIcon fontSize="large" />,
      path: '/documents',
      completionStatus: 75,
    },
    {
      title: 'Forms',
      description: 'Fill out required visa application forms',
      icon: <FormsIcon fontSize="large" />,
      path: '/forms',
      completionStatus: 50,
    },
    {
      title: 'Timeline',
      description: 'Track important dates and milestones',
      icon: <TimelineIcon fontSize="large" />,
      path: '/timeline',
      completionStatus: 30,
    },
    {
      title: 'Interview Prep',
      description: 'Prepare for your visa interview',
      icon: <InterviewIcon fontSize="large" />,
      path: '/interview-prep',
      completionStatus: 0,
    },
  ];

  const recentNotifications = [
    {
      title: 'Document Upload Required',
      message: 'Please upload your police clearance certificate',
      type: 'warning',
    },
    {
      title: 'Form 47SP Completed',
      message: 'You have successfully completed Form 47SP',
      type: 'success',
    },
  ];

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <NotificationIcon color="info" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Welcome to Partner Visa Guide"
        subtitle="Track and manage your partner visa application process"
      />

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(category.path)}
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
                  }}
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
                    size="small"
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label={`Go to ${category.title}`}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Notifications</Typography>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate('/notifications')}
                  aria-label="View all notifications"
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
              <List>
                {recentNotifications.map((notification, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>{getStatusIcon(notification.type)}</ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage; 