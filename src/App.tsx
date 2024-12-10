import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import FormsPage from './pages/FormsPage';
import TimelinePage from './pages/TimelinePage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import ResourcesPage from './pages/ResourcesPage';
import SummaryPage from './pages/SummaryPage';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        {(theme) => (
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AuthProvider>
                <ProgressProvider>
                  <Router>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/register-success" element={<RegisterSuccessPage />} />
                      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/forms" element={<FormsPage />} />
                        <Route path="/timeline" element={<TimelinePage />} />
                        <Route path="/interview-prep" element={<InterviewPrepPage />} />
                        <Route path="/resources" element={<ResourcesPage />} />
                        <Route path="/summary" element={<SummaryPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                      </Route>
                    </Routes>
                  </Router>
                </ProgressProvider>
              </AuthProvider>
            </LocalizationProvider>
          </ThemeProvider>
        )}
      </CustomThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
