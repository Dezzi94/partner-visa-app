import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';
import { useProgress } from '../contexts/ProgressContext';

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'error';
  errorMessage?: string;
  uploadDate?: Date;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport',
      description: 'Current passport photo page',
      required: true,
      status: 'pending',
    },
    {
      id: '2',
      name: 'Birth Certificate',
      description: 'Original or certified copy',
      required: true,
      status: 'pending',
    },
    {
      id: '3',
      name: 'Police Clearance',
      description: 'From all countries lived in',
      required: true,
      status: 'pending',
    },
    {
      id: '4',
      name: 'Photos Together',
      description: 'Photos showing relationship',
      required: false,
      status: 'pending',
    },
    {
      id: '5',
      name: 'Joint Bank Statements',
      description: 'Showing financial relationship',
      required: false,
      status: 'pending',
    },
  ]);

  const { showToast } = useToast();
  const { updateDocumentsProgress } = useProgress();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const requiredDocuments = documents.filter((doc) => doc.required);
  const optionalDocuments = documents.filter((doc) => !doc.required);

  useEffect(() => {
    const requiredUploaded = requiredDocuments.filter(doc => doc.status === 'uploaded').length;
    const optionalUploaded = optionalDocuments.filter(doc => doc.status === 'uploaded').length;
    updateDocumentsProgress(requiredUploaded, optionalUploaded);
  }, [documents, updateDocumentsProgress]);

  const handleUpload = async (doc: Document) => {
    // Simulated upload process
    setSelectedDocument(doc);
    setOpenDialog(true);
  };

  const handleConfirmUpload = () => {
    if (selectedDocument) {
      const updatedDocuments = documents.map((doc): Document =>
        doc.id === selectedDocument.id
          ? { ...doc, status: 'uploaded' as const, uploadDate: new Date() }
          : doc
      );
      setDocuments(updatedDocuments);
      showToast(`${selectedDocument.name} uploaded successfully`, 'success');
      handleCloseDialog();
    }
  };

  const handleDelete = (doc: Document) => {
    const updatedDocuments = documents.map((d): Document =>
      d.id === doc.id ? { ...d, status: 'pending' as const, uploadDate: undefined } : d
    );
    setDocuments(updatedDocuments);
    showToast(`${doc.name} removed`, 'info');
  };

  const calculateProgress = (docs: Document[]) => {
    if (docs.length === 0) return 0;
    const uploaded = docs.filter((doc) => doc.status === 'uploaded').length;
    return Math.round((uploaded / docs.length) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const DocumentList: React.FC<{ documents: Document[] }> = ({ documents }) => (
    <List>
      {documents.map((doc) => (
        <ListItem key={doc.id}>
          <ListItemIcon>{getStatusIcon(doc.status)}</ListItemIcon>
          <ListItemText
            primary={doc.name}
            secondary={
              <>
                {doc.description}
                {doc.uploadDate && (
                  <Typography variant="caption" display="block">
                    Uploaded: {doc.uploadDate.toLocaleDateString()}
                  </Typography>
                )}
              </>
            }
          />
          <ListItemSecondaryAction>
            {doc.status === 'uploaded' ? (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(doc)}
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              <IconButton
                edge="end"
                aria-label="upload"
                onClick={() => handleUpload(doc)}
              >
                <UploadIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Document Checklist"
        subtitle={`${documents.filter(d => d.status === 'uploaded').length} of ${documents.length} documents uploaded`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Documents' },
        ]}
      />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ContentCard
            title={`Required Documents (${
              requiredDocuments.filter((doc) => doc.status === 'uploaded').length
            } of ${requiredDocuments.length} uploaded)`}
            icon={<InfoIcon />}
          >
            <Box sx={{ mb: 3 }}>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(requiredDocuments)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <DocumentList documents={requiredDocuments} />
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard
            title={`Optional Documents (${
              optionalDocuments.filter((doc) => doc.status === 'uploaded').length
            } of ${optionalDocuments.length} uploaded)`}
            icon={<InfoIcon />}
          >
            <Box sx={{ mb: 3 }}>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(optionalDocuments)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <DocumentList documents={optionalDocuments} />
          </ContentCard>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Ready to upload {selectedDocument?.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please ensure your document meets the following requirements:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Clear, legible scan or photo" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="All pages included" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="File size under 10MB" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmUpload}
            startIcon={<UploadIcon />}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage; 