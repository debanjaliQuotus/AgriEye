// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
  api_host: 'https://app.posthog.com',
  autocapture: true,
  session_recording: {
    blockClass: 'ph-no-capture',
    blockSelector: null,
    ignoreClass: 'ph-ignore-input',
    maskTextClass: 'ph-mask',
    maskTextSelector: null,
    maskAllInputs: false,
    maskInputOptions: {},
  },
  loaded: (posthog) => {
    if (import.meta.env.DEV) posthog.debug();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);