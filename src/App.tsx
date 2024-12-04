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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ProgressProvider>
              <ToastProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
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
