import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { Document } from '@/types/supabase';
import { getUserDocuments, uploadDocument, deleteDocument } from '@/services/documentService';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  document?: Document;
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'Current passport photo page',
    required: true,
  },
  {
    id: 'birth_certificate',
    name: 'Birth Certificate',
    description: 'Original or certified copy',
    required: true,
  },
  {
    id: 'police_clearance',
    name: 'Police Clearance',
    description: 'From all countries lived in',
    required: true,
  },
  {
    id: 'photos',
    name: 'Photos Together',
    description: 'Photos showing relationship',
    required: false,
  },
  {
    id: 'bank_statements',
    name: 'Joint Bank Statements',
    description: 'Showing financial relationship',
    required: false,
  },
];

const DocumentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadDocuments();
    }
  }, [isAuthenticated, user]);

  const loadDocuments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const docs = await getUserDocuments(user.id);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !selectedDocType) return;

    try {
      setLoading(true);
      setError(null);
      const newDoc = await uploadDocument(user.id, selectedFile, selectedDocType.name);
      setDocuments(prev => [newDoc, ...prev]);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedDocType(null);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDocument(document);
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    } finally {
      setLoading(false);
    }
  };

  const openUploadDialog = (docType: DocumentType) => {
    setSelectedDocType(docType);
    setUploadDialogOpen(true);
  };

  const getDocumentForType = (docType: DocumentType) => {
    return documents.find(doc => doc.document_name === docType.name);
  };

  const requiredDocs = DOCUMENT_TYPES.filter(doc => doc.required);
  const optionalDocs = DOCUMENT_TYPES.filter(doc => !doc.required);
  const uploadedRequiredCount = requiredDocs.filter(doc => getDocumentForType(doc)).length;
  const uploadedOptionalCount = optionalDocs.filter(doc => getDocumentForType(doc)).length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: 'text.secondary', mb: 2 }}>
        Document Checklist
      </Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        {documents.length} of {DOCUMENT_TYPES.length} documents uploaded
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            bgcolor: '#c62828',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {/* Required Documents Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InfoIcon sx={{ mr: 1, color: '#3ea6ff' }} />
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Required Documents ({uploadedRequiredCount} of {requiredDocs.length} uploaded)
                </Typography>
              </Box>

              {requiredDocs.map((docType) => {
                const doc = getDocumentForType(docType);
                return (
                  <Box
                    key={docType.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: '#1e1e1e',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <WarningIcon sx={{ mr: 1, color: '#f4b400', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                            {docType.name} {docType.required && '*'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {docType.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => openUploadDialog(docType)}
                        disabled={loading}
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          bgcolor: '#3ea6ff',
                          '&:hover': {
                            bgcolor: '#3ea6ff',
                            opacity: 0.9,
                          },
                        }}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>

          {/* Optional Documents Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InfoIcon sx={{ mr: 1, color: '#3ea6ff' }} />
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Optional Documents ({uploadedOptionalCount} of {optionalDocs.length} uploaded)
                </Typography>
              </Box>

              {optionalDocs.map((docType) => {
                const doc = getDocumentForType(docType);
                return (
                  <Box
                    key={docType.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: '#1e1e1e',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <WarningIcon sx={{ mr: 1, color: '#f4b400', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                            {docType.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {docType.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => openUploadDialog(docType)}
                        disabled={loading}
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          bgcolor: '#3ea6ff',
                          '&:hover': {
                            bgcolor: '#3ea6ff',
                            opacity: 0.9,
                          },
                        }}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e1e1e',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Upload {selectedDocType?.name}
          <IconButton
            onClick={() => setUploadDialogOpen(false)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please select a file to upload:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <input
              accept="application/pdf,image/*"
              style={{ display: 'none' }}
              id="document-file"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="document-file">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  borderColor: '#3ea6ff',
                  color: '#3ea6ff',
                  '&:hover': {
                    borderColor: '#3ea6ff',
                    opacity: 0.9,
                  },
                }}
              >
                Choose File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Please ensure your document meets the following requirements:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Clear, legible scan or photo</Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>All pages included</Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>File size under 10MB</Typography>
            </li>
          </ul>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setUploadDialogOpen(false)} 
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
            startIcon={<CloudUploadIcon />}
            sx={{ 
              bgcolor: '#3ea6ff',
              '&:hover': {
                bgcolor: '#3ea6ff',
                opacity: 0.9,
              },
              '&:disabled': {
                bgcolor: 'rgba(62, 166, 255, 0.3)',
              },
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage; 