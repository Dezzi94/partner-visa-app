import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  IconButton,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore, addDays } from 'date-fns';
import { useNotifications, Notification } from '../context/NotificationContext';

// Progress Ring Component
const ProgressRing: React.FC<{ value: number, size?: number, thickness?: number }> = ({ 
  value, 
  size = 120, 
  thickness = 8 
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          borderRadius: '50%',
          boxShadow: 2,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.grey[200],
            borderRadius: '50%',
          }}
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
          <Typography variant="h6" component="div" color="text.secondary">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Category Card Component
const CategoryCard: React.FC<{
  title: string;
  progress: number;
  completed: number;
  total: number;
  dueDate?: string;
  icon: React.ReactElement;
  onClick: () => void;
}> = ({ title, progress, completed, total, dueDate, icon, onClick }) => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ mr: 1 }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {`${completed}/${total} Complete`}
        </Typography>
        {dueDate && (
          <Chip
            size="small"
            label={`Due: ${format(parseISO(dueDate), 'MMM d')}`}
            color={isBefore(parseISO(dueDate), addDays(new Date(), 7)) ? 'error' : 'default'}
          />
        )}
      </Box>
    </Paper>
  );
};

interface Category {
  id: string;
  title: string;
  progress: number;
  completed: number;
  total: number;
  dueDate?: string;
  icon: React.ReactNode;
  path: string;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { state } = useNotifications();
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  // Load progress from localStorage or initialize at 0
  const [categories, setCategories] = useState(() => {
    const savedProgress = localStorage.getItem('visa_application_progress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    return [
      {
        id: 'documents',
        title: 'Document Collection',
        progress: 0,
        completed: 0,
        total: 15,
        dueDate: addDays(new Date(), 30).toISOString(),
        icon: <DocumentIcon color="primary" />,
        path: '/documents'
      },
      {
        id: 'forms',
        title: 'Forms Completion',
        progress: 0,
        completed: 0,
        total: 5,
        dueDate: addDays(new Date(), 45).toISOString(),
        icon: <FormsIcon color="primary" />,
        path: '/forms'
      },
      {
        id: 'timeline',
        title: 'Timeline Events',
        progress: 0,
        completed: 0,
        total: 10,
        icon: <TimelineIcon color="primary" />,
        path: '/timeline'
      },
      {
        id: 'interview',
        title: 'Interview Preparation',
        progress: 0,
        completed: 0,
        total: 20,
        dueDate: addDays(new Date(), 60).toISOString(),
        icon: <InterviewIcon color="primary" />,
        path: '/interview-prep'
      }
    ];
  });

  // Save progress whenever it changes
  useEffect(() => {
    // Create a simplified version of categories without React elements for storage
    const categoriesToStore = categories.map(({ icon, ...rest }) => rest);
    localStorage.setItem('visa_application_progress', JSON.stringify(categoriesToStore));
  }, [categories]);

  const overallProgress = Math.round(
    categories.reduce((acc: number, cat: Category) => acc + cat.progress, 0) / categories.length
  );

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  // Function to update progress for a category
  const updateCategoryProgress = (categoryId: string, completedCount: number) => {
    setCategories((prevCategories: Category[]) => 
      prevCategories.map((category: Category) => {
        if (category.id === categoryId) {
          const progress = Math.round((completedCount / category.total) * 100);
          return {
            ...category,
            completed: completedCount,
            progress: progress
          };
        }
        return category;
      })
    );
  };

  const activeNotifications = state.notifications.filter(n => !n.isDismissed);
  const unreadCount = state.unreadCount;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Partner Visa Dashboard
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <ProgressRing value={overallProgress} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Overall Progress
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              {categories.map((category: Category) => (
                <Grid item xs={6} key={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.title}
                      </Typography>
                      <Typography variant="body1">
                        {category.progress > 0 ? `${category.progress}% Complete` : 'Not Started'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category: Category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <CategoryCard
              title={category.title}
              progress={category.progress}
              completed={category.completed}
              total={category.total}
              dueDate={category.dueDate}
              icon={category.icon}
              onClick={() => handleCategoryClick(category.path)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage; 