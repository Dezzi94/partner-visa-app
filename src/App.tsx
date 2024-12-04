import { useEffect } from 'react';
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
import ErrorBoundary from './components/ErrorBoundary';
import { disconnectPort, isChromeExtension } from './utils/helpers';
import type { ChromePort } from './types/chrome';

function App() {
  useEffect(() => {
    let messagePorts: ChromePort[] = [];

    // Handle page show event for bfcache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache, reconnect message ports
        messagePorts.forEach(disconnectPort);
        messagePorts = [];
        window.__messagePorts = messagePorts;

        // Reload the page to ensure clean state
        window.location.reload();
      }
    };

    // Handle before unload to clean up message ports
    const handleBeforeUnload = () => {
      if (isChromeExtension()) {
        messagePorts.forEach(disconnectPort);
        messagePorts = [];
        window.__messagePorts = messagePorts;
      }
    };

    // Initialize message port tracking
    if (isChromeExtension() && window.chrome?.runtime) {
      // Create a new port for this session
      const port = window.chrome.runtime.connect({ name: 'partner-visa-app' });
      
      // Add disconnect listener
      port.onDisconnect.addListener(() => {
        const index = messagePorts.indexOf(port);
        if (index > -1) {
          messagePorts.splice(index, 1);
          window.__messagePorts = messagePorts;
        }
      });

      // Store the port
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
                    <Route element={<Layout />}>
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
