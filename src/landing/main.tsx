import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './LandingPage';
import { Toaster } from 'sonner';
import '../styles/landing.css';
import { waitForAuth } from '../services/auth-gate';

console.log('[Landing] Initializing landing page script...');

async function init() {
    // Check if user is already authenticated and redirect to app
    const user = await waitForAuth();
    if (user) {
        // Check if we are forcing landing page for debug
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('force_landing') !== 'true') {
            window.location.href = '/';
            return;
        }
    }

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
