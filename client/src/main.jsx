import React, { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './i18n.js';
import './index.css'
import App from './App.jsx'
import { API_BASE_URL } from './config'

const Root = () => {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/google-client-id`)
      .then(res => res.json())
      .then(data => setClientId(data.clientId))
      .catch(err => console.error("Failed to fetch Google Client ID", err));
  }, []);

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);


