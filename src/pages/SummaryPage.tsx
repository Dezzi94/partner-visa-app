import React from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Assignment as TaskIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  ListAlt as FormIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';

const SummaryPage: React.FC = () => {
  const applicationProgress = {
    documents: 75,
    forms: 60,
    timeline: 90,
    interview: 40,
  };

  const tasks = [
    {
      category: 'Documents',
      items: [
        { title: 'Identity Documents', status: 'complete' },
        { title: 'Relationship Evidence', status: 'complete' },
        { title: 'Financial Documents', status: 'incomplete' },
        { title: 'Character Documents', status: 'incomplete' },
      ],
    },
    {
      category: 'Forms',
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
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Application Summary"
        subtitle="Track your progress and next steps"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Summary' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ContentCard
            title="Application Progress"
            icon={<TimelineIcon />}
            elevation={2}
          >
            <List>
              <ListItem>
                <ListItemText
                  primary="Documents"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={applicationProgress.documents}
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {applicationProgress.documents}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Forms"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={applicationProgress.forms}
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {applicationProgress.forms}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Timeline"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={applicationProgress.timeline}
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {applicationProgress.timeline}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Interview Preparation"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={applicationProgress.interview}
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {applicationProgress.interview}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard
            title="Task Status"
            icon={<TaskIcon />}
            elevation={2}
          >
            {tasks.map((category) => (
              <Box key={category.category} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {category.category}
                </Typography>
                <List dense>
                  {category.items.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {item.status === 'complete' ? (
                          <CompleteIcon color="success" />
                        ) : (
                          <IncompleteIcon color="action" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <Chip
                            label={item.status}
                            size="small"
                            color={item.status === 'complete' ? 'success' : 'default'}
                            sx={{ mt: 0.5 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </ContentCard>
        </Grid>

        <Grid item xs={12}>
          <ContentCard
            title="Next Steps"
            icon={<DocumentIcon />}
            elevation={2}
          >
            <List>
              {nextSteps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <FormIcon color="primary" />
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