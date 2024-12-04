import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  alpha,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
  ArrowForward as ArrowIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';
import { useProgress } from '@/contexts/ProgressContext';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { calculateCategoryProgress } = useProgress();
  const [infoOpen, setInfoOpen] = useState(false);

  const progressCards = [
    { icon: <DocumentIcon />, progress: '0% Complete' },
    { icon: <FormsIcon />, progress: '0% Complete' },
    { icon: <TimelineIcon />, progress: '0% Complete' },
    { icon: <InterviewIcon />, progress: '0% Complete' },
  ];

  const categoryCards = [
    {
      title: 'Documents',
      description: 'Upload and manage your visa application documents',
      icon: <DocumentIcon />,
      nextSteps: [
        'Upload identity documents',
        'Provide relationship evidence',
        'Submit financial documents',
      ],
      action: {
        text: 'Start Document Upload',
        path: '/documents',
      },
    },
    {
      title: 'Forms',
      description: 'Fill out required visa application forms',
      icon: <FormsIcon />,
      nextSteps: [
        'Complete Form 47SP',
        'Fill sponsor documents',
        'Review all forms',
      ],
      action: {
        text: 'Begin Forms',
        path: '/forms',
      },
    },
    {
      title: 'Timeline',
      description: 'Track important dates and milestones',
      icon: <TimelineIcon />,
      nextSteps: [
        'Add relationship milestones',
        'Document shared experiences',
        'Update important dates',
      ],
      action: {
        text: 'View Timeline',
        path: '/timeline',
      },
    },
    {
      title: 'Interview Preparation',
      description: 'Practice answering common interview questions',
      icon: <InterviewIcon />,
      nextSteps: [
        'Review common questions',
        'Practice responses',
        'Build confidence',
      ],
      action: {
        text: 'Start Practice',
        path: '/interview',
      },
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <PageHeader
          title="Welcome to Your Visa Journey"
          subtitle="We'll guide you through each step of your partner visa application"
        />
        <IconButton
          onClick={() => setInfoOpen(true)}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <InfoIcon color="primary" />
        </IconButton>
      </Box>

      {/* Progress Overview */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            minWidth: 'fit-content'
          }}>
            <Typography
              color="primary"
              sx={{
                fontSize: '2rem',
                fontWeight: 500,
                mr: 2,
              }}
            >
              0%
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Let's get started!
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ flex: 1, maxWidth: 'calc(100% - 200px)' }}>
            {progressCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.progress}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Category Cards */}
      <Grid container spacing={3}>
        {categoryCards.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      mr: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  0% Complete
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Next Steps:
                  </Typography>
                  {category.nextSteps.map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <ArrowIcon
                        fontSize="small"
                        sx={{ mr: 1, color: 'primary.main' }}
                      />
                      <Typography variant="body2">
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(category.action.path)}
                  sx={{
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: 'none',
                  }}
                >
                  {category.action.text}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Info Dialog */}
      <Dialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            About Your Visa Journey
            <IconButton onClick={() => setInfoOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dashboard helps you track and manage your partner visa application process. Here's what each section means:
          </DialogContentText>
          <Box component="ul" sx={{ mt: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Documents:</strong> Upload and organize all required documentation for your visa application.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Forms:</strong> Complete necessary visa application forms and ensure all information is accurate.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.primary">
                <strong>Timeline:</strong> Keep track of important dates and milestones in your relationship and application process.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1" color="text.primary">
                <strong>Interview Preparation:</strong> Practice common interview questions and prepare for your visa interview.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage; 