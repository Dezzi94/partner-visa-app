import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  OpenInNew as OpenInNewIcon,
  LocalPolice as PoliceIcon,
  LocalHospital as MedicalIcon,
  Assignment as FormsIcon,
  Help as HelpIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

interface StateForm {
  state: string;
  title: string;
  description: string;
  url: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const officialResources: Resource[] = [
  {
    title: 'Australian Federal Police (AFP) Check',
    description: 'Apply for a National Police Check Certificate, required for your visa application.',
    url: 'https://www.afp.gov.au/what-we-do/services/criminal-records/national-police-checks',
    icon: <PoliceIcon />,
  },
  {
    title: 'Medical Examinations',
    description: 'Find approved panel physicians and book your immigration medical examination.',
    url: 'https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health/find-an-approved-doctor',
    icon: <MedicalIcon />,
  },
  {
    title: 'Relationship Registration',
    description: 'Information about registering your relationship in Australia.',
    url: 'https://www.ag.gov.au/families-and-marriage/marriage/register-relationship',
    icon: <FormsIcon />,
  },
];

const stateForms: StateForm[] = [
  {
    state: 'Victoria',
    title: 'Register a Domestic Relationship',
    description: 'Application form for registering a relationship in Victoria.',
    url: 'https://www.bdm.vic.gov.au/marriages-and-relationships/register-a-relationship',
  },
  {
    state: 'New South Wales',
    title: 'Relationships Register',
    description: 'Register your relationship in NSW.',
    url: 'https://www.nsw.gov.au/topics/marriages-relationships-and-divorce/relationship-register',
  },
  {
    state: 'Queensland',
    title: 'Civil Partnership Registration',
    description: 'Register a civil partnership in Queensland.',
    url: 'https://www.qld.gov.au/law/births-deaths-marriages-and-divorces/marriage-weddings-and-civil-partnerships',
  },
  // Add more states as needed
];

const faqs: FAQ[] = [
  {
    question: 'What evidence do I need for my relationship?',
    answer: 'You need to provide evidence across four categories: financial aspects, social aspects, nature of household, and nature of commitment. This can include joint bank accounts, shared lease/mortgage, photos together, travel documents, and statutory declarations from family and friends.',
    category: 'Evidence',
  },
  {
    question: 'How long does it take to process a partner visa?',
    answer: 'Processing times vary, but typically range from 12-24 months. You can check current processing times on the Department of Home Affairs website.',
    category: 'Processing',
  },
  {
    question: 'Can I work while waiting for my partner visa?',
    answer: 'If you applied for your partner visa in Australia and hold a Bridging Visa A, you typically have full work rights. Always check your visa conditions for specific restrictions.',
    category: 'Work Rights',
  },
  {
    question: 'Do I need to notify immigration if I change address?',
    answer: 'Yes, you must notify the Department of Home Affairs within 14 days of changing your address. This can be done through your ImmiAccount.',
    category: 'Requirements',
  },
  // Add more FAQs as needed
];

const ResourcesPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const handleFaqChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Resources"
        description="Official resources, forms, and frequently asked questions to help with your partner visa application."
      />

      {/* Official Resources Section */}
      <Typography variant="h5" sx={{ mb: 3, mt: 4 }}>
        Official Government Resources
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {officialResources.map((resource) => (
          <Grid item xs={12} md={4} key={resource.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: 'primary.main', mr: 1 }}>{resource.icon}</Box>
                  <Typography variant="h6">{resource.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {resource.description}
                </Typography>
                <Link
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  Visit Website
                  <OpenInNewIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* State Forms Section */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        State Registration Forms
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stateForms.map((form) => (
          <Grid item xs={12} md={6} key={form.state}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">
                    {form.state}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {form.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {form.description}
                </Typography>
                <Link
                  href={form.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  Access Forms
                  <OpenInNewIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQs Section */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mb: 6 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expandedFaq === `panel${index}`}
            onChange={handleFaqChange(`panel${index}`)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <HelpIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography sx={{ flexGrow: 1 }}>{faq.question}</Typography>
                <Chip 
                  label={faq.category} 
                  size="small" 
                  sx={{ ml: 2 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default ResourcesPage; 