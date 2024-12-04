import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const showToast = (message: string, severity: AlertColor = 'success'): void => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: (theme) => theme.shadows[3],
            borderRadius: 2,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 