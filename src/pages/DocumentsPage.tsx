import React, { useState } from 'react';
import {
  Grid,
  LinearProgress,
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  helpText: string;
  sampleUrl?: string;
  file?: File;
  status: 'pending' | 'uploaded' | 'error';
  errorMessage?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const requiredDocuments: Document[] = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'Valid passport with at least 6 months validity',
    required: true,
    helpText: 'Ensure all pages are clear and readable. Include both current and expired passports if applicable.',
    status: 'pending',
  },
  {
    id: 'birthCertificate',
    name: 'Birth Certificate',
    description: 'Original or certified copy',
    required: true,
    helpText: 'Must be officially translated if not in English. Include both original and translation.',
    status: 'pending',
  },
  {
    id: 'policeCheck',
    name: 'Police Clearance',
    description: 'From all countries where you lived for 12+ months',
    required: true,
    helpText: 'Police certificates must cover your entire period of stay in each country.',
    status: 'pending',
  },
];

const optionalDocuments: Document[] = [
  {
    id: 'previousVisas',
    name: 'Previous Visas',
    description: 'Copies of previous visas if applicable',
    required: false,
    helpText: 'Include all previous Australian visas and significant visas from other countries.',
    status: 'pending',
  },
  {
    id: 'travelHistory',
    name: 'Travel History',
    description: 'Documentation of previous international travel',
    required: false,
    helpText: 'Include passport stamps, boarding passes, or travel itineraries showing your travel history.',
    status: 'pending',
  },
];

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([...requiredDocuments, ...optionalDocuments]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useToast();

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size exceeds 5MB limit' };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only PDF, JPG, and PNG files are allowed' };
    }
    return { isValid: true };
  };

  const handleFileUpload = (documentId: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? { ...doc, status: 'error', errorMessage: validation.error }
              : doc
          )
        );
        showToast(validation.error || 'Upload failed', 'error');
        return;
      }

      // Simulate file upload with a delay
      try {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? { ...doc, file, status: 'uploaded', errorMessage: undefined }
              : doc
          )
        );
        showToast('Document uploaded successfully', 'success');
      } catch (error) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? { ...doc, status: 'error', errorMessage: 'Upload failed' }
              : doc
          )
        );
        showToast('Failed to upload document', 'error');
      }
    }
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, file: undefined, status: 'pending', errorMessage: undefined }
          : doc
      )
    );
    showToast('Document removed', 'info');
  };

  const handleViewSample = (document: Document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const calculateProgress = (docs: Document[]) => {
    const uploadedCount = docs.filter((doc) => doc.status === 'uploaded').length;
    return (uploadedCount / docs.length) * 100;
  };

  const DocumentList: React.FC<{ documents: Document[] }> = ({ documents }) => (
    <Grid container spacing={3}>
      {documents.map((doc) => (
        <Grid item xs={12} key={doc.id}>
          <ContentCard
            title={doc.name}
            subtitle={doc.description}
            icon={<InfoIcon />}
            elevation={1}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {doc.description}
              </Typography>
              <Tooltip title={doc.helpText} arrow placement="top">
                <IconButton size="small" color="primary" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {doc.status === 'uploaded' ? (
                <>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon fontSize="small" />
                    {doc.file?.name}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    size="small"
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      accept={ALLOWED_TYPES.join(',')}
                      onChange={handleFileUpload(doc.id)}
                    />
                  </Button>
                  {doc.sampleUrl && (
                    <Button
                      startIcon={<ViewIcon />}
                      size="small"
                      onClick={() => handleViewSample(doc)}
                    >
                      View Sample
                    </Button>
                  )}
                </>
              )}
            </Box>
            {doc.status === 'error' && doc.errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {doc.errorMessage}
              </Alert>
            )}
          </ContentCard>
        </Grid>
      ))}
    </Grid>
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
        <DialogTitle>Sample Document</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Typography>
              Sample content for {selectedDocument.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage; 