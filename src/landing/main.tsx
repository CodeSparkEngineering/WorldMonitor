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

init().catch(error => {
    console.error('[Landing] Failed to initialize:', error);
    const rootEl = document.getElementById('landing-root');
    if (rootEl) {
        rootEl.innerHTML = `
            <div style="padding: 20px; color: #ff5f57; background: #1a1a1a; font-family: sans-serif; height: 100vh;">
                <h1>Build Error or Missing Configuration</h1>
                <p>${error.message}</p>
                <p style="color: #888;">Note: Check if your environment variables (VITE_FIREBASE_*) are set in Vercel.</p>
            </div>
        `;
    }
});
