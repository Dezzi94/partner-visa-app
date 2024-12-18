import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import FormsPage from './pages/FormsPage';
import TimelinePage from './pages/TimelinePage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import ResourcesPage from './pages/ResourcesPage';
import SummaryReportPage from './pages/SummaryReportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/summary" element={<SummaryReportPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 