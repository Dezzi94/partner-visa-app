import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './App';
import './index.css';
import { app } from '@/config/firebase'; // Import Firebase app instance

// Ensure Firebase is initialized
console.log('Firebase app initialized:', app.name);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
