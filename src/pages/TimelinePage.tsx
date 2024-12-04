import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Tooltip,
  Paper,
  Zoom,
  Fade,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as HeartIcon,
  Flight as TravelIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Description as DocumentIcon,
  Timeline as TimelineIcon,
  FileCopy as CopyIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';

interface Milestone {
  id: string;
  date: Date;
  type: string;
  title: string;
  description: string;
  location?: string;
}

const milestoneTypes = [
  { value: 'firstMeet', label: 'First Meeting', icon: <HeartIcon /> },
  { value: 'travel', label: 'Travel Together', icon: <TravelIcon /> },
  { value: 'moveIn', label: 'Move In Together', icon: <HomeIcon /> },
  { value: 'engagement', label: 'Engagement', icon: <HeartIcon /> },
  { value: 'document', label: 'Document Submission', icon: <DocumentIcon /> },
  { value: 'other', label: 'Other Event', icon: <EventIcon /> },
];

const STORAGE_KEY = 'relationship_milestones';

const TimelinePage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    // Load milestones from localStorage on initial render
    const savedMilestones = localStorage.getItem(STORAGE_KEY);
    if (savedMilestones) {
      const parsedMilestones = JSON.parse(savedMilestones);
      // Convert date strings back to Date objects
      return parsedMilestones.map((milestone: any) => ({
        ...milestone,
        date: new Date(milestone.date)
      }));
    }
    return [];
  });

  // Save milestones to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
  }, [milestones]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date(),
    type: 'firstMeet',
    title: '',
    description: '',
    location: '',
  });

  const handleOpenDialog = (milestone?: Milestone) => {
    if (milestone) {
      setSelectedMilestone(milestone);
      setFormData({
        date: milestone.date,
        type: milestone.type,
        title: milestone.title,
        description: milestone.description,
        location: milestone.location || '',
      });
      setEditMode(true);
    } else {
      setSelectedMilestone(null);
      setFormData({
        date: new Date(),
        type: 'firstMeet',
        title: '',
        description: '',
        location: '',
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMilestone(null);
    setEditMode(false);
  };

  const handleSaveMilestone = () => {
    if (editMode && selectedMilestone) {
      const updatedMilestones = milestones.map(m => 
        m.id === selectedMilestone.id 
          ? { ...formData, id: selectedMilestone.id } 
          : m
      );
      setMilestones(updatedMilestones);
      showToast('Milestone updated successfully', 'success');
    } else {
      const newMilestone = {
        ...formData,
        id: Date.now().toString(),
      };
      const updatedMilestones = [...milestones, newMilestone].sort((a, b) => 
        a.date.getTime() - b.date.getTime()
      );
      setMilestones(updatedMilestones);
      showToast('Milestone added successfully', 'success');
    }
    handleCloseDialog();
  };

  const handleDeleteMilestone = (id: string) => {
    const updatedMilestones = milestones.filter(m => m.id !== id);
    setMilestones(updatedMilestones);
    showToast('Milestone deleted', 'info');
  };

  const getIconForType = (type: string) => {
    const milestone = milestoneTypes.find(m => m.value === type);
    return milestone?.icon || <EventIcon />;
  };

  const generateStatutoryDeclaration = () => {
    const declaration = milestones.map(milestone => {
      const date = milestone.date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `On ${date}, ${milestone.description} ${milestone.location ? `in ${milestone.location}` : ''}.`;
    }).join('\n\n');

    // Copy to clipboard
    navigator.clipboard.writeText(declaration);
    showToast('Timeline copied to clipboard for statutory declaration', 'success');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <PageHeader
          title="Relationship Timeline"
          subtitle="Document important milestones in your relationship for your partner visa application"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Timeline' },
          ]}
        />
      </Box>

      <ContentCard
        title="Your Relationship Journey"
        icon={<HeartIcon color="error" />}
        elevation={2}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
            Document important milestones in your relationship for your partner visa application
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={generateStatutoryDeclaration}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Generate Declaration
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                background: (theme) => theme.palette.primary.main,
                '&:hover': {
                  background: (theme) => theme.palette.primary.dark,
                }
              }}
            >
              Add Milestone
            </Button>
          </Box>
        </Box>

        <Timeline position="alternate">
          {milestones.map((milestone, index) => (
            <Zoom in key={milestone.id} style={{ transitionDelay: `${index * 100}ms` }}>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot 
                    sx={{ 
                      background: (theme) => theme.palette.primary.main,
                      p: 1,
                    }}
                  >
                    {getIconForType(milestone.type)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => theme.shadows[3],
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        color: (theme) => theme.palette.primary.main,
                        mb: 1
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}
                    >
                      <EventIcon fontSize="small" />
                      {format(milestone.date, 'PPP')}
                    </Typography>
                    {milestone.location && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        📍 {milestone.location}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {milestone.description}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      justifyContent: 'flex-end',
                      opacity: 0.7,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        opacity: 1
                      }
                    }}>
                      <Tooltip title="Edit milestone">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(milestone)}
                          sx={{ 
                            color: (theme) => theme.palette.primary.main
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete milestone">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          sx={{ 
                            color: (theme) => theme.palette.error.main
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            </Zoom>
          ))}
        </Timeline>

        {milestones.length === 0 && (
          <Fade in>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Start Your Journey
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Begin documenting your relationship milestones by adding your first important moment
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Add First Milestone
              </Button>
            </Box>
          </Fade>
        )}
      </ContentCard>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          pb: 2
        }}>
          {editMode ? 'Edit Milestone' : 'Add New Milestone'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData({ ...formData, date: newValue });
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type of Milestone"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {milestoneTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                placeholder="Give your milestone a memorable title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Describe what happened during this milestone"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                placeholder="Where did this milestone take place? (optional)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMilestone} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              px: 3
            }}
          >
            {editMode ? 'Save Changes' : 'Add Milestone'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimelinePage; 