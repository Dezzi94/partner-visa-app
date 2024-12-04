import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface ContentCardProps {
  title?: string;
  subtitle?: string;
  helpText?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  elevation?: number;
  noPadding?: boolean;
  sx?: SxProps<Theme>;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  helpText,
  icon,
  action,
  children,
  elevation = 1,
  noPadding = false,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...sx,
      }}
    >
      {title && (
        <CardHeader
          sx={{
            pb: subtitle ? 1 : 2,
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon && (
                <Box
                  sx={{
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {icon}
                </Box>
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </Typography>
              {helpText && (
                <Tooltip title={helpText} arrow placement="top">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          }
          subheader={
            subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {subtitle}
              </Typography>
            )
          }
          action={action}
        />
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          pt: title ? 0 : 2,
          pb: `${theme.spacing(2)} !important`,
          px: noPadding ? 0 : 2,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ContentCard; 