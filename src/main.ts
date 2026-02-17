import './styles/main.css';
import { App } from './App';
import { waitForAuth } from './services/auth-gate';


// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  let user = null;

  try {
    user = await waitForAuth();
  } catch (e) {
    console.error('Auth check failed', e);
  }

  if (!user) {
    // Redirect to Landing Page
    console.log('[Main] User not authenticated. Redirecting to landing.');
    window.location.href = '/landing.html';
  } else {
    // User is authenticated
    console.log('[Main] User authenticated. Initializing application.');

    // Initialize standard app
    try {
      // Initialize Main App
      const app = new App('app');
      await app.init();

      // Remove loading indicator if present
      const loading = document.getElementById('initial-loading');
      if (loading) {
        loading.remove();
      }
    } catch (e) {
      console.error('Failed to initialize application:', e);
    }
  }
});
