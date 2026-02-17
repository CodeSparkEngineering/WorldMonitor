import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './LandingPage';
import { Toaster } from 'sonner';
import '../styles/landing.css';
import { checkAuthentication } from '../services/auth-gate';

console.log('[Landing] Initializing landing page script...');

async function init() {
    // Check if user is already authenticated and redirect to app if subscribed
    await checkAuthentication();

    const rootEl = document.getElementById('landing-root');
    if (rootEl) {
        ReactDOM.createRoot(rootEl).render(
            <React.StrictMode>
                <Toaster position="top-center" theme="dark" richColors />
                <LandingPage />
            </React.StrictMode>
        );
    }
}

init();
