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
  LinearProgress,
  Tooltip,
  Container,
  alpha,
  useTheme,
  Paper,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowIcon,
  QuestionAnswer as QuestionIcon,
  Info as InfoIcon,
  Build as BuildIcon,
  HelpOutline as HelpIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

interface QuestionProgress {
  review: boolean;
  practice: boolean;
  build: boolean;
}

interface Question {
  id: string;
  question: string;
  tips: string;
  completed: boolean;
  userAnswer?: string;
  progress: QuestionProgress;
}

const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    question: "What cultural differences have you experienced?",
    tips: "Discuss how you handle and respect cultural differences.",
    completed: false,
    progress: { review: false, practice: false, build: false },
  },
  {
    id: '2',
    question: "How has your relationship developed?",
    tips: "Mention key milestones and shared experiences.",
    completed: false,
    progress: { review: false, practice: false, build: false },
  },
  {
    id: '3',
    question: "What are your future plans together?",
    tips: "Discuss both short-term and long-term goals.",
    completed: false,
    progress: { review: false, practice: false, build: false },
  },
];

interface BuildResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
  notes: string;
}

const EMPTY_BUILD_RESPONSE: BuildResponse = {
  situation: '',
  task: '',
  action: '',
  result: '',
  notes: '',
};

const STAR_TIPS = {
  situation: "Set the scene and provide context. When and where did this happen?",
  task: "Explain the challenge or objective you faced. What needed to be done?",
  action: "Describe the specific steps you took. How did you handle it?",
  result: "Share the outcomes of your actions. What was achieved?",
};

const InterviewPrepPage: React.FC = () => {
  const theme = useTheme();
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [timer, setTimer] = useState({ isRunning: false, seconds: 0 });
  const [progress, setProgress] = useState({ completed: 0, total: INITIAL_QUESTIONS.length });
  const { showToast } = useToast();
  const [buildDialogOpen, setBuildDialogOpen] = useState(false);
  const [buildResponse, setBuildResponse] = useState<BuildResponse>(EMPTY_BUILD_RESPONSE);
  const [activeStep, setActiveStep] = useState(0);
  const [previewTab, setPreviewTab] = useState(0);

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
    if (!selectedQuestion || !answer.trim()) return;
    
    const updatedQuestions = questions.map(q =>
      q.id === selectedQuestion.id
        ? { 
            ...q, 
            completed: true, 
            userAnswer: answer,
            progress: { ...q.progress, practice: true }
          }
        : q
    );
    
    setQuestions(updatedQuestions);
    setOpenDialog(false);
    showToast('Answer saved successfully!', 'success');
  };

  const handleReview = (question: Question) => {
    if (!question.progress.practice) return;
    setSelectedQuestion(question);
    setAnswer(question.userAnswer || '');
    setOpenDialog(true);
  };

  const handleBuild = (question: Question) => {
    if (!question.progress.practice) return;
    setSelectedQuestion(question);
    setBuildResponse(EMPTY_BUILD_RESPONSE);
    setActiveStep(0);
    setBuildDialogOpen(true);
  };

  const handleBuildSave = () => {
    if (!selectedQuestion) return;
    
    // Combine STAR sections into a complete answer
    const fullAnswer = [
      `Situation: ${buildResponse.situation}`,
      `Task: ${buildResponse.task}`,
      `Action: ${buildResponse.action}`,
      `Result: ${buildResponse.result}`,
      buildResponse.notes ? `Additional Notes: ${buildResponse.notes}` : '',
    ].filter(Boolean).join('\n\n');

    const updatedQuestions = questions.map(q =>
      q.id === selectedQuestion.id
        ? { 
            ...q, 
            completed: true, 
            userAnswer: fullAnswer,
            progress: { ...q.progress, build: true }
          }
        : q
    );
    
    setQuestions(updatedQuestions);
    setBuildDialogOpen(false);
    showToast('Response built and saved successfully!', 'success');
  };

  const handleDownload = () => {
    if (!selectedQuestion) return;

    const content = `
Interview Question: ${selectedQuestion.question}

STAR Method Response:
-------------------
Situation:
${buildResponse.situation}

Task:
${buildResponse.task}

Action:
${buildResponse.action}

Result:
${buildResponse.result}

Additional Notes:
${buildResponse.notes}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-response-${selectedQuestion.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBuildStepChange = (step: number) => {
    setActiveStep(step);
  };

  const getStepContent = (step: number) => {
    const fields: { [key: number]: keyof BuildResponse } = {
      0: 'situation',
      1: 'task',
      2: 'action',
      3: 'result',
      4: 'notes',
    };

    const field = fields[step];
    if (!field) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {STAR_TIPS[field as keyof typeof STAR_TIPS] || "Add any additional notes or key points"}
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          value={buildResponse[field]}
          onChange={(e) => setBuildResponse(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={`Enter your ${field}`}
          variant="outlined"
        />
      </Box>
    );
  };

  const getPreviewContent = () => {
    if (previewTab === 0) {
      // Structured View
      return (
        <Stack spacing={2}>
          {Object.entries(buildResponse).map(([section, value]) => (
            value && (
              <Box key={section}>
                <Typography variant="subtitle1" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {section}
                </Typography>
                <Typography variant="body1" paragraph>
                  {value}
                </Typography>
              </Box>
            )
          ))}
        </Stack>
      );
    } else {
      // Continuous View
      return (
        <Typography variant="body1">
          {Object.entries(buildResponse)
            .filter(([_, value]) => value)
            .map(([_, value]) => value)
            .join('\n\n')}
        </Typography>
      );
    }
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

      {/* Timer and Progress Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          mb: 4,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Stack spacing={4}>
          {/* Timer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'monospace',
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3.5rem' }
            }}>
              {formatTime(timer.seconds)}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Tooltip title={timer.isRunning ? "Pause Practice" : "Start Practice"}>
                <Button
                  variant="contained"
                  onClick={() => setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                  startIcon={timer.isRunning ? <PauseIcon /> : <PlayIcon />}
                  color={timer.isRunning ? "error" : "primary"}
                >
                  {timer.isRunning ? "Pause" : "Start"}
                </Button>
              </Tooltip>
              <Tooltip title="Reset Timer">
                <Button
                  variant="outlined"
                  onClick={() => setTimer({ isRunning: false, seconds: 0 })}
                  startIcon={<RefreshIcon />}
                >
                  Reset
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Progress */}
          <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <Typography variant="h6">
                {progress.completed} of {progress.total} Questions Completed
              </Typography>
              <Tooltip title="Complete all questions to prepare for your interview">
                <HelpIcon fontSize="small" color="action" />
              </Tooltip>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progress.completed / progress.total) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Questions Section */}
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        Practice Questions
        <Tooltip title="Click 'Practice' to start answering questions">
          <HelpIcon fontSize="small" color="action" />
        </Tooltip>
      </Typography>

      <Stack spacing={2}>
        {questions.map((question, index) => (
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
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  {/* Question Number */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Question Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {question.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {question.tips}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={question.progress.practice ? "Review your answer" : "Practice first to review"}>
                      <span>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<InfoIcon />}
                          disabled={!question.progress.practice}
                          onClick={() => handleReview(question)}
                          sx={{ minWidth: 100 }}
                        >
                          Review
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Practice answering">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<QuestionIcon />}
                        onClick={() => handleStartPractice(question)}
                        sx={{ minWidth: 100 }}
                      >
                        Practice
                      </Button>
                    </Tooltip>
                    <Tooltip title={question.progress.practice ? "Build your answer" : "Practice first to build"}>
                      <span>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<BuildIcon />}
                          disabled={!question.progress.practice}
                          onClick={() => handleBuild(question)}
                          sx={{ minWidth: 100 }}
                        >
                          Build
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* Progress Steps */}
                <Box sx={{ pl: 7 }}>
                  <Stack direction="row" spacing={3}>
                    {['Review', 'Practice', 'Build'].map((step) => (
                      <Box
                        key={step}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: question.progress[step.toLowerCase() as keyof QuestionProgress]
                            ? theme.palette.primary.main
                            : theme.palette.text.disabled,
                        }}
                      >
                        <ArrowIcon fontSize="small" />
                        <Typography variant="body2">{step}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Card>
        ))}
      </Stack>

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
          <Button 
            onClick={handleSaveAnswer} 
            variant="contained"
            disabled={!answer.trim()}
          >
            Save Answer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Build Dialog */}
      <Dialog
        open={buildDialogOpen}
        onClose={() => setBuildDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Build Your Response</Typography>
            <IconButton onClick={() => setBuildDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {selectedQuestion?.question}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedQuestion?.tips}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Left side - STAR Method Steps */}
            <Box sx={{ width: '50%' }}>
              <Typography variant="subtitle1" gutterBottom>
                STAR Method Builder
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Situation</StepLabel>
                  <StepContent>{getStepContent(0)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Task</StepLabel>
                  <StepContent>{getStepContent(1)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Action</StepLabel>
                  <StepContent>{getStepContent(2)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Result</StepLabel>
                  <StepContent>{getStepContent(3)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Additional Notes</StepLabel>
                  <StepContent>{getStepContent(4)}</StepContent>
                </Step>
              </Stepper>
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={() => handleBuildStepChange(activeStep - 1)}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleBuildStepChange(activeStep + 1)}
                  disabled={activeStep === 4}
                >
                  Next
                </Button>
              </Box>
            </Box>

            {/* Right side - Preview */}
            <Divider orientation="vertical" flexItem />
            <Box sx={{ width: '50%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Preview
              </Typography>
              <Tabs
                value={previewTab}
                onChange={(_e, v) => setPreviewTab(v)}
                sx={{ mb: 2 }}
              >
                <Tab label="Structured" />
                <Tab label="Continuous" />
              </Tabs>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  height: 400, 
                  overflow: 'auto',
                  bgcolor: alpha(theme.palette.background.paper, 0.5)
                }}
              >
                {getPreviewContent()}
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!Object.values(buildResponse).some(Boolean)}
          >
            Download
          </Button>
          <Button onClick={() => setBuildDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleBuildSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!Object.values(buildResponse).some(Boolean)}
          >
            Save Response
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InterviewPrepPage; 