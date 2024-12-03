import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface Question {
  question: string;
  tips: string;
  exampleAnswer: string;
}

interface Category {
  category: string;
  items: Question[];
}

interface AnswerState {
  text: string;
  isSubmitted: boolean;
  score: number;
}

type AnswersRecord = Record<string, AnswerState>;

export default function InterviewPrepPage() {
  const [answers, setAnswers] = useState<AnswersRecord>({});
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [totalSubmitted, setTotalSubmitted] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const questions: Category[] = [
    {
      category: 'Relationship History',
      items: [
        {
          question: 'How and where did you first meet?',
          tips: 'Be specific about the date, location, and circumstances of your first meeting. Include details about who introduced you if applicable, and what made the moment memorable.',
          exampleAnswer: 'We first met on March 15, 2021, at a mutual friend\'s birthday party at Cafe Luna. We were introduced by our friend Sarah and spent the evening discussing our shared interest in travel and photography. I remember being particularly impressed by their stories about backpacking through Southeast Asia.',
        },
        {
          question: 'When did your relationship become serious?',
          tips: 'Mention key moments that led to your commitment to each other. Include specific events, conversations, or decisions that marked this transition.',
          exampleAnswer: 'Our relationship became serious around August 2021. We had been spending most weekends together, and after a meaningful conversation during a weekend trip to the coast, we decided to be exclusive. We realized we shared similar values, especially about family, career goals, and our vision for the future.',
        },
        {
          question: 'How do you maintain communication in your relationship?',
          tips: 'Describe your daily communication habits, including how you stay in touch during work hours or when apart.',
          exampleAnswer: 'We have a morning video call during breakfast when we\'re apart, and we text throughout the day to share interesting moments. We make it a point to have dinner together via video call at least three times a week, and we never go to bed without saying goodnight.',
        },
      ],
    },
    {
      category: 'Living Arrangements',
      items: [
        {
          question: 'What is your current living situation?',
          tips: 'Provide details about your home, how long you\'ve lived there, and how you share expenses. If living apart, explain the arrangement and future plans.',
          exampleAnswer: 'We\'ve been living together in a two-bedroom apartment in Melbourne since January 2022. We split the rent equally and share all household expenses through a joint account. We chose this location because it\'s close to both our workplaces and has good amenities nearby.',
        },
        {
          question: 'How do you handle periods of separation?',
          tips: 'Explain your strategies for maintaining the relationship during times apart, including communication methods and visit planning.',
          exampleAnswer: 'During work trips or family visits, we maintain daily contact through video calls and messages. We plan regular visits every 4-6 weeks, and we make these visits special by exploring new places together. We also send care packages and surprise gifts to show we\'re thinking of each other.',
        },
        {
          question: 'How do you divide household responsibilities?',
          tips: 'Detail how you share household duties and manage joint responsibilities.',
          exampleAnswer: 'We have a clear division of tasks based on our strengths and preferences. I handle the cooking and grocery shopping, while my partner manages the cleaning and laundry. We share the financial responsibilities equally and make all major household decisions together.',
        },
      ],
    },
    {
      category: 'Financial Arrangements',
      items: [
        {
          question: 'How do you manage shared finances?',
          tips: 'Explain your financial arrangement, including joint accounts, bill sharing, and saving strategies.',
          exampleAnswer: 'We maintain a joint account for shared expenses like rent, utilities, and groceries. We each contribute 30% of our monthly income to this account. We also have a shared savings account for our future home deposit, where we each save 20% of our income. We keep separate accounts for personal expenses.',
        },
        {
          question: 'How do you plan for major financial decisions?',
          tips: 'Describe your process for making significant financial decisions together.',
          exampleAnswer: 'We have monthly financial planning meetings where we review our budget and discuss any major upcoming expenses. We recently created a 5-year financial plan that includes saving for a house deposit, planning for potential wedding costs, and maintaining an emergency fund.',
        },
      ],
    },
    {
      category: 'Future Plans',
      items: [
        {
          question: 'What are your plans for the future together?',
          tips: 'Discuss both short-term and long-term plans, including career goals, family plans, and living arrangements.',
          exampleAnswer: 'In the short term, we\'re saving for a house in the suburbs and planning to get married next year. Long-term, we\'ve discussed having two children and potentially relocating internationally for career opportunities. We\'re both focused on advancing in our careers while supporting each other\'s goals.',
        },
        {
          question: 'How do your families feel about your relationship?',
          tips: 'Describe your relationships with each other\'s families and their involvement in your lives.',
          exampleAnswer: 'Both our families have been very supportive. We spend major holidays together, alternating between families. My partner\'s sister has become one of my closest friends, and we regularly have family dinners together. Our parents often visit us and have formed their own friendship.',
        },
        {
          question: 'How do you handle cultural differences?',
          tips: 'If applicable, explain how you navigate cultural differences and blend traditions.',
          exampleAnswer: 'We embrace both our cultural backgrounds by celebrating traditional festivals from both cultures. We\'ve learned each other\'s languages to better communicate with family members, and we incorporate both cultures into our daily lives through food, customs, and celebrations.',
        },
      ],
    },
    {
      category: 'Relationship Challenges',
      items: [
        {
          question: 'How do you resolve disagreements?',
          tips: 'Explain your conflict resolution process and how you handle differences of opinion.',
          exampleAnswer: 'We have a "24-hour rule" where we take time to cool off if needed, then discuss issues calmly. We always listen to each other\'s perspectives without interrupting and work together to find solutions. We\'ve also established ground rules for arguments, like no name-calling and staying focused on the current issue.',
        },
        {
          question: 'How do you support each other during difficult times?',
          tips: 'Describe how you provide emotional and practical support during challenges.',
          exampleAnswer: 'When my partner was dealing with a career setback last year, I took on more household responsibilities to give them time to focus on job searching. We regularly check in on each other\'s mental health and make time for both individual and couple self-care activities.',
        },
        {
          question: 'How do you maintain independence while being in a committed relationship?',
          tips: 'Explain how you balance personal space and individual interests with your relationship.',
          exampleAnswer: 'We encourage each other to maintain separate hobbies and friendships. I have a weekly art class, while my partner plays in a local sports team. We respect each other\'s need for alone time and believe maintaining our individuality makes our relationship stronger.',
        },
      ],
    },
  ];

  // Calculate total number of questions
  const totalQuestions = questions.reduce((acc, category) => acc + category.items.length, 0);

  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('interviewAnswers');
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers) as AnswersRecord;
        setAnswers(parsedAnswers);
        // Calculate initial scores
        let submitted = 0;
        let score = 0;
        Object.values(parsedAnswers).forEach((answer) => {
          if (answer.isSubmitted) {
            submitted++;
            score += answer.score;
          }
        });
        setTotalSubmitted(submitted);
        setTotalScore(score);
      }
    } catch (error) {
      console.error('Error loading saved answers:', error);
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  const handleAnswerChange = (question: string, value: string) => {
    try {
      const currentAnswer = answers[question] || { text: '', isSubmitted: false, score: 0 };
      const newAnswers = {
        ...answers,
        [question]: { ...currentAnswer, text: value }
      };
      setAnswers(newAnswers);
      localStorage.setItem('interviewAnswers', JSON.stringify(newAnswers));
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleSubmitAnswer = (question: string) => {
    try {
      const currentAnswer = answers[question];
      if (!currentAnswer?.text) {
        setSnackbarMessage('Please provide an answer before submitting');
        setShowSnackbar(true);
        return;
      }

      if (currentAnswer.isSubmitted) {
        setSnackbarMessage('Answer already submitted');
        setShowSnackbar(true);
        return;
      }

      // Simple scoring: 1-5 based on answer length and content
      const score = Math.min(5, Math.max(1, Math.floor(currentAnswer.text.length / 50)));
      
      const newAnswers = {
        ...answers,
        [question]: { ...currentAnswer, isSubmitted: true, score }
      };
      
      setAnswers(newAnswers);
      localStorage.setItem('interviewAnswers', JSON.stringify(newAnswers));
      
      setTotalSubmitted(prev => prev + 1);
      setTotalScore(prev => prev + score);
      
      setSnackbarMessage(`Answer submitted! Score: ${score}/5`);
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const progressPercentage = (totalSubmitted / totalQuestions) * 100;

  const handleStartAgain = () => {
    setAnswers({});
    setTotalScore(0);
    setTotalSubmitted(0);
    setTimer(0);
    setIsTimerRunning(false);
    localStorage.removeItem('interviewAnswers');
    setShowResetDialog(false);
    setSnackbarMessage('All answers have been cleared. You can start again!');
    setShowSnackbar(true);
  };

  try {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
        {/* Sticky Timer Bar */}
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'sticky',
            top: 64,
            zIndex: 1000,
            backgroundColor: 'background.paper',
            mb: 3,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="h6">Practice Timer: {formatTime(timer)}</Typography>
              <IconButton onClick={toggleTimer} color="primary" size="large">
                {isTimerRunning ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
              </IconButton>
              <IconButton onClick={resetTimer} color="secondary" size="large">
                <RefreshIcon />
              </IconButton>
              <Chip 
                label={isTimerRunning ? "Timer Running" : "Timer Stopped"} 
                color={isTimerRunning ? "success" : "default"}
              />
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAltIcon />}
                onClick={() => setShowResetDialog(true)}
                sx={{ ml: 'auto' }}
              >
                Start Again
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress: {totalSubmitted}/{totalQuestions} questions answered
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Score: {totalScore}/{totalQuestions * 5}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Paper>

        <Typography variant="h4" component="h1" gutterBottom sx={{ px: 2 }}>
          Interview Preparation
        </Typography>

        {questions.map((category) => (
          <Paper elevation={2} sx={{ mt: 4 }} key={category.category}>
            <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'primary.main', color: 'white' }}>
              {category.category}
            </Typography>
            {category.items.map((item, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ flexGrow: 1 }}>{item.question}</Typography>
                    {answers[item.question]?.isSubmitted && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`Score: ${answers[item.question].score}/5`}
                        color="success"
                        size="small"
                        sx={{ mr: 2 }}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">Tips:</Typography>
                      <Typography color="text.secondary">{item.tips}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">Example Answer:</Typography>
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {item.exampleAnswer}
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Answer"
                      variant="outlined"
                      value={answers[item.question]?.text || ''}
                      onChange={(e) => handleAnswerChange(item.question, e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={answers[item.question]?.isSubmitted}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmitAnswer(item.question)}
                      disabled={answers[item.question]?.isSubmitted}
                      startIcon={<CheckCircleIcon />}
                    >
                      {answers[item.question]?.isSubmitted ? 'Submitted' : 'Submit Answer'}
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        ))}

        <Dialog
          open={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          aria-labelledby="reset-dialog-title"
        >
          <DialogTitle id="reset-dialog-title">
            Start Again?
          </DialogTitle>
          <DialogContent>
            <Typography>
              This will clear all your answers and scores. Are you sure you want to start again?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResetDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleStartAgain} color="secondary" variant="contained">
              Yes, Start Again
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  } catch (error) {
    console.error('Error rendering InterviewPrepPage:', error);
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error loading the Interview Preparation page. Please try refreshing the page.
        </Typography>
      </Box>
    );
  }
} 