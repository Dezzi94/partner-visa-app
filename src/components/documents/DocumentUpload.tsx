import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Input,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Warning as WarningIcon,
  AttachFile as AttachIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useToast } from '../common/Toast';

interface DocumentUploadProps {
  title: string;
  description: string;
  type: string;
  required?: boolean;
  onUploadComplete: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  description,
  type,
  required = false,
  onUploadComplete,
}) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!uploading) {
      setOpen(false);
      setFile(null);
      setProgress(0);
      setPreviewUrl(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        event.target.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);

      // Create preview URL for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const simulateUpload = async (): Promise<boolean> => {
    setUploading(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    setUploading(false);
    setUploaded(true);
    onUploadComplete();
    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    try {
      const success = await simulateUpload();
      if (success) {
        showToast(`${title} uploaded successfully`, 'success');
        handleClose();
      }
    } catch (error) {
      setUploading(false);
      showToast('Upload failed. Please try again.', 'error');
    }
  };

  const handleDelete = () => {
    setFile(null);
    setUploaded(false);
    setPreviewUrl(null);
    showToast(`${title} removed`, 'info');
  };

  return (
    <>
      <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <WarningIcon color={required ? 'warning' : 'action'} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div">
                {title}
                {required && (
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
            {uploaded ? (
              <Stack direction="row" spacing={1}>
                {previewUrl && (
                  <IconButton size="small" onClick={() => setOpen(true)} color="primary">
                    <ViewIcon />
                  </IconButton>
                )}
                <IconButton size="small" onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                startIcon={<UploadIcon />}
              >
                Upload
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            if (!uploading) handleClose();
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Upload {title}
            </Typography>
            {!uploading && (
              <IconButton
                onClick={handleClose}
                size="small"
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" gutterBottom>
                Please select a file to upload:
              </Typography>
              <Input
                type="file"
                onChange={handleFileSelect}
                sx={{ display: 'none' }}
                inputProps={{
                  accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx'
                }}
                id={`file-input-${type}`}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  htmlFor={`file-input-${type}`}
                  startIcon={<AttachIcon />}
                  disabled={uploading}
                >
                  Choose File
                </Button>
                {file && (
                  <Typography variant="body2" color="primary">
                    {file.name}
                  </Typography>
                )}
              </Stack>
            </Box>

            {uploading && (
              <Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Uploading... {progress}%
                </Typography>
              </Box>
            )}

            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={previewUrl} 
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }} 
                />
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Please ensure your document meets the following requirements:
              </Typography>
              <Stack component="ul" spacing={1} sx={{ pl: 2, mb: 0 }}>
                <Typography component="li" variant="body2">
                  Clear, legible scan or photo
                </Typography>
                <Typography component="li" variant="body2">
                  All pages included
                </Typography>
                <Typography component="li" variant="body2">
                  File size under 10MB
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || uploading}
            startIcon={<UploadIcon />}
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentUpload; 