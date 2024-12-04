import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Card,
  IconButton,
  TextField,
  Collapse,
  Divider,
} from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckIcon,
  Assignment as PracticeIcon,
  Info as InfoIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';
import { useProgress } from '../contexts/ProgressContext';

interface Question {
  id: string;
  question: string;
  tips: string;
  exampleAnswer?: string;
  completed: boolean;
  expanded?: boolean;
  userAnswer?: string;
}

interface Timer {
  isRunning: boolean;
  seconds: number;
}

type Timeout = ReturnType<typeof setTimeout>;

const InterviewPrepPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: "How did you meet your partner?",
      tips: "Be specific about the date, location, and circumstances.",
      exampleAnswer: "We first met on March 15, 2021, at a mutual friend's birthday party at Cafe Luna. We were introduced by our friend Sarah and spent the evening discussing our shared interest in travel and photography. I remember being particularly impressed by their stories about backpacking through Southeast Asia.",
      completed: false,
      expanded: false,
    },
    {
      id: '2',
      question: "How has your relationship developed?",
      tips: "Mention key milestones and shared experiences.",
      completed: false,
      expanded: false,
    },
    {
      id: '3',
      question: "What are your future plans together?",
      tips: "Discuss both short-term and long-term goals.",
      completed: false,
      expanded: false,
    },
    {
      id: '4',
      question: "How do you share responsibilities?",
      tips: "Explain financial, household, and other shared duties.",
      completed: false,
      expanded: false,
    },
    {
      id: '5',
      question: "What cultural differences have you experienced?",
      tips: "Discuss how you handle and respect cultural differences.",
      completed: false,
      expanded: false,
    },
  ]);

  const [timer, setTimer] = useState<Timer>({
    isRunning: false,
    seconds: 0,
  });
  const [practiceStats, setPracticeStats] = useState({
    questionsAnswered: 0,
    totalScore: 0,
  });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const { showToast } = useToast();
  const { updateInterviewProgress } = useProgress();

  useEffect(() => {
    const completedQuestions = questions.filter(q => q.completed).length;
    updateInterviewProgress(completedQuestions, questions.length);
  }, [questions, updateInterviewProgress]);

  useEffect(() => {
    let interval: Timeout;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          seconds: prev.seconds + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const toggleTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const resetTimer = () => {
    setTimer({
      isRunning: false,
      seconds: 0,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPractice = (question: Question) => {
    setSelectedQuestion(question);
    setAnswer(question.userAnswer || '');
    setIsReviewing(question.completed);
    setOpenDialog(true);
    if (!timer.isRunning && !question.completed) {
      setTimer(prev => ({ ...prev, isRunning: true }));
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedQuestion && answer.trim()) {
      const updatedQuestions = questions.map(q =>
        q.id === selectedQuestion.id 
          ? { 
              ...q, 
              completed: true,
              userAnswer: answer,
            } 
          : q
      );
      setQuestions(updatedQuestions);
      if (!selectedQuestion.completed) {
        setPracticeStats(prev => ({
          questionsAnswered: prev.questionsAnswered + 1,
          totalScore: prev.totalScore + 5,
        }));
      }
      showToast('Answer submitted successfully', 'success');
      handleCloseDialog();
    } else {
      showToast('Please provide an answer', 'warning');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestion(null);
    setAnswer('');
    setIsReviewing(false);
  };

  const toggleQuestionExpanded = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, expanded: !q.expanded } : q
    ));
  };

  const handleStartAgain = () => {
    setQuestions(questions.map(q => ({ ...q, completed: false, userAnswer: undefined })));
    setPracticeStats({
      questionsAnswered: 0,
      totalScore: 0,
    });
    resetTimer();
    showToast('Practice session reset', 'info');
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Interview Preparation"
        subtitle="Practice answering common partner visa interview questions"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Interview Prep' },
        ]}
      />

      {/* Practice Timer and Stats Card */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TimerIcon color="primary" />
              <Typography variant="h6">
                Practice Timer: {formatTime(timer.seconds)}
              </Typography>
              <IconButton onClick={toggleTimer} color="primary">
                {timer.isRunning ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton onClick={resetTimer} color="primary">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              Progress: {practiceStats.questionsAnswered}/{questions.length} questions answered
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(practiceStats.questionsAnswered / questions.length) * 100}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              Total Score: {practiceStats.totalScore}/{questions.length * 5}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleStartAgain}
              sx={{ mt: 1 }}
            >
              Start Again
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Practice Questions */}
      <ContentCard
        title="Practice Questions"
        icon={<QuestionIcon />}
        elevation={2}
      >
        <List>
          {questions.map((question) => (
            <React.Fragment key={question.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 2,
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ListItemIcon>
                    {question.completed ? (
                      <CheckIcon color="success" />
                    ) : (
                      <QuestionIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={question.question}
                    secondary={question.completed ? 'Completed' : 'Not started'}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={question.completed ? "outlined" : "contained"}
                      color={question.completed ? "success" : "primary"}
                      onClick={() => handleStartPractice(question)}
                      startIcon={question.completed ? <InfoIcon /> : <PracticeIcon />}
                    >
                      {question.completed ? 'Review Answer' : 'Practice'}
                    </Button>
                    <IconButton onClick={() => toggleQuestionExpanded(question.id)}>
                      {question.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>
                <Collapse in={question.expanded} sx={{ width: '100%' }}>
                  <Box sx={{ pl: 6, pr: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Tips:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {question.tips}
                    </Typography>
                    {question.exampleAnswer && (
                      <>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Example Answer:
                        </Typography>
                        <Typography variant="body2">
                          {question.exampleAnswer}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Collapse>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </ContentCard>

      {/* Practice Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {isReviewing ? 'Review Answer' : 'Practice Question'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedQuestion?.question}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedQuestion?.tips}
          </Typography>
          <TextField
            label="Your Answer"
            multiline
            rows={6}
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            variant="outlined"
            disabled={isReviewing}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          {!isReviewing && (
            <Button
              onClick={handleSubmitAnswer}
              variant="contained"
              color="primary"
              disabled={!answer.trim()}
            >
              Submit Answer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewPrepPage; 