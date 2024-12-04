import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs }) => {
  return (
    <Stack spacing={1}>
      {breadcrumbs && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            crumb.path ? (
              <Link
                key={index}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                underline="hover"
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
      
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default PageHeader; 