import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Help as HelpIcon,
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  ArrowForward as ArrowIcon,
  TaskAlt as TaskIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useProgress } from '../contexts/ProgressContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { calculateCategoryProgress, calculateOverallProgress } = useProgress();
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleHelpOpen = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
  };

  const categories = [
    {
      title: 'Documents',
      description: 'Upload and manage your visa application documents',
      icon: <DocumentIcon />,
      path: '/documents',
      completionStatus: calculateCategoryProgress('documents'),
      actionText: 'Start Document Upload',
      nextSteps: [
        'Upload identity documents',
        'Provide relationship evidence',
        'Submit financial documents'
      ],
    },
    {
      title: 'Forms',
      description: 'Fill out required visa application forms',
      icon: <FormsIcon />,
      path: '/forms',
      completionStatus: calculateCategoryProgress('forms'),
      actionText: 'Begin Forms',
      nextSteps: [
        'Complete Form 47SP',
        'Fill sponsor documents',
        'Review all forms'
      ],
    },
    {
      title: 'Timeline',
      description: 'Track important dates and milestones',
      icon: <TimelineIcon />,
      path: '/timeline',
      completionStatus: calculateCategoryProgress('timeline'),
      actionText: 'View Timeline',
      nextSteps: [
        'Add relationship milestones',
        'Document shared experiences',
        'Update important dates'
      ],
    },
    {
      title: 'Interview Preparation',
      description: 'Practice answering common interview questions',
      icon: <InterviewIcon />,
      path: '/interview-prep',
      completionStatus: calculateCategoryProgress('interview'),
      actionText: 'Start Practice',
      nextSteps: [
        'Review common questions',
        'Practice responses',
        'Build confidence'
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'light' 
          ? alpha(theme.palette.primary.main, 0.02)
          : 'background.default',
        pt: 3,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <PageHeader
              title="Welcome to Your Visa Journey"
              subtitle="We'll guide you through each step of your partner visa application"
            />
          </Box>
          <Tooltip title="Click for help with using this application" arrow placement="left">
            <IconButton
              color="primary"
              onClick={handleHelpOpen}
              sx={{ 
                ml: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Help Dialog */}
        <Dialog
          open={helpDialogOpen}
          onClose={handleHelpClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}>
            <InfoIcon color="primary" />
            How to Use This Application
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="500">
              Welcome to your Partner Visa Application Guide!
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Typography variant="body1" paragraph>
                This application will help you prepare and track your partner visa application process. Here's how to use it:
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TaskIcon color="primary" fontSize="small" />
                Track your progress in the overview section at the top
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DocumentIcon color="primary" fontSize="small" />
                Upload and manage required documents in the Documents section
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FormsIcon color="primary" fontSize="small" />
                Complete necessary forms in the Forms section
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimelineIcon color="primary" fontSize="small" />
                Record important dates and milestones in the Timeline section
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InterviewIcon color="primary" fontSize="small" />
                Practice for your interview in the Interview Preparation section
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary">
              Click on any section to get started. Your progress will be automatically saved as you complete each task.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleHelpClose}
              variant="contained"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 100,
              }}
            >
              Got it
            </Button>
          </DialogActions>
        </Dialog>

        {/* Progress Overview */}
        <Card 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
            }}
          >
            <LinearProgress 
              variant="determinate" 
              value={calculateOverallProgress()} 
              sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            />
          </Box>
          
          <CardContent sx={{ pt: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}>
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
                      <Typography variant="h5" component="div" color="primary" fontWeight="bold">
                        {calculateOverallProgress()}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="500">
                      Your Progress
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {calculateOverallProgress() === 0 
                        ? "Let's get started!" 
                        : calculateOverallProgress() === 100 
                          ? "All done! Great job!" 
                          : "Keep going! You're doing great!"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {categories.map((category) => (
                    <Grid item xs={6} sm={3} key={category.title}>
                      <Box
                        onClick={() => navigate(category.path)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              color: category.completionStatus === 100 
                                ? theme.palette.success.main 
                                : theme.palette.primary.main,
                              display: 'flex',
                            }}
                          >
                            {category.completionStatus === 100 ? <TaskIcon /> : category.icon}
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {category.completionStatus}% Complete
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Category Cards */}
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} md={6} key={category.title}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 2,
                        p: 1.5,
                        mr: 2,
                        display: 'flex',
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {category.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {category.description}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={category.completionStatus}
                        sx={{ 
                          mb: 1,
                          height: 6,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {category.completionStatus}% Complete
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      color="primary"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <TaskIcon fontSize="small" />
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
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <ArrowIcon
                          fontSize="small"
                          sx={{ color: theme.palette.primary.main }}
                        />
                        <Typography variant="body2">
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={category.completionStatus === 100 ? <TaskIcon /> : category.icon}
                    onClick={() => navigate(category.path)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {category.completionStatus === 100 ? 'Review' : category.actionText}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 