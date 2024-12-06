import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';
import ContentCard from '@/components/common/ContentCard';
import DocumentUpload from '@/components/documents/DocumentUpload';
import { useProgress } from '@/contexts/ProgressContext';

const DocumentsPage: React.FC = () => {
  const { updateDocumentsProgress } = useProgress();
  const [uploadedCount, setUploadedCount] = useState({ required: 0, optional: 0 });

  const requiredDocuments = [
    {
      title: 'Passport',
      description: 'Current passport photo page',
      type: 'passport',
    },
    {
      title: 'Birth Certificate',
      description: 'Original or certified copy',
      type: 'birth_certificate',
    },
    {
      title: 'Police Clearance',
      description: 'From all countries lived in',
      type: 'police_clearance',
    },
  ];

  const optionalDocuments = [
    {
      title: 'Photos Together',
      description: 'Photos showing relationship',
      type: 'photos',
    },
    {
      title: 'Joint Bank Statements',
      description: 'Showing financial relationship',
      type: 'bank_statements',
    },
  ];

  const handleUploadComplete = (isRequired: boolean) => {
    setUploadedCount(prev => ({
      required: isRequired ? prev.required + 1 : prev.required,
      optional: !isRequired ? prev.optional + 1 : prev.optional,
    }));
  };

  useEffect(() => {
    updateDocumentsProgress(uploadedCount.required, uploadedCount.optional);
  }, [uploadedCount, updateDocumentsProgress]);

  return (
    <Box>
      <PageHeader
        title="Document Checklist"
        subtitle={`${uploadedCount.required + uploadedCount.optional} of ${requiredDocuments.length + optionalDocuments.length} documents uploaded`}
      />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ContentCard
            title={`Required Documents (${uploadedCount.required} of ${requiredDocuments.length} uploaded)`}
            icon={<InfoIcon />}
          >
            <Box>
              {requiredDocuments.map((doc) => (
                <Box key={doc.type} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                  <DocumentUpload
                    title={doc.title}
                    description={doc.description}
                    type={doc.type}
                    required
                    onUploadComplete={() => handleUploadComplete(true)}
                  />
                </Box>
              ))}
            </Box>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard
            title={`Optional Documents (${uploadedCount.optional} of ${optionalDocuments.length} uploaded)`}
            icon={<InfoIcon />}
          >
            <Box>
              {optionalDocuments.map((doc) => (
                <Box key={doc.type} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                  <DocumentUpload
                    title={doc.title}
                    description={doc.description}
                    type={doc.type}
                    onUploadComplete={() => handleUploadComplete(false)}
                  />
                </Box>
              ))}
            </Box>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentsPage; 