import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import ErrorBoundary from './components/ErrorBoundary';
import { disconnectPort, isChromeExtension } from './utils/helpers';
import type { ChromePort } from './types/chrome';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    let messagePorts: ChromePort[] = [];

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        messagePorts.forEach(disconnectPort);
        messagePorts = [];
        window.__messagePorts = messagePorts;
        window.location.reload();
      }
    };

    const handleBeforeUnload = () => {
      if (isChromeExtension()) {
        messagePorts.forEach(disconnectPort);
        messagePorts = [];
        window.__messagePorts = messagePorts;
      }
    };

    if (isChromeExtension() && window.chrome?.runtime) {
      const port = window.chrome.runtime.connect({ name: 'partner-visa-app' });
      port.onDisconnect.addListener(() => {
        const index = messagePorts.indexOf(port);
        if (index > -1) {
          messagePorts.splice(index, 1);
          window.__messagePorts = messagePorts;
        }
      });
      messagePorts.push(port);
      window.__messagePorts = messagePorts;
    }

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ProgressProvider>
              <ToastProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<HomePage />} />
                      <Route path="documents" element={<DocumentsPage />} />
                      <Route path="forms" element={<FormsPage />} />
                      <Route path="timeline" element={<TimelinePage />} />
                      <Route path="interview-prep" element={<InterviewPrepPage />} />
                      <Route path="resources" element={<ResourcesPage />} />
                      <Route path="summary" element={<SummaryPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ToastProvider>
            </ProgressProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
