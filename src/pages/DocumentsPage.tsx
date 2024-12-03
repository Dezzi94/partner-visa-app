import React, { useState } from 'react';
import {
  Grid,
  LinearProgress,
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { useToast } from '../components/common/Toast';

interface Document {
  id: string;
  name: string;
  required: boolean;
  description: string;
  file?: File;
  status: 'pending' | 'uploaded' | 'verified';
}

const requiredDocuments: Document[] = [
  {
    id: '1',
    name: 'Passport',
    required: true,
    description: 'Valid passport with at least 6 months validity',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Birth Certificate',
    required: true,
    description: 'Original or certified copy',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Police Clearance',
    required: true,
    description: 'From all countries where you lived for 12+ months',
    status: 'pending',
  },
];

const optionalDocuments: Document[] = [
  {
    id: '4',
    name: 'Previous Visas',
    required: false,
    description: 'Copies of previous visas if applicable',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Travel History',
    required: false,
    description: 'Documentation of previous international travel',
    status: 'pending',
  },
];

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    ...requiredDocuments,
    ...optionalDocuments,
  ]);
  const { showToast } = useToast();

  const handleFileUpload = (documentId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, file, status: 'uploaded' }
            : doc
        )
      );
      showToast(`${file.name} uploaded successfully`, 'success');
    }
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, file: undefined, status: 'pending' }
          : doc
      )
    );
    showToast('Document removed', 'info');
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
            icon={doc.status === 'uploaded' ? CheckIcon : UploadIcon}
            elevation={1}
          >
            <Box sx={{ mt: 2 }}>
              {doc.file ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {doc.file.name}
                  </Typography>
                  <Tooltip title="View Document">
                    <IconButton size="small" color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  size="small"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload(doc.id)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </Button>
              )}
            </Box>
          </ContentCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <PageHeader
        title="Document Checklist"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Documents' },
        ]}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ContentCard
            title="Required Documents"
            subtitle={`${
              requiredDocuments.filter((doc) => doc.status === 'uploaded').length
            } of ${requiredDocuments.length} uploaded`}
            icon={InfoIcon}
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
            title="Optional Documents"
            subtitle={`${
              optionalDocuments.filter((doc) => doc.status === 'uploaded').length
            } of ${optionalDocuments.length} uploaded`}
            icon={InfoIcon}
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
    </Box>
  );
};

export default DocumentsPage; 