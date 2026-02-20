import './styles/main.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as Sentry from '@sentry/browser';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { App } from './App';
import { waitForAuth, checkAuthentication } from './services/auth-gate';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN?.trim();

// Initialize Sentry error tracking (early as possible)
Sentry.init({
  dsn: sentryDsn || undefined,
  release: `worldmonitor@${__APP_VERSION__}`,
  environment: location.hostname === 'geonexus.live' ? 'production'
    : location.hostname.includes('vercel.app') ? 'preview'
      : 'development',
  enabled: Boolean(sentryDsn) && !location.hostname.startsWith('localhost') && !('__TAURI_INTERNALS__' in window),
  sendDefaultPii: true,
  tracesSampleRate: 0.1,
  ignoreErrors: [
    'Invalid WebGL2RenderingContext',
    'WebGL context lost',
    /reading 'imageManager'/,
    /ResizeObserver loop/,
    /NotAllowedError/,
    /InvalidAccessError/,
    /importScripts/,
    /^TypeError: Load failed$/,
    /^TypeError: Failed to fetch( \(.*\))?$/,
    /^TypeError: cancelled$/,
    /^TypeError: NetworkError/,
    /runtime\.sendMessage\(\)/,
    /Java object is gone/,
    /^Object captured as promise rejection with keys:/,
    /Unable to load image/,
    /Non-Error promise rejection captured with value:/,
    /Connection to Indexed Database server lost/,
    /webkit\.messageHandlers/,
    /unsafe-eval.*Content Security Policy/,
    /Fullscreen request denied/,
    /requestFullscreen/,
    /vc_text_indicators_context/,
    /Program failed to link: null/,
    /too much recursion/,
    /zaloJSV2/,
    /Java bridge method invocation error/,
    /Could not compile fragment shader/,
    /can't redefine non-configurable property/,
    /Can.t find variable: (CONFIG|currentInset)/,
    /invalid origin/,
    /\.data\.split is not a function/,
    /signal is aborted without reason/,
    /Failed to fetch dynamically imported module/,
    /Importing a module script failed/,
  ],
  beforeSend(event: Sentry.ErrorEvent) {
    const msg = event.exception?.values?.[0]?.value ?? '';
    if (msg.length <= 3 && /^[a-zA-Z_$]+$/.test(msg)) return null;
    const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
    // Suppress maplibre internal null-access crashes (light, placement) only when stack is in map chunk
    if (/this\.style\._layers|reading '_layers'|this\.light is null|can't access property "(type|setFilter)", \w+ is (null|undefined)|Cannot read properties of null \(reading '(id|type|setFilter|_layers)'\)|null is not an object \(evaluating '(E\.|this\.style)/.test(msg)) {
      if (frames.some((f: any) => /\/map-[A-Za-z0-9]+\.js/.test(f.filename ?? ''))) return null;
    }
    return event;
  },
});
// Suppress NotAllowedError from YouTube IFrame API's internal play() — browser autoplay policy,
// not actionable. The YT IFrame API doesn't expose the play() promise so it leaks as unhandled.
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.name === 'NotAllowedError') e.preventDefault();
});

import { applyStoredTheme } from '@/utils/theme-manager';
import { clearChunkReloadGuard, installChunkReloadGuard } from '@/bootstrap/chunk-reload';

// Auto-reload on stale chunk 404s after deployment (Vite fires this for modulepreload failures).
const chunkReloadStorageKey = installChunkReloadGuard(__APP_VERSION__);


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

      // Apply stored theme preference before app initialization (safety net for inline script)
      applyStoredTheme();

      // Remove no-transition class after first paint to enable smooth theme transitions
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
      });

      // Initialize Main App
      const app = new App('app');
      await app.init();

      // Clear the one-shot guard after a successful boot so future stale-chunk incidents can recover.
      clearChunkReloadGuard(chunkReloadStorageKey);

      // Inject Vercel Analytics and Speed Insights if in production
      if (location.hostname === 'geonexus.live') {
        inject();
        injectSpeedInsights();
      }
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

// Beta mode toggle: type `beta=true` / `beta=false` in console
Object.defineProperty(window, 'beta', {
  get() {
    const on = localStorage.getItem('worldmonitor-beta-mode') === 'true';
    console.log(`[Beta] ${on ? 'ON' : 'OFF'}`);
    return on;
  },
  set(v: boolean) {
    if (v) localStorage.setItem('worldmonitor-beta-mode', 'true');
    else localStorage.removeItem('worldmonitor-beta-mode');
    location.reload();
  },
});

// Suppress native WKWebView context menu in Tauri — allows custom JS context menus
if ('__TAURI_INTERNALS__' in window || '__TAURI__' in window) {
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    // Allow native menu on text inputs/textareas for copy/paste
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    e.preventDefault();
  });
}

if (!('__TAURI_INTERNALS__' in window) && !('__TAURI__' in window)) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onRegisteredSW(_swUrl, registration) {
        if (registration) {
          setInterval(async () => {
            if (!navigator.onLine) return;
            try { await registration.update(); } catch { }
          }, 60 * 60 * 1000);
        }
      },
      onOfflineReady() {
        console.log('[PWA] App ready for offline use');
      },
    });
  });
}
