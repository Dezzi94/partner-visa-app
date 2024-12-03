import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Description as FormIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Help as HelpIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';

interface FormInfo {
  id: string;
  name: string;
  code: string;
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

const forms: FormInfo[] = [
  {
    id: '1',
    name: 'Application for Partner Visa',
    code: 'Form 47SP',
    description: 'Main application form for the Partner visa',
    helpText: 'This is the primary form that needs to be completed by the visa applicant. It collects personal information, relationship details, and other relevant data.',
    url: 'https://immi.homeaffairs.gov.au/form-listing/forms/47sp.pdf',
  },
  {
    id: '2',
    name: 'Sponsorship for a Partner Visa',
    code: 'Form 40SP',
    description: 'Sponsorship form to be completed by the Australian partner',
    helpText: 'This form must be completed by the Australian citizen or permanent resident who is sponsoring their partner for the visa.',
    url: 'https://immi.homeaffairs.gov.au/form-listing/forms/40sp.pdf',
  },
  {
    id: '3',
    name: 'Statutory Declaration',
    code: 'Form 888',
    description: 'Supporting witness declarations',
    helpText: 'This form is used by Australian citizens or permanent residents to provide supporting statements about your relationship.',
    url: 'https://immi.homeaffairs.gov.au/form-listing/forms/888.pdf',
  },
];

const statDecTemplates: StatDecTemplate[] = [
  {
    id: '1',
    title: 'Applicant Statement Template',
    description: 'Personal statement about your relationship history and future plans',
    template: `I, [YOUR FULL NAME], declare that:

1. I first met [PARTNER'S NAME] on [DATE] at [LOCATION/CIRCUMSTANCES].

2. Our relationship developed as follows:
   - [DESCRIBE HOW YOU STARTED DATING]
   - [MENTION KEY MILESTONES: BECOMING EXCLUSIVE, MEETING FAMILIES, ETC.]
   - [DESCRIBE WHEN YOU MOVED IN TOGETHER IF APPLICABLE]

3. We demonstrate our commitment to each other by:
   - [DESCRIBE SHARED FINANCES/ACCOUNTS]
   - [MENTION SHARED RESPONSIBILITIES]
   - [DESCRIBE FUTURE PLANS TOGETHER]

4. We have lived together at:
   - [ADDRESS] from [DATE] to [DATE]
   [LIST ALL ADDRESSES IF MULTIPLE]

5. Our relationship is genuine and continuing because:
   - [DESCRIBE DAILY LIFE TOGETHER]
   - [MENTION SUPPORT FOR EACH OTHER]
   - [DESCRIBE SHARED SOCIAL LIFE/FAMILY INTEGRATION]

I understand that a person who intentionally makes a false statement in a statutory declaration is guilty of an offence under section 11 of the Statutory Declarations Act 1959.`,
  },
  {
    id: '2',
    title: 'Witness Statement Template',
    description: 'Template for Form 888 - Statutory declaration by supporting witness',
    template: `I, [WITNESS FULL NAME], declare that:

1. I am an Australian [CITIZEN/PERMANENT RESIDENT] and I hold [PASSPORT/EVIDENCE NUMBER].

2. I have known [APPLICANT NAME] for [TIME PERIOD] and [PARTNER NAME] for [TIME PERIOD].

3. I know them through [DESCRIBE HOW YOU KNOW THE COUPLE].

4. I have witnessed their relationship develop through:
   - [DESCRIBE SOCIAL INTERACTIONS/EVENTS]
   - [MENTION SPECIFIC EXAMPLES OF THEIR COMMITMENT]
   - [DESCRIBE THEIR INTERACTION AS A COUPLE]

5. Based on my observations, I believe their relationship is genuine because:
   - [PROVIDE SPECIFIC EXAMPLES]
   - [DESCRIBE THEIR BEHAVIOUR AS A COUPLE]
   - [MENTION ANY FUTURE PLANS THEY'VE SHARED]

I understand that a person who intentionally makes a false statement in a statutory declaration is guilty of an offence under section 11 of the Statutory Declarations Act 1959.`,
  },
];

const FormsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<StatDecTemplate | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useToast();

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (form: FormInfo) => {
    window.open(form.url, '_blank');
    showToast(`Downloading ${form.code}`, 'info');
  };

  const handleCopyTemplate = (template: StatDecTemplate) => {
    navigator.clipboard.writeText(template.template);
    showToast('Template copied to clipboard', 'success');
  };

  const handleViewTemplate = (template: StatDecTemplate) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
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