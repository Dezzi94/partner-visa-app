import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, breadcrumbs }) => {
  return (
    <Stack spacing={1}>
      <Box>
        {breadcrumbs && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                  {index > 0 && ' / '}
                  {crumb.path ? (
                    <Link
                      component={RouterLink}
                      to={crumb.path}
                      color="inherit"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    crumb.label
                  )}
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        )}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {icon}
          <Typography variant="h4">
            {title}
          </Typography>
        </Stack>
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