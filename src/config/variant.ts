export const SITE_VARIANT: string = (() => {
  // 1. Check localStorage override
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'tech' || stored === 'full' || stored === 'finance') return stored;
  }

  // 2. Auto-detect from hostname (subdomain)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'tech.geonexus.live' || (host.startsWith('tech.') && !host.endsWith('.live'))) return 'tech';
    if (host === 'finance.geonexus.live' || (host.startsWith('finance.') && !host.endsWith('.live'))) return 'finance';
    if (host === 'app.geonexus.live') return 'full';
  }

  // 3. Fall back to build-time env var
  return import.meta.env.VITE_VARIANT || 'full';
})();
