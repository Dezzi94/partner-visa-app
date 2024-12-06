import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Description as FormIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';
import ContentCard from '@/components/common/ContentCard';
import { useToast } from '@/components/common/Toast';
import { useProgress } from '@/contexts/ProgressContext';

interface Form {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastUpdated?: Date;
  completionPercentage: number;
}

const FormsPage: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'Form 47SP',
      description: 'Application for migration to Australia by a partner',
      status: 'not_started',
      completionPercentage: 0,
    },
    {
      id: '2',
      name: 'Form 40SP',
      description: 'Sponsorship for a partner to migrate to Australia',
      status: 'not_started',
      completionPercentage: 0,
    },
    {
      id: '3',
      name: 'Form 80',
      description: 'Personal particulars for assessment',
      status: 'not_started',
      completionPercentage: 0,
    },
    {
      id: '4',
      name: 'Statutory Declaration',
      description: 'Relationship details declaration',
      status: 'not_started',
      completionPercentage: 0,
    },
  ]);

  const { showToast } = useToast();
  const { updateFormsProgress } = useProgress();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    const completedForms = forms.filter(form => form.status === 'completed').length;
    updateFormsProgress(completedForms, forms.length);
  }, [forms, updateFormsProgress]);

  const handleStartForm = (form: Form) => {
    setSelectedForm(form);
    setOpenDialog(true);
  };

  const handleCompleteForm = () => {
    if (selectedForm) {
      const updatedForms = forms.map((form): Form =>
        form.id === selectedForm.id
          ? { ...form, status: 'completed' as const, completionPercentage: 100, lastUpdated: new Date() }
          : form
      );
      setForms(updatedForms);
      showToast(`${selectedForm.name} completed successfully`, 'success');
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedForm(null);
  };

  const getStatusIcon = (status: Form['status']) => {
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" />;
      case 'in_progress':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const calculateOverallProgress = () => {
    const totalPercentage = forms.reduce((sum, form) => sum + form.completionPercentage, 0);
    return Math.round(totalPercentage / forms.length);
  };

  return (
    <Box>
      <PageHeader
        title="Visa Application Forms"
        subtitle="Complete all required forms for your partner visa application"
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ContentCard
            title="Overall Forms Progress"
            icon={<FormIcon />}
          >
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={calculateOverallProgress()}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {calculateOverallProgress()}% Complete
              </Typography>
            </Box>

            <List sx={{ '& .MuiListItem-root': { px: 2 } }}>
              {forms.map((form) => (
                <ListItem key={form.id}>
                  <ListItemIcon>
                    {getStatusIcon(form.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={form.name}
                    secondary={
                      <>
                        {form.description}
                        {form.lastUpdated && (
                          <Typography variant="caption" display="block">
                            Last updated: {form.lastUpdated.toLocaleDateString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleStartForm(form)}
                      disabled={form.status === 'completed'}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedForm?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This is a placeholder for the form content. In the actual application, this would be replaced with the real form interface.
          </Alert>
          <Typography variant="body1">
            {selectedForm?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCompleteForm}
            color="primary"
          >
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormsPage; 