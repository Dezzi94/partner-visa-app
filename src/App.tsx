import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { ProgressProvider } from './contexts/ProgressContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import FormsPage from './pages/FormsPage';
import TimelinePage from './pages/TimelinePage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import ResourcesPage from './pages/ResourcesPage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import ErrorBoundary from './components/ErrorBoundary';
import { app } from './config/firebase';

// Ensure Firebase is initialized before rendering the app
console.log('Firebase app name:', app.name);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ToastProvider>
            <AuthProvider>
              <ProgressProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register-success" element={<RegisterSuccessPage />} />
                    <Route element={<Layout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/documents" element={<DocumentsPage />} />
                      <Route path="/forms" element={<FormsPage />} />
                      <Route path="/timeline" element={<TimelinePage />} />
                      <Route path="/interview-prep" element={<InterviewPrepPage />} />
                      <Route path="/resources" element={<ResourcesPage />} />
                      <Route path="/summary" element={<SummaryPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ProgressProvider>
            </AuthProvider>
          </ToastProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
