import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import ToastProvider from './components/common/Toast';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeProvider>
            <CssBaseline />
            <AuthProvider>
              <NotificationProvider>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
