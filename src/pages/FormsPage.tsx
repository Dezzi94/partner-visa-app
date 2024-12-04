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
  Paper,
  Fade,
  Zoom,
  Divider,
  Card,
} from '@mui/material';
import {
  Description as FormIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  FileCopy as CopyIcon,
  Visibility as ViewIcon,
  Article as ArticleIcon,
  Assignment as AssignmentIcon,
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
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <PageHeader
        title="Visa Forms"
        subtitle="Download official forms and access statutory declaration templates"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Forms' },
        ]}
      />

      {/* Search Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          mb: 4,
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom align="center">
            Find Forms
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by form name or number (e.g., '47SP' or 'Partner Visa')..."
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
                  <IconButton 
                    size="small" 
                    onClick={() => setSearchQuery('')}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s',
                '&:hover, &.Mui-focused': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Official Forms Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ArticleIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                  Official Forms
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Download the required forms for your partner visa application
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {filteredForms.map((form, index) => (
                <Grid item xs={12} md={6} key={form.id}>
                  <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      elevation={1}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <FormIcon color="primary" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {form.code}
                          </Typography>
                          <Typography variant="subtitle1">
                            {form.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        {form.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip 
                          title={form.helpText}
                          arrow
                          placement="top"
                        >
                          <Button
                            variant="outlined"
                            startIcon={<HelpIcon />}
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              minWidth: 100,
                            }}
                          >
                            Help
                          </Button>
                        </Tooltip>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(form)}
                          size="small"
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            flexGrow: 1,
                          }}
                        >
                          Download Form
                        </Button>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Statutory Declaration Templates Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                  Statutory Declaration Templates
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use these templates to prepare your relationship statements
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {statDecTemplates.map((template, index) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      elevation={1}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <FormIcon color="primary" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {template.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 3 }}>
                        <Button
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewTemplate(template)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            flexGrow: 1,
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<CopyIcon />}
                          onClick={() => handleCopyTemplate(template)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            flexGrow: 1,
                          }}
                        >
                          Copy Template
                        </Button>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Template Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <FormIcon color="primary" />
          {selectedTemplate?.title}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              {selectedTemplate?.template}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<CopyIcon />}
            onClick={() => {
              if (selectedTemplate) {
                handleCopyTemplate(selectedTemplate);
              }
            }}
            sx={{ 
              textTransform: 'none',
              px: 3,
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