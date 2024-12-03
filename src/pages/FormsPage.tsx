import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Description as FormIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';

interface Form {
  id: string;
  code: string;
  name: string;
  description: string;
  helpText: string;
  url: string;
}

interface StatDecTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
}

const statDecTemplates: StatDecTemplate[] = [
  {
    id: '1',
    title: 'Applicant Relationship Statement',
    description: 'A comprehensive statement detailing your relationship history and commitment',
    template: `STATUTORY DECLARATION
    
I, [Your Full Name], of [Your Address], do solemnly and sincerely declare:

RELATIONSHIP HISTORY
1. I first met [Partner's Name] on [Date] at [Location/Circumstances].

2. Our relationship developed as follows:
   - First Meeting: [Describe how you met and your initial impressions]
   - Development of Relationship: [Describe how your relationship progressed]
   - Decision to Commit: [Describe when and how you decided to commit to each other]

LIVING ARRANGEMENTS
3. We began living together on [Date] at [Address].
   [Describe your living arrangements and how you share responsibilities]

FINANCIAL ASPECTS
4. We share our finances in the following ways:
   [Describe joint accounts, shared expenses, and financial commitments]

SOCIAL ASPECTS
5. Our relationship is known to family and friends:
   [Describe how you interact as a couple in social settings]

FUTURE PLANS
6. Our plans for the future include:
   [Describe your shared plans and commitments]

I make this solemn declaration conscientiously believing the same to be true.

Signature: ________________
Date: ____________________

Declared at [Location] on [Date]
Before me: [Qualified Witness Details]`,
  },
  {
    id: '2',
    title: 'Sponsor Relationship Statement',
    description: 'A statement from the sponsor supporting the partner visa application',
    template: `STATUTORY DECLARATION
    
I, [Sponsor's Full Name], of [Address], do solemnly and sincerely declare:

RELATIONSHIP BACKGROUND
1. I am the sponsor for [Applicant's Name]'s Partner Visa application.
2. I first met [Applicant's Name] on [Date] at [Location].

DEVELOPMENT OF RELATIONSHIP
3. Our relationship developed as follows:
   [Describe the progression of your relationship]

COMMITMENT TO RELATIONSHIP
4. I am committed to this relationship because:
   [Describe your commitment and future plans]

LIVING ARRANGEMENTS
5. Our current living arrangements:
   [Describe where and how you live together]

FINANCIAL SUPPORT
6. I confirm that:
   - I can provide financial support
   - We share our finances by [describe arrangements]

I make this solemn declaration conscientiously believing the same to be true.

Signature: ________________
Date: ____________________

Declared at [Location] on [Date]
Before me: [Qualified Witness Details]`,
  }
];

const forms: Form[] = [
  {
    id: '1',
    code: '47SP',
    name: 'Application for Partner Visa',
    description: 'Main application form for the Partner visa',
    helpText: 'This is the primary form for applying for a Partner visa',
    url: 'https://immi.homeaffairs.gov.au/form-listing/forms/47sp.pdf'
  },
  {
    id: '2',
    code: '40SP',
    name: 'Sponsorship for a Partner Visa',
    description: 'Sponsorship form for Partner visa applications',
    helpText: 'This form must be completed by the Australian sponsor',
    url: 'https://immi.homeaffairs.gov.au/form-listing/forms/40sp.pdf'
  }
];

const FormsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StatDecTemplate | null>(null);
  const { showToast } = useToast();

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (form: Form) => {
    window.open(form.url, '_blank');
    showToast('Download started', 'success');
  };

  const handleViewTemplate = (template: StatDecTemplate) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleCopyTemplate = (template: StatDecTemplate) => {
    navigator.clipboard.writeText(template.template);
    showToast('Template copied to clipboard', 'success');
  };

  return (
    <Box>
      <PageHeader
        title="Visa Forms"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Forms' },
        ]}
      />

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search forms by name or form number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Official Forms */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Official Forms
          </Typography>
          <Grid container spacing={3}>
            {filteredForms.map((form) => (
              <Grid item xs={12} md={6} lg={4} key={form.id}>
                <ContentCard
                  title={form.code}
                  subtitle={form.name}
                  icon={FormIcon}
                  elevation={1}
                >
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {form.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Tooltip title={form.helpText} arrow placement="top">
                      <IconButton size="small" color="primary">
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(form)}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>
                </ContentCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Statutory Declaration Templates */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Statutory Declaration Templates
          </Typography>
          <Grid container spacing={3}>
            {statDecTemplates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <ContentCard
                  title={template.title}
                  subtitle={template.description}
                  icon={FormIcon}
                  elevation={1}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => handleViewTemplate(template)}
                    >
                      View Template
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleCopyTemplate(template)}
                    >
                      Copy Template
                    </Button>
                  </Box>
                </ContentCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Template Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedTemplate?.title}</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              mt: 2,
            }}
          >
            {selectedTemplate?.template}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedTemplate) {
                handleCopyTemplate(selectedTemplate);
              }
            }}
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormsPage; 