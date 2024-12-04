import React from 'react';
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Link as LinkIcon,
  Book as GuideIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';

const ResourcesPage: React.FC = () => {
  const handleDownload = (guideTitle: string) => {
    // In a real application, this would be an API call to fetch the PDF
    // For now, we'll simulate a download with a sample PDF
    const element = document.createElement('a');
    element.href = `/sample-guides/${guideTitle.toLowerCase().replace(/ /g, '-')}.pdf`;
    element.download = `${guideTitle}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const officialResources = [
    {
      title: "Partner Visa (Subclass 820/801)",
      description: "Official information about temporary and permanent partner visas",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore",
    },
    {
      title: "Document Checklist",
      description: "Comprehensive list of required documents",
      link: "https://immi.homeaffairs.gov.au/help-support/departmental-forms",
    },
    {
      title: "Processing Times",
      description: "Current visa processing times and updates",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times",
    },
  ];

  const guides = [
    {
      title: "Relationship Evidence Guide",
      description: "How to gather and present evidence of your relationship",
      downloadable: true,
    },
    {
      title: "Financial Aspects Guide",
      description: "Understanding shared finances and financial commitments",
      downloadable: true,
    },
    {
      title: "Common Mistakes Guide",
      description: "Avoid common mistakes in your partner visa application",
      downloadable: true,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Resources"
        subtitle="Helpful resources and guides for your partner visa application"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Resources' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ContentCard
            title="Official Resources"
            icon={<LinkIcon />}
            elevation={2}
          >
            <List>
              {officialResources.map((resource, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DocumentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none' }}
                      >
                        {resource.title}
                      </Link>
                    }
                    secondary={resource.description}
                  />
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard
            title="Helpful Guides"
            icon={<GuideIcon />}
            elevation={2}
          >
            <List>
              {guides.map((guide, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    guide.downloadable && (
                      <Button
                        startIcon={<DownloadIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => handleDownload(guide.title)}
                      >
                        Download
                      </Button>
                    )
                  }
                >
                  <ListItemIcon>
                    <GuideIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={guide.title}
                    secondary={guide.description}
                  />
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourcesPage; 