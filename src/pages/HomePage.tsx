import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  Description as DocumentIcon,
  Assignment as FormsIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as InterviewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Document Checklist',
      description: 'Track and manage all required documents for your visa application',
      icon: DocumentIcon,
      path: '/documents',
    },
    {
      title: 'Visa Forms',
      description: 'Access and complete all necessary visa application forms',
      icon: FormsIcon,
      path: '/forms',
    },
    {
      title: 'Application Timeline',
      description: 'Monitor your application progress and upcoming deadlines',
      icon: TimelineIcon,
      path: '/timeline',
    },
    {
      title: 'Interview Preparation',
      description: 'Practice common interview questions and get preparation tips',
      icon: InterviewIcon,
      path: '/interview-prep',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Partner Visa Guide"
        breadcrumbs={[{ label: 'Home' }]}
      />
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your partner visa application assistant. Use the tools below to manage your application process effectively.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.path}>
            <ContentCard
              title={feature.title}
              subtitle={feature.description}
              icon={feature.icon}
              elevation={1}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(feature.path)}
            >
              <Box sx={{ height: 60 }} /> {/* Spacer for consistent card height */}
            </ContentCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 