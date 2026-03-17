import { isFeatureAvailable, type RuntimeFeatureId } from './runtime-config';

export type LocalityClass = 'fully-local' | 'api-key' | 'cloud-fallback';

export interface DesktopParityFeature {
  id: string;
  panel: string;
  serviceFiles: string[];
  apiRoutes: string[];
  apiHandlers: string[];
  locality: LocalityClass;
  fallback: string;
  priority: 1 | 2 | 3;
}

export interface DesktopReadinessCheck {
  id: string;
  label: string;
  ready: boolean;
}

const keyBackedFeatures: RuntimeFeatureId[] = [
  'aiGroq',
  'aiOpenRouter',
  'economicFred',
  'internetOutages',
  'acledConflicts',
  'abuseChThreatIntel',
  'alienvaultOtxThreatIntel',
  'abuseIpdbThreatIntel',
  'aisRelay',
  'openskyRelay',
  'wingbitsEnrichment',
  'energyEia',
];

export const DESKTOP_PARITY_FEATURES: DesktopParityFeature[] = [
  {
    id: 'live-news',
    panel: 'LiveNewsPanel',
    serviceFiles: ['src/services/live-news.ts'],
    apiRoutes: ['/api/youtube/live'],
    apiHandlers: ['api/youtube/live.js'],
    locality: 'fully-local',
    fallback: 'Channel fallback video IDs are used when live detection fails.',
    priority: 1,
  },
  {
    id: 'monitor',
    panel: 'MonitorPanel',
    serviceFiles: [],
    apiRoutes: [],
    apiHandlers: [],
    locality: 'fully-local',
    fallback: 'Keyword monitoring runs fully client-side on loaded news corpus.',
    priority: 1,
  },
  {
    id: 'strategic-risk',
    panel: 'StrategicRiskPanel',
    serviceFiles: ['src/services/cached-risk-scores.ts'],
    apiRoutes: ['/api/risk-scores'],
    apiHandlers: ['api/risk-scores.js'],
    locality: 'api-key',
    fallback: 'Panel stays available with local aggregate scoring when cached backend scores are unavailable.',
    priority: 1,
  },
  {
    id: 'cyber-panel',
    panel: 'CyberPanel',
    serviceFiles: ['src/services/cyber-threats.ts'],
    apiRoutes: ['/api/cyber-threats'],
    apiHandlers: ['api/cyber-threats.js'],
    locality: 'api-key',
    fallback: 'Cyber threat intel degrades to local heuristics when provider keys are missing.',
    priority: 1,
  },
  {
    id: 'map-layers-core',
    panel: 'Map layers (conflicts/outages/ais/flights)',
    serviceFiles: ['src/services/conflicts.ts', 'src/services/outages.ts', 'src/services/ais.ts', 'src/services/military-flights.ts'],
    apiRoutes: ['/api/acled-conflict', '/api/cloudflare-outages', '/api/ais-snapshot', '/api/opensky'],
    apiHandlers: ['api/acled-conflict.js', 'api/cloudflare-outages.js', 'api/ais-snapshot.js', 'api/opensky.js'],
    locality: 'api-key',
    fallback: 'Unavailable feeds are disabled while map rendering remains active for local/static layers.',
    priority: 1,
  },
  {
    id: 'summaries',
    panel: 'Summaries',
    serviceFiles: ['src/services/summarization.ts'],
    apiRoutes: ['/api/groq-summarize', '/api/openrouter-summarize'],
    apiHandlers: ['api/groq-summarize.js', 'api/openrouter-summarize.js'],
    locality: 'api-key',
    fallback: 'Browser summarizer executes when hosted LLM providers are unavailable.',
    priority: 2,
  },
  {
    id: 'market-panel',
    panel: 'MarketPanel',
    serviceFiles: ['src/services/markets.ts', 'src/services/polymarket.ts'],
    apiRoutes: ['/api/coingecko', '/api/polymarket', '/api/finnhub', '/api/yahoo-finance'],
    apiHandlers: ['api/coingecko.js', 'api/polymarket.js', 'api/finnhub.js', 'api/yahoo-finance.js'],
    locality: 'fully-local',
    fallback: 'Multi-source market fetchers degrade to remaining providers and cached values.',
    priority: 2,
  },
  {
    id: 'environment-intel',
    panel: 'Environment (Fires/Quakes/Climate)',
    serviceFiles: ['src/services/firms-satellite.ts', 'src/services/earthquakes.ts', 'src/services/climate.ts'],
    apiRoutes: ['/api/firms-fires', '/api/earthquakes', '/api/climate-anomalies'],
    apiHandlers: ['api/firms-fires.js', 'api/earthquakes.js', 'api/climate-anomalies.js'],
    locality: 'fully-local',
    fallback: 'Environmental layers fall back to local disaster datasets when real-time feeds fail.',
    priority: 2,
  },
  {
    id: 'finance-intel',
    panel: 'Finance Intelligence',
    serviceFiles: ['src/services/fred.ts', 'src/services/oil-analytics.ts'],
    apiRoutes: ['/api/etf-flows', '/api/macro-signals', '/api/stablecoin-markets'],
    apiHandlers: ['api/etf-flows.js', 'api/macro-signals.js', 'api/stablecoin-markets.js'],
    locality: 'fully-local',
    fallback: 'Financial analytics operate on local data snapshots in offline mode.',
    priority: 2,
  },
  {
    id: 'intel-analysis',
    panel: 'Intelligence Analysis (Classification/Posture)',
    serviceFiles: ['src/services/threat-classifier.ts', 'src/services/focal-point-detector.ts'],
    apiRoutes: ['/api/classify-event', '/api/theater-posture'],
    apiHandlers: ['api/classify-event.js', 'api/theater-posture.js'],
    locality: 'api-key',
    fallback: 'High-velocity pattern detection remains active with local heuristics.',
    priority: 2,
  },
  {
    id: 'pizzint',
    panel: 'Pizza Index (GeoInt Signature)',
    serviceFiles: ['src/services/pizzint.ts'],
    apiRoutes: ['/api/pizzint'],
    apiHandlers: ['api/pizzint/*.js'],
    locality: 'api-key',
    fallback: 'Pizzint monitoring falls back to manual signal tracking.',
    priority: 2,
  },
  {
    id: 'user-profiles',
    panel: 'Identity (User Profiles)',
    serviceFiles: ['src/services/auth.ts', 'src/services/auth-gate.ts'],
    apiRoutes: ['/api/customer-profile'],
    apiHandlers: ['api/customer-profile.js'],
    locality: 'cloud-fallback',
    fallback: 'Local guest mode enabled when Firebase/Firestore is unreachable.',
    priority: 3,
  },
  {
    id: 'subscriptions',
    panel: 'Finance (Subscriptions)',
    serviceFiles: [],
    apiRoutes: ['/api/check-subscription', '/api/create-checkout-session'],
    apiHandlers: ['api/check-subscription.js', 'api/create-checkout-session.js'],
    locality: 'cloud-fallback',
    fallback: 'Premium features disabled/locked when Stripe relay path is offline.',
    priority: 3,
  },
  {
    id: 'wingbits-enrichment',
    panel: 'Map layers (flight enrichment)',
    serviceFiles: ['src/services/wingbits.ts'],
    apiRoutes: ['/api/wingbits'],
    apiHandlers: ['api/wingbits/[[...path]].js'],
    locality: 'api-key',
    fallback: 'Flight tracks continue with heuristic classification when Wingbits credentials are unavailable.',
    priority: 3,
  },
  {
    id: 'opensky-relay-cloud',
    panel: 'Map layers (military flights relay)',
    serviceFiles: ['src/services/military-flights.ts'],
    apiRoutes: ['/api/opensky'],
    apiHandlers: ['api/opensky.js'],
    locality: 'cloud-fallback',
    fallback: 'If relay is unreachable, service falls back to Vercel proxy path and then no-data mode.',
    priority: 3,
  },
  {
    id: 'infra-updates',
    panel: 'Infrastructure (Updates/Downloads)',
    serviceFiles: ['src/services/runtime.ts'],
    apiRoutes: ['/api/version', '/api/download'],
    apiHandlers: ['api/version.js', 'api/download.js'],
    locality: 'cloud-fallback',
    fallback: 'Maintenance tasks require cloud connectivity to GitHub repository.',
    priority: 3,
  },
];

export function getNonParityFeatures(): DesktopParityFeature[] {
  return DESKTOP_PARITY_FEATURES.filter(feature => feature.locality !== 'fully-local');
}

export function getDesktopReadinessChecks(localBackendEnabled: boolean): DesktopReadinessCheck[] {
  const liveTrackingReady = isFeatureAvailable('aisRelay') || isFeatureAvailable('openskyRelay');

  return [
    { id: 'startup', label: 'Desktop startup + sidecar API health', ready: localBackendEnabled },
    { id: 'map', label: 'Map rendering (local layers + static geo assets)', ready: true },
    { id: 'core-intel', label: 'Core intelligence (News, Monitor, Risk, Cyber)', ready: true },
    { id: 'summaries', label: 'Summaries (provider-backed or browser fallback)', ready: isFeatureAvailable('aiGroq') || isFeatureAvailable('aiOpenRouter') },
    { id: 'market', label: 'Market & Finance panel live data paths', ready: true },
    { id: 'live-tracking', label: 'At least one live-tracking mode (AIS or OpenSky)', ready: liveTrackingReady },
    { id: 'infra', label: 'Infrastructure (Rebranded Updates & Downloads)', ready: true },
  ];
}

export function getKeyBackedAvailabilitySummary(): { available: number; total: number } {
  const available = keyBackedFeatures.filter(featureId => isFeatureAvailable(featureId)).length;
  return { available, total: keyBackedFeatures.length };
}
