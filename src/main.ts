import './styles/main.css';
import { App } from './App';
import { waitForAuth, checkAuthentication } from './services/auth-gate';


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
    window.location.href = '/';
  } else {
    // User is authenticated, but must also check subscription
    try {
      const active = await checkAuthentication();
      if (!active) return; // checkAuthentication handled redirect

      console.log('[Main] Subscription verified. Initializing application.');

      // Initialize Main App
      const app = new App('app');
      await app.init();
    } catch (e) {
      console.error('Failed to initialize application:', e);
      // Ensure user isn't stuck on loading if something fails
      const loading = document.getElementById('initial-loading');
      if (loading) loading.innerHTML = '<div style="color:red;font-family:mono;padding:20px">INITIALIZATION ERROR. CHECK CONSOLE.</div>';
    } finally {
      // Always remove loading indicator if it exists
      const loading = document.getElementById('initial-loading');
      if (loading) {
        loading.remove();
      }
    }
  }
});
