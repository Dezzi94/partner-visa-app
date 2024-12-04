import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  TextField,
  IconButton,
  LinearProgress,
  Tooltip,
  Container,
  alpha,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Public as GlobalIcon,
  Favorite as RelationshipIcon,
  Timeline as TimelineIcon,
  HelpOutline as HelpIcon,
  QuestionAnswer as QuestionIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

interface Question {
  id: string;
  type: string;
  question: string;
  tips: string;
  completed: boolean;
  userAnswer?: string;
  category: string;
}

const QUESTIONS: Question[] = [
  {
    id: '1',
    type: 'cultural',
    category: 'Cultural Background',
    question: "What cultural differences have you experienced?",
    tips: "Discuss how you handle and respect cultural differences.",
    completed: false,
  },
  {
    id: '2',
    type: 'relationship',
    category: 'Relationship History',
    question: "How has your relationship developed?",
    tips: "Mention key milestones and shared experiences.",
    completed: false,
  },
  {
    id: '3',
    type: 'timeline',
    category: 'Future Plans',
    question: "What are your future plans together?",
    tips: "Discuss both short-term and long-term goals.",
    completed: false,
  },
];

const QuestionIcons: { [key: string]: React.ReactElement } = {
  "cultural": <GlobalIcon />,
  "relationship": <RelationshipIcon />,
  "timeline": <TimelineIcon />,
};

const InterviewPrepPage: React.FC = () => {
  const theme = useTheme();
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [timer, setTimer] = useState({ isRunning: false, seconds: 0 });
  const [progress, setProgress] = useState({ completed: 0, total: QUESTIONS.length });
  const { showToast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  useEffect(() => {
    const completed = questions.filter(q => q.completed).length;
    setProgress({ completed, total: questions.length });
  }, [questions]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPractice = (question: Question) => {
    setSelectedQuestion(question);
    setAnswer(question.userAnswer || '');
    setOpenDialog(true);
    if (!timer.isRunning && !question.completed) {
      setTimer(prev => ({ ...prev, isRunning: true }));
    }
  };

  const handleSaveAnswer = () => {
    if (!selectedQuestion) return;
    
    const updatedQuestions = questions.map(q =>
      q.id === selectedQuestion.id
        ? { ...q, completed: true, userAnswer: answer }
        : q
    );
    
    setQuestions(updatedQuestions);
    setOpenDialog(false);
    showToast('Answer saved successfully!', 'success');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Interview Preparation"
        subtitle="Practice answering common partner visa interview questions"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Interview Practice' },
        ]}
      />

      {/* Progress Section */}
      <Card 
        elevation={2}
        sx={{ 
          mb: 4,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Your Progress
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Track your interview preparation journey
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4,
            alignItems: 'center'
          }}>
            {/* Timer Section */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: 300 }}>
              <Card sx={{ 
                p: 3, 
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                <Typography variant="subtitle2" align="center" gutterBottom>
                  Practice Timer
                </Typography>
                <Typography 
                  variant="h2" 
                  align="center"
                  sx={{ 
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  {formatTime(timer.seconds)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title={timer.isRunning ? "Pause Practice" : "Start Practice"}>
                    <IconButton
                      onClick={() => setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                      sx={{
                        bgcolor: timer.isRunning ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
                        color: timer.isRunning ? theme.palette.error.main : theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: timer.isRunning ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      {timer.isRunning ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reset Timer">
                    <IconButton
                      onClick={() => setTimer({ isRunning: false, seconds: 0 })}
                      sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.grey[500], 0.2),
                        },
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Box>

            {/* Progress Tracker */}
            <Box sx={{ flex: 2, width: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  Questions Completed: {progress.completed}/{progress.total}
                </Typography>
                <Tooltip title="Complete all questions to prepare for your interview">
                  <HelpIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(progress.completed / progress.total) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mb: 2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {progress.completed === progress.total 
                  ? "Great job! You've completed all practice questions." 
                  : "Keep practicing to improve your interview skills"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Practice Questions */}
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        Practice Questions
        <Tooltip title="Click 'Practice' to start answering questions">
          <HelpIcon fontSize="small" color="action" />
        </Tooltip>
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {questions.map((question) => (
          <Card
            key={question.id}
            sx={{
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `2px solid ${alpha(theme.palette.primary.main, question.completed ? 0.5 : 0.2)}`,
                  }}
                >
                  {QuestionIcons[question.type]}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {question.category}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {question.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {question.tips}
                  </Typography>
                </Box>

                <Button
                  variant={question.completed ? "outlined" : "contained"}
                  onClick={() => handleStartPractice(question)}
                  startIcon={<QuestionIcon />}
                  sx={{
                    minWidth: 120,
                    height: 40,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  {question.completed ? 'Review Answer' : 'Practice Now'}
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Practice Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedQuestion?.completed ? 'Review Your Answer' : 'Practice Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {selectedQuestion?.category}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {selectedQuestion?.question}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedQuestion?.tips}
            </Typography>
          </Box>
          <TextField
            label="Your Answer"
            multiline
            rows={6}
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveAnswer} variant="contained">
            Save Answer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InterviewPrepPage; 