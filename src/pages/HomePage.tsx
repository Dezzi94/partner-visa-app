import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Help as HelpIcon,
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useProgress } from '../contexts/ProgressContext';
import ContentCard from '../components/common/ContentCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { calculateCategoryProgress, calculateOverallProgress } = useProgress();

  const categories = [
    {
      title: 'Documents',
      description: 'Upload and manage your visa application documents',
      icon: <DocumentIcon fontSize="large" />,
      path: '/documents',
      completionStatus: calculateCategoryProgress('documents'),
      actionText: 'Upload Documents',
      actionIcon: <DocumentIcon fontSize="small" />,
      nextSteps: [
        'Upload identity documents',
        'Provide relationship evidence',
        'Submit financial documents'
      ],
    },
    {
      title: 'Forms',
      description: 'Fill out required visa application forms',
      icon: <FormsIcon fontSize="large" />,
      path: '/forms',
      completionStatus: calculateCategoryProgress('forms'),
      actionText: 'Continue Forms',
      actionIcon: <FormsIcon fontSize="small" />,
      nextSteps: [
        'Complete Form 47SP',
        'Fill sponsor documents',
        'Review all forms'
      ],
    },
    {
      title: 'Timeline',
      description: 'Track important dates and milestones',
      icon: <TimelineIcon fontSize="large" />,
      path: '/timeline',
      completionStatus: calculateCategoryProgress('timeline'),
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
      description: 'Practice answering common interview questions',
      icon: <InterviewIcon fontSize="large" />,
      path: '/interview-prep',
      completionStatus: calculateCategoryProgress('interview'),
      actionText: 'Start Practice',
      actionIcon: <InterviewIcon fontSize="small" />,
      nextSteps: [
        'Review common questions',
        'Practice responses',
        'Build confidence'
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PageHeader
          title="Welcome to Partner Visa Guide"
          subtitle="Track and manage your partner visa application process"
        />
        <Tooltip title="Get Help" arrow placement="left">
          <IconButton
            color="primary"
            onClick={() => navigate('/help')}
            sx={{ ml: 2 }}
            aria-label="Get help with dashboard"
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={4}>
        {/* Overall Progress Card */}
        <Grid item xs={12}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}15)`,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="500">
                  Application Progress
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Track your progress across all categories
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={calculateOverallProgress()}
                      size={80}
                      thickness={4}
                      sx={{ color: theme.palette.primary.main }}
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
                      <Typography variant="h6" component="div" color="primary">
                        {calculateOverallProgress()}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">
                      Overall Completion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep going! You're making progress.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {categories.map((category) => (
                    <Grid item xs={6} key={category.title}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer',
                          p: 1,
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => navigate(category.path)}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={category.completionStatus}
                          size={40}
                          thickness={4}
                          sx={{ color: category.completionStatus === 100 ? 'success.main' : 'primary.main' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {category.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.completionStatus}% Complete
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Category Cards */}
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.title}>
            <ContentCard
              title={category.title}
              icon={category.icon}
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {category.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Next Steps:
                  </Typography>
                  {category.nextSteps.map((step, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <ArrowIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={`${category.completionStatus}% Complete`}
                    color={category.completionStatus === 100 ? 'success' : 'default'}
                    sx={{ 
                      borderRadius: '16px',
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={category.actionText}
                    color="primary"
                    onClick={() => navigate(category.path)}
                    icon={category.actionIcon}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '16px',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  />
                </Box>
              </Box>
            </ContentCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage; 