import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, CardActions } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  icon?: SvgIconComponent;
  children?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: number;
  sx?: any;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
  footer,
  elevation = 1,
  sx = {},
  onClick,
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: (theme) => onClick ? theme.shadows[elevation + 2] : theme.shadows[elevation],
        },
        ...sx,
      }}
      onClick={onClick}
    >
      <CardHeader
        avatar={
          Icon && (
            <Box
              sx={{
                backgroundColor: 'grey.100',
                borderRadius: 1,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color: 'grey.700' }} />
            </Box>
          )
        }
        action={action && <IconButton>{action}</IconButton>}
        title={
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>{children}</CardContent>
      {footer && <CardActions>{footer}</CardActions>}
    </Card>
  );
};

export default ContentCard; 