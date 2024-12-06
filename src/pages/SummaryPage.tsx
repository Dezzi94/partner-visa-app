import React from 'react';
import {
  Box,
  Grid,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowForward as ArrowIcon,
  Assessment as AssessmentIcon,
  Assignment as TaskIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';
import ContentCard from '@/components/common/ContentCard';

const SummaryPage: React.FC = () => {
  const theme = useTheme();
  const applicationProgress = {
    documents: 75,
    forms: 60,
    timeline: 90,
    interview: 40,
  };

  const tasks = [
    {
      category: 'Documents',
      icon: <AssessmentIcon />,
      items: [
        { title: 'Identity Documents', status: 'complete' },
        { title: 'Relationship Evidence', status: 'complete' },
        { title: 'Financial Documents', status: 'incomplete' },
        { title: 'Character Documents', status: 'incomplete' },
      ],
    },
    {
      category: 'Forms',
      icon: <TaskIcon />,
      items: [
        { title: 'Form 47SP', status: 'complete' },
        { title: 'Form 40SP', status: 'complete' },
        { title: 'Statutory Declarations', status: 'incomplete' },
      ],
    },
  ];

  const nextSteps = [
    'Complete remaining statutory declarations',
    'Gather additional financial evidence',
    'Schedule health examination',
    'Prepare for interview',
  ];

  return (
    <Box>
      <PageHeader
        title="Application Summary"
        subtitle="Track your progress and next steps"
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ContentCard
            title="Progress Overview"
            icon={<TimelineIcon />}
          >
            <Grid container spacing={2}>
              {Object.entries(applicationProgress).map(([category, progress]) => (
                <Grid item xs={12} sm={6} md={3} key={category}>
                  <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {category}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {progress}% Complete
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </ContentCard>
        </Grid>

        {tasks.map((section) => (
          <Grid item xs={12} md={6} key={section.category}>
            <ContentCard
              title={section.category}
              icon={section.icon}
            >
              <List>
                {section.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {item.status === 'complete' ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        color: item.status === 'complete' ? 'text.primary' : 'error',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </ContentCard>
          </Grid>
        ))}

        <Grid item xs={12}>
          <ContentCard
            title="Next Steps"
            icon={<ArrowIcon />}
          >
            <List>
              {nextSteps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ArrowIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryPage; 