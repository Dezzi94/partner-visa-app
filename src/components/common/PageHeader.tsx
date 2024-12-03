import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  description,
  breadcrumbs, 
  actions 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => (
            crumb.path ? (
              <Link
                key={index}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
              fontWeight: 600,
              color: 'text.primary',
              mb: subtitle || description ? 1 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {actions}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader; 