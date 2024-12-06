import React from 'react';
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Link as LinkIcon,
  Book as GuideIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';
import ContentCard from '@/components/common/ContentCard';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      title: 'Official Documentation',
      icon: <DocumentIcon />,
      items: [
        {
          title: 'Partner Visa Guide',
          description: 'Official guide from the Department of Home Affairs',
          link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore',
        },
        {
          title: 'Document Checklist',
          description: 'Complete list of required documents',
          link: 'https://immi.homeaffairs.gov.au/help-support/departmental-forms',
        },
      ],
    },
    {
      title: 'Helpful Links',
      icon: <LinkIcon />,
      items: [
        {
          title: 'Processing Times',
          description: 'Current visa processing times',
          link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
        },
        {
          title: 'Fees Calculator',
          description: 'Calculate visa application fees',
          link: 'https://immi.homeaffairs.gov.au/visas/visa-pricing-estimator',
        },
      ],
    },
    {
      title: 'Guides & Tutorials',
      icon: <GuideIcon />,
      items: [
        {
          title: 'Application Guide',
          description: 'Step-by-step guide to applying',
          link: '#',
        },
        {
          title: 'Evidence Guide',
          description: 'How to prepare your evidence',
          link: '#',
        },
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Resources"
        subtitle="Helpful information and links for your visa application"
      />

      <Grid container spacing={2}>
        {resources.map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <ContentCard
              title={section.title}
              icon={section.icon}
            >
              <List>
                {section.items.map((item) => (
                  <ListItem key={item.title} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <DownloadIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          underline="hover"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.title}
                        </Link>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </ContentCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourcesPage; 