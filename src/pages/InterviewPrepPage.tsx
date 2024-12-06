import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  LinearProgress,
  IconButton,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MoreVert as MoreVertIcon,
  QuestionAnswer as QuestionIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

interface Question {
  id: string;
  question: string;
  tips: string[];
  exampleAnswer: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  answer?: string;
}

const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'How did you meet your partner?',
    tips: ['Be specific about the date, location, and circumstances.'],
    exampleAnswer: 'We first met on March 15, 2021, at a mutual friend\'s birthday party at Cafe Luna. We were introduced by our friend Sarah and spent the evening discussing our shared interest in travel and photography. I remember being particularly impressed by their stories about backpacking through Southeast Asia.',
    status: 'not_started',
  },
  {
    id: '2',
    question: 'How has your relationship developed?',
    tips: [
      'Focus on key milestones and growth',
      'Include specific examples of shared experiences',
      'Mention how you overcame challenges together'
    ],
    exampleAnswer: 'Our relationship has grown through shared experiences and challenges. We started with regular coffee dates and weekend outings, which evolved into deeper conversations about our future. We moved in together after a year, which helped us understand each other better. We\'ve supported each other through career changes and family challenges, strengthening our bond.',
    status: 'not_started',
  },
  {
    id: '3',
    question: 'What are your shared interests and activities?',
    tips: [
      'Describe specific activities you enjoy together',
      'Mention how these activities strengthen your relationship',
      'Include both regular activities and special occasions'
    ],
    exampleAnswer: 'We share a passion for outdoor photography and hiking. Every weekend, we explore new trails and capture nature\'s beauty together. We also enjoy cooking international cuisines, often recreating dishes from our travels. These shared activities have helped us grow closer and create lasting memories.',
    status: 'not_started',
  },
  {
    id: '4',
    question: 'How do you handle cultural differences in your relationship?',
    tips: [
      'Discuss specific examples of cultural differences',
      'Explain how you respect and embrace each other\'s cultures',
      'Mention how you\'ve integrated both cultures into your relationship'
    ],
    exampleAnswer: 'We embrace our cultural differences as opportunities for growth. For example, we celebrate both of our traditional holidays and have learned each other\'s languages. We\'ve also introduced our families to our respective cultural traditions, creating a beautiful blend of both worlds.',
    status: 'not_started',
  },
  {
    id: '5',
    question: 'What are your future plans together?',
    tips: [
      'Be specific about short-term and long-term goals',
      'Show that you\'ve discussed and agreed on these plans',
      'Include both personal and professional aspirations'
    ],
    exampleAnswer: 'We\'ve carefully planned our future together. In the short term, we\'re focusing on establishing our home and advancing our careers. Long-term, we plan to start a family and potentially relocate to a larger home in a family-friendly neighborhood. We\'ve also discussed our retirement goals and how we\'ll support our extended families.',
    status: 'not_started',
  },
  {
    id: '6',
    question: 'How do you communicate and resolve conflicts?',
    tips: [
      'Provide specific examples of how you handle disagreements',
      'Emphasize mutual respect and understanding',
      'Show how you\'ve grown stronger through resolving conflicts'
    ],
    exampleAnswer: 'We believe in open, honest communication. When conflicts arise, we take time to listen to each other\'s perspectives without judgment. For example, when we disagreed about our holiday plans, we sat down and found a compromise that made both of us happy. We always ensure we\'re working together as a team.',
    status: 'not_started',
  },
  {
    id: '7',
    question: 'How do you support each other?',
    tips: [
      'Include both emotional and practical support',
      'Give specific examples of challenging times',
      'Show how you\'ve helped each other grow'
    ],
    exampleAnswer: 'We support each other in various ways. When my partner was studying for their professional certification, I took on more household responsibilities and provided emotional encouragement. Similarly, they supported me during my career transition, offering both practical advice and emotional stability.',
    status: 'not_started',
  },
  {
    id: '8',
    question: 'What role do your families play in your relationship?',
    tips: [
      'Describe your relationship with each other\'s families',
      'Mention how you handle family obligations',
      'Show respect for family traditions and values'
    ],
    exampleAnswer: 'Our families are an important part of our relationship. We regularly visit both families and include them in major decisions. We\'ve worked to build strong relationships with our in-laws, respecting their traditions while establishing our own. Both families have been supportive of our relationship and future plans.',
    status: 'not_started',
  },
  {
    id: '9',
    question: 'How do you manage your finances together?',
    tips: [
      'Explain your financial arrangement',
      'Show financial responsibility and planning',
      'Demonstrate mutual trust and agreement'
    ],
    exampleAnswer: 'We maintain a transparent and collaborative approach to finances. We have both joint and individual accounts, and we make major financial decisions together. We\'ve created a budget that reflects our shared goals while respecting individual needs. We regularly discuss our financial plans and adjust them as needed.',
    status: 'not_started',
  },
  {
    id: '10',
    question: 'What challenges have you faced and overcome together?',
    tips: [
      'Describe specific challenges you\'ve faced',
      'Explain how you worked together to overcome them',
      'Show how these experiences strengthened your relationship'
    ],
    exampleAnswer: 'One significant challenge we faced was maintaining our relationship during the COVID-19 lockdown. We used daily video calls and online date nights to stay connected. We also supported each other through job uncertainties and health concerns. These experiences have made our relationship stronger and more resilient.',
    status: 'not_started',
  }
];

const InterviewPrepPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const handleStartAgain = () => {
    handleResetTimer();
    setQuestions(INITIAL_QUESTIONS);
    setSelectedQuestion(null);
    setPracticeDialogOpen(false);
    setAnswer('');
  };

  const getProgress = () => {
    const completed = questions.filter(q => q.status === 'completed').length;
    return `${completed}/${questions.length} questions answered`;
  };

  const getTotalScore = () => {
    const total = questions.reduce((sum, q) => sum + (q.score || 0), 0);
    return `${total}/10`;
  };

  const handleToggleQuestion = (questionId: string) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  const handlePractice = (question: Question) => {
    setSelectedQuestion(question);
    setPracticeDialogOpen(true);
    setAnswer(question.answer || '');
    if (!isTimerRunning) {
      handleStartTimer();
    }
  };

  const handleSaveAnswer = () => {
    if (!selectedQuestion) return;
    
    setQuestions(prev => prev.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          status: 'completed',
          answer: answer,
          score: 5, // You can implement proper scoring logic here
        };
      }
      return q;
    }));

    setPracticeDialogOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, question: Question) => {
    event.stopPropagation();
    setSelectedQuestion(question);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteAnswer = () => {
    if (!selectedQuestion) return;
    
    setQuestions(prev => prev.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          status: 'not_started',
          answer: undefined,
          score: undefined,
        };
      }
      return q;
    }));

    handleMenuClose();
  };

  const handleViewHistory = () => {
    // Implement view history functionality
    handleMenuClose();
  };

  const handleEnhanceAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      const enhancedAnswer = `${answer}\n\nEnhanced version:\n\nI met my partner on March 15, 2021, at a vibrant birthday celebration for our mutual friend at Cafe Luna. Sarah, our mutual friend, made the introduction, recognizing our shared passions. Throughout the evening, we found ourselves deeply engaged in conversations about travel and photography, discovering our mutual love for exploration. What particularly caught my attention was their captivating stories about backpacking through Southeast Asia, which revealed their adventurous spirit and cultural curiosity. This initial connection through shared interests laid the foundation for our relationship.`;
      setAnswer(enhancedAnswer);
      setIsEnhancing(false);
    }, 1500);
  };

  return (
    <Box>
      <PageHeader
        title="Interview Preparation"
        subtitle="Practice answering common partner visa interview questions"
        icon={<QuestionIcon color="primary" />}
      />

      <Box sx={{ mb: 4, bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
        <Stack spacing={3}>
          {/* Timer and Progress Section */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <QuestionIcon />
              <Typography>Practice Timer: {formatTime(timer)}</Typography>
              {!isTimerRunning ? (
                <IconButton onClick={handleStartTimer} size="small">
                  <PlayIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handlePauseTimer} size="small">
                  <PauseIcon />
                </IconButton>
              )}
              <IconButton onClick={handleResetTimer} size="small">
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>Progress: {getProgress()}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>Total Score: {getTotalScore()}</Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  onClick={handleStartAgain}
                  size="small"
                >
                  Start Again
                </Button>
              </Stack>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={(questions.filter(q => q.status === 'completed').length / questions.length) * 100}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Questions Section */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestionIcon />
          Practice Questions
        </Typography>

        <Stack spacing={2}>
          {questions.map((question) => (
            <Paper 
              key={question.id} 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <QuestionIcon />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{question.question}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {question.status === 'not_started' ? '○ Not started' : question.status === 'completed' ? '✓ Completed' : '► In Progress'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handlePractice(question)}
                      size="small"
                    >
                      Practice
                    </Button>
                    <IconButton onClick={() => handleToggleQuestion(question.id)} size="small">
                      {expandedQuestionId === question.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, question)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Collapse in={expandedQuestionId === question.id}>
                  <Box sx={{ pl: 5 }}>
                    <Typography color="primary" gutterBottom>
                      Tips:
                    </Typography>
                    {question.tips.map((tip, index) => (
                      <Typography key={index} variant="body2" paragraph>
                        {tip}
                      </Typography>
                    ))}

                    <Typography color="primary" gutterBottom>
                      Example Answer:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.900' }}>
                      <Typography variant="body2">
                        {question.exampleAnswer}
                      </Typography>
                    </Paper>

                    {question.answer && (
                      <>
                        <Typography color="primary" sx={{ mt: 2 }} gutterBottom>
                          Your Answer:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.900' }}>
                          <Typography variant="body2">
                            {question.answer}
                          </Typography>
                        </Paper>
                      </>
                    )}
                  </Box>
                </Collapse>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Practice Dialog */}
      <Dialog
        open={practiceDialogOpen}
        onClose={() => setPracticeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Practice Answer</Typography>
            <Tooltip title="Enhance with AI">
              <span>
                <IconButton
                  onClick={handleEnhanceAnswer}
                  disabled={!answer.trim() || isEnhancing}
                >
                  {isEnhancing ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AutoAwesomeIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">
              {selectedQuestion?.question}
            </Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              variant="outlined"
              disabled={isEnhancing}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPracticeDialogOpen(false)}
            disabled={isEnhancing}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveAnswer}
            startIcon={<SaveIcon />}
            disabled={!answer.trim() || isEnhancing}
          >
            Save Answer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewHistory}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View History" />
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteAnswer}
          disabled={!selectedQuestion?.answer}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete Answer" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InterviewPrepPage; 