import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import { useToast } from '../components/common/Toast';

interface DocumentStatus {
  id: string;
  name: string;
  status: 'completed' | 'pending' | 'missing';
  uploadDate?: Date;
  category: 'document' | 'form';
}

interface TimelineEvent {
  date: Date;
  description: string;
  category: string;
}

const mockDocuments: DocumentStatus[] = [
  {
    id: '1',
    name: 'Passport Copy',
    status: 'completed',
    uploadDate: new Date(2024, 0, 15),
    category: 'document',
  },
  {
    id: '2',
    name: 'Police Check',
    status: 'completed',
    uploadDate: new Date(2024, 1, 1),
    category: 'document',
  },
  {
    id: '3',
    name: 'Form 47SP',
    status: 'completed',
    uploadDate: new Date(2024, 0, 20),
    category: 'form',
  },
];

const mockTimelineEvents: TimelineEvent[] = [
  {
    date: new Date(2023, 6, 15),
    description: 'First met in person',
    category: 'Relationship',
  },
  {
    date: new Date(2023, 8, 1),
    description: 'Started living together',
    category: 'Living Arrangements',
  },
];

const SummaryReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [incompleteItems, setIncompleteItems] = useState<string[]>([]);

  useEffect(() => {
    setDocuments(mockDocuments);
    setTimelineEvents(mockTimelineEvents);
  }, []);

  const validateReport = () => {
    const incomplete = documents
      .filter(doc => doc.status !== 'completed')
      .map(doc => doc.name);
    
    setIncompleteItems(incomplete);
    
    if (incomplete.length > 0) {
      showToast('Please complete all required items before generating the report.', 'warning');
      return false;
    }
    
    return true;
  };

  const handleGenerateReport = async () => {
    if (!validateReport()) {
      setShowConfirmDialog(true);
      return;
    }

    setIsGenerating(true);
    try {
      const reportElement = document.getElementById('summary-report');
      if (!reportElement) {
        throw new Error('Report element not found');
      }

      // Load the libraries dynamically only when needed
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add header
      pdf.setFontSize(18);
      pdf.text('Partner Visa Application Summary', pdfWidth / 2, 20, { align: 'center' });
      
      // Add the report content
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text(`Generated on ${format(new Date(), 'PPP')}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });

      pdf.save('partner-visa-summary.pdf');
      showToast('Report generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating report. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <WarningIcon color="warning" />;
      case 'missing':
        return <ErrorIcon color="error" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Application Summary Report"
        subtitle="Review and export your visa application summary"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          onClick={handleGenerateReport}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate PDF Report'}
        </Button>
      </Box>

      <div id="summary-report">
        {/* Documents and Forms Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Documents and Forms Checklist
          </Typography>
          <List>
            {documents.map((doc) => (
              <React.Fragment key={doc.id}>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(doc.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary={
                      doc.uploadDate
                        ? `Uploaded on ${format(doc.uploadDate, 'PPP')}`
                        : 'Not uploaded'
                    }
                  />
                  <Chip
                    label={doc.category}
                    size="small"
                    color={doc.status === 'completed' ? 'success' : 'default'}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Timeline Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Relationship Timeline
          </Typography>
          <List>
            {timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.description}
                    secondary={format(event.date, 'PPP')}
                  />
                  <Chip label={event.category} size="small" />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>

      {/* Warning Dialog for Incomplete Items */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Incomplete Items Detected</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            The following items are incomplete:
          </Alert>
          <List>
            {incompleteItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Go Back and Complete
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setShowConfirmDialog(false);
              handleGenerateReport();
            }}
          >
            Generate Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SummaryReportPage; 