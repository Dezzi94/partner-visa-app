import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function InterviewPrepPage() {
  const questions = [
    {
      category: 'Relationship History',
      items: [
        {
          question: 'How and where did you first meet?',
          tips: 'Be specific about the date, location, and circumstances of your first meeting.',
        },
        {
          question: 'When did your relationship become serious?',
          tips: 'Mention key moments that led to your commitment to each other.',
        },
        {
          question: 'How do you share responsibilities in your relationship?',
          tips: 'Discuss financial, household, and other shared responsibilities.',
        },
      ],
    },
    {
      category: 'Living Arrangements',
      items: [
        {
          question: 'What is your current living situation?',
          tips: "Provide details about your home, how long you've lived there, and any shared expenses.",
        },
        {
          question: 'How have your living arrangements changed over time?',
          tips: 'Describe previous addresses and when you moved in together.',
        },
        {
          question: 'How do you divide household duties?',
          tips: 'Explain who is responsible for different household tasks.',
        },
      ],
    },
    {
      category: 'Future Plans',
      items: [
        {
          question: 'What are your plans for the future together?',
          tips: 'Discuss career goals, family plans, and where you plan to live.',
        },
        {
          question: 'How do your families feel about your relationship?',
          tips: "Describe your relationships with each other's families and their support.",
        },
        {
          question: 'What are your shared goals and aspirations?',
          tips: 'Talk about both short-term and long-term plans you have made together.',
        },
      ],
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Interview Preparation
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Prepare for your partner visa interview with these common questions and tips.
      </Typography>

      <Paper elevation={2} sx={{ mt: 4 }}>
        {questions.map((category) => (
          <Box key={category.category} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'primary.main', color: 'white' }}>
              {category.category}
            </Typography>
            {category.items.map((item, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    <strong>Tips:</strong> {item.tips}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
} 