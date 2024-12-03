import React from 'react';
import {
  Container,
  Grid,
  Link,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Language as WebsiteIcon,
  Description as DocumentIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const ResourcesPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Resources"
        subtitle="Official resources, forms, and frequently asked questions to help with your partner visa application."
      />

      {/* Official Resources Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Official Websites
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WebsiteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link 
                      href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Department of Home Affairs - Partner Visa
                    </Link>
                  }
                  secondary="Official information about partner visa requirements and application process"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WebsiteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link 
                      href="https://online.immi.gov.au" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ImmiAccount
                    </Link>
                  }
                  secondary="Portal for lodging and managing your visa application"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Important Forms
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link 
                      href="https://immi.homeaffairs.gov.au/form-listing/forms/47sp.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Form 47SP
                    </Link>
                  }
                  secondary="Application for partner migration"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link 
                      href="https://immi.homeaffairs.gov.au/form-listing/forms/40sp.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Form 40SP
                    </Link>
                  }
                  secondary="Sponsorship for a partner to migrate to Australia"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="What evidence do I need to provide?"
                  secondary="You need to provide evidence of your relationship in four categories: financial aspects, social aspects, nature of household, and nature of commitment."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="How long does processing take?"
                  secondary="Processing times vary, but typically range from 12 to 24 months. Check the Department's website for current processing times."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Can I work while waiting for the visa?"
                  secondary="If you applied onshore and hold a bridging visa, you may have work rights. Check your bridging visa conditions."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Do I need to translate documents?"
                  secondary="Yes, any documents not in English must be translated by a NAATI accredited translator."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResourcesPage; 