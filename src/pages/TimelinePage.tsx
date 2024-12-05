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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
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

  const milestoneTypes = [
    { value: 'firstMeet', label: 'First Meeting' },
    { value: 'travel', label: 'Travel Together' },
    { value: 'moveIn', label: 'Move In Together' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'document', label: 'Document Submission' },
    { value: 'other', label: 'Other Event' },
  ];

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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      pb: 4
    }}>
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
        icon={<FavoriteIcon color="error" />}
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
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

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {milestones.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                m: 2
              }}
            >
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
          ) : (
            <Box sx={{ 
              position: 'relative',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '100%',
                bgcolor: 'rgba(144, 202, 249, 0.5)',
                zIndex: 0
              }
            }}>
              {milestones.map((milestone, index) => (
                <Box
                  key={milestone.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    position: 'relative',
                    mb: 3,
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FavoriteIcon sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '45%',
                      ml: index % 2 === 0 ? 0 : 'auto',
                      mr: index % 2 === 0 ? 'auto' : 0,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                      borderRadius: 2,
                      p: 3,
                      position: 'relative',
                      boxShadow: 1
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          {milestone.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(milestone.date, 'MMMM do, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex',
                        gap: 0.5
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(milestone)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { color: '#90caf9' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { color: '#f44336' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {milestone.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📍 {milestone.location}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
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
                  {type.label}
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