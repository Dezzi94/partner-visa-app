import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Fade,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as HeartIcon,
  Flight as TravelIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Description as DocumentIcon,
  FileCopy as CopyIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import PageHeader from '@/components/common/PageHeader';
import ContentCard from '@/components/common/ContentCard';
import { useToast } from '@/components/common/Toast';
import { useProgress } from '@/contexts/ProgressContext';

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
    const savedMilestones = localStorage.getItem(STORAGE_KEY);
    if (savedMilestones) {
      const parsedMilestones = JSON.parse(savedMilestones);
      return parsedMilestones.map((milestone: any) => ({
        ...milestone,
        date: new Date(milestone.date)
      }));
    }
    return [];
  });

  const { showToast } = useToast();
  const { updateTimelineProgress } = useProgress();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date(),
    type: 'firstMeet',
    title: '',
    description: '',
    location: '',
  });

  // Update progress whenever milestones change
  useEffect(() => {
    // Recommended number of milestones for a strong application
    const recommendedMilestones = 20;
    updateTimelineProgress(milestones.length, recommendedMilestones);
  }, [milestones, updateTimelineProgress]);

  // Save milestones to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
  }, [milestones]);

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
    <Box>
      <PageHeader
        title="Relationship Timeline"
        subtitle="Document important milestones in your relationship for your partner visa application"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Timeline' },
        ]}
      />

      <ContentCard
        title="Your Relationship Journey"
        icon={<HeartIcon color="error" />}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body1" color="text.secondary">
            Document important milestones in your relationship for your partner visa application
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={generateStatutoryDeclaration}
            >
              Generate Declaration
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Milestone
            </Button>
          </Box>
        </Box>

        {milestones.length === 0 ? (
          <Fade in>
            <Box 
              sx={{ 
                textAlign: 'center', 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Start Your Journey
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Begin documenting your relationship milestones by adding your first important moment
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add First Milestone
              </Button>
            </Box>
          </Fade>
        ) : (
          <Timeline position="alternate">
            {milestones.map((milestone, index) => (
              <Fade in key={milestone.id} style={{ transitionDelay: `${index * 100}ms` }}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
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
                      <Typography variant="h6" gutterBottom>
                        {milestone.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {format(milestone.date, 'PPP')}
                      </Typography>
                      {milestone.location && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          📍 {milestone.location}
                        </Typography>
                      )}
                      <Typography variant="body1" paragraph>
                        {milestone.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit milestone">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(milestone)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete milestone">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              </Fade>
            ))}
          </Timeline>
        )}
      </ContentCard>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Milestone' : 'Add New Milestone'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newDate) => setFormData({ ...formData, date: newDate || new Date() })}
                sx={{ width: '100%', mb: 2 }}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Type of Milestone"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{ mb: 2 }}
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

            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Location (optional)"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveMilestone}
            color="primary"
          >
            {editMode ? 'Save Changes' : 'Add Milestone'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimelinePage; 