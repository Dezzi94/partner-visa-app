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
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
  { value: 'firstMeet', label: 'First Meeting', icon: HeartIcon },
  { value: 'travel', label: 'Travel Together', icon: TravelIcon },
  { value: 'moveIn', label: 'Moving In', icon: HomeIcon },
  { value: 'event', label: 'Special Event', icon: EventIcon },
  { value: 'document', label: 'Important Document', icon: DocumentIcon },
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
    return milestone?.icon || EventIcon;
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
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Timeline' },
        ]}
      />

      <ContentCard
        title="Your Relationship Journey"
        subtitle="Document important milestones in your relationship for your partner visa application"
        icon={HeartIcon}
      >
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mr: 2 }}
          >
            Add Milestone
          </Button>
          <Button
            variant="outlined"
            startIcon={<DocumentIcon />}
            onClick={generateStatutoryDeclaration}
          >
            Generate Declaration Text
          </Button>
        </Box>

        <Timeline position="alternate">
          {milestones.map((milestone) => {
            const Icon = getIconForType(milestone.type);
            return (
              <TimelineItem key={milestone.id}>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <Icon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="span">
                      {milestone.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {milestone.date.toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                    <Typography>{milestone.description}</Typography>
                    {milestone.location && (
                      <Typography color="text.secondary" variant="body2">
                        Location: {milestone.location}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(milestone)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMilestone(milestone.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>

        {milestones.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Start building your relationship timeline by adding important milestones
          </Typography>
        )}
      </ContentCard>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {milestoneTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location (optional)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveMilestone} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimelinePage; 