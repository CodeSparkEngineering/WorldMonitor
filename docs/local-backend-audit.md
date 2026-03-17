# GeoNexus: Local backend parity matrix (desktop sidecar)

This matrix tracks desktop parity by mapping `src/services/*.ts` consumers to `api/*.js` handlers and classifying each feature as:

- **Fully local**: works from desktop sidecar without user credentials (or uses local sidecar logic).
- **Requires user-provided API key**: local endpoint exists, but capability depends on configured secrets (GROQ, OpenAI, etc).
- **Requires cloud fallback**: sidecar exists, but operational behavior depends on a cloud relay path (Firebase, Stripe, GitHub).

## Priority closure order

1. **Priority 1 (Core & Security):** LiveNews, Monitor, Strategic Risk, Cyber, Map Layers.
2. **Priority 2 (Intelligence & Environment):** Summaries, Markets, Fires/Quakes, Climate, Finance Intel.
3. **Priority 3 (Identity & Logistics):** User Profiles, Subscriptions, Flight/Marine enrichment, Updates.

## Feature parity matrix

### 🛡️ Cyber & Security Domain
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P1 | CyberPanel | `cyber-threats.ts` | `/api/cyber-threats` | `cyber-threats.js` | API key | ✅ Supported: Abuse.ch, AlienVault, IPDB. |
| P1 | MonitorPanel | _None (local)_ | _None_ | _None_ | Fully local | ✅ Client-side keyword matching. |

### 🌍 Geopolitical & Intel Domain
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P1 | LiveNewsPanel | `live-news.ts` | `/api/youtube/live` | `youtube/live.js` | Fully local | ✅ Channel-level fallback implemented. |
| P1 | StrategicRisk | `cached-risk-scores.ts` | `/api/risk-scores` | `risk-scores.js` | API key | ✅ Local aggregate scoring fallback. |
| P1 | Map Layers | `conflicts.ts`, `outages.ts` | `/api/acled-conflict`, `/api/cloudflare-outages` | `acled-conflict.js`, `cloudflare-outages.js` | API key | ✅ Rendering remains active on feed failure. |
| P2 | Intel Analysis | `threat-classifier.ts`, `focal-point-detector.ts` | `/api/classify-event`, `/api/theater-posture` | `classify-event.js`, `theater-posture.js` | API key | ✅ High-velocity pattern detection active. |
| P2 | Pizza Index | `pizzint.ts` | `/api/pizzint` | `pizzint/*.js` | API key | ✅ GeoNexus signature event tracking. |
| P2 | UCDP / Conflicts| `ucdp.ts`, `ucdp-events.ts` | `/api/ucdp`, `/api/ucdp-events` | `ucdp.js`, `ucdp-events.js` | Fully local | ✅ Disaster/Conflict historical data. |

### 📚 Research & OSINT Domain (NEW)
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P2 | Academic Intel | `arxiv.ts` | `/api/arxiv` | `arxiv.js` | Fully local | ✅ Academic research feed integration. |
| P2 | GDELT Global | `gdelt-intel.ts` | `/api/gdelt-doc`, `/api/gdelt-geo` | `gdelt-doc.js`, `gdelt-geo.js` | Fully local | ✅ Global event monitoring via GDELT. |
| P2 | GDACS / HAPI | `gdacs.ts`, `hapi.ts` | `/api/gdacs`, `/api/hapi` | _(in-progress)_ | Fully local | ✅ Global disaster alerts. |

### 💻 Technology & OSINT Domain (NEW)
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P2 | Tech Activity | `tech-activity.ts` | `/api/tech-events` | `tech-events.js` | Fully local | ✅ Tech-sector stability monitoring. |
| P2 | Dev Trends | `github-trending.ts`, `hackernews.ts` | `/api/github-trending`, `/api/hackernews` | `github-trending.js`, `hackernews.js` | Fully local | ✅ Open-source and dev sentiment tracking. |

### 🌪️ Environment & Climate Domain
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P2 | Fires & Quakes | `firms-satellite.ts`, `earthquakes.ts` | `/api/firms-fires`, `/api/earthquakes` | `firms-fires.js`, `earthquakes.js` | Fully local | ✅ NASA FIRMS and USGS local handlers. |
| P2 | Climate Changes | `climate.ts` | `/api/climate-anomalies` | `climate-anomalies.js` | Fully local | ✅ NOAA dataset analysis operational. |

### 📊 Finance & Markets Domain
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P2 | MarketPanel | `markets.ts`, `polymarket.ts` | `/api/coingecko`, `/api/polymarket`, `/api/finnhub` | `coingecko.js`, `polymarket.js`, `finnhub.js` | Fully local | ✅ Multi-provider failover. |
| P2 | Macro / Oil | `fred.ts`, `oil-analytics.ts` | `/api/fred-data`, `/api/macro-signals`, `/api/etf-flows` | `fred-data.js`, `macro-signals.js`, `etf-flows.js` | Fully local | ✅ FRED and ETF flow monitoring. |

### 👤 Identity & Finance Domain (NEW)
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P3 | User Profiles | `auth.ts`, `auth-gate.ts` | `/api/customer-profile` | `customer-profile.js` | Cloud fallback | ✅ Firebase Identity + Firestore profile sync. |
| P3 | Subscriptions | _Landing UI_ | `/api/check-subscription`, `/api/create-checkout-session`, `/api/cancel-subscription` | `check-subscription.js`, `create-checkout-session.js`, `cancel-subscription.js` | Cloud fallback | ✅ Stripe integration + Firebase Subscriptions. |
| P3 | Webhooks | _External_ | `/api/stripe-webhook` | `stripe-webhook.js` | Cloud fallback | ✅ Real-time payment processing. |

### 🚁 Logistics & Infrastructure Domain
| Priority | Feature / Panel | Service source(s) | API route(s) | API handler(s) | Classification | Closure status |
|---|---|---|---|---|---|---|
| P1 | Live Tracking | `ais.ts`, `military-flights.ts` | `/api/ais-snapshot`, `/api/opensky` | `ais-snapshot.js`, `opensky.js` | API key / Cloud | ✅ AIS and ADSB-Exchange/OpenSky monitoring. |
| P2 | Transport Intel | `flights.ts` | `/api/faa-status`, `/api/nga-warnings` | `faa-status.js`, `nga-warnings.js` | Fully local | ✅ FAA ground stops and NGA maritime warnings. |
| P3 | Enrichment | `wingbits.ts` | `/api/wingbits` | `wingbits/*.js` | API key | ✅ Aircraft classification heuristics. |
| P3 | System | `runtime.ts` | `/api/version`, `/api/download`, `/api/service-status` | `version.js`, `download.js`, `service-status.js` | Cloud fallback | ✅ rebranded to `CodeSparkEngineering/WorldMonitor`. |

## Non-parity closure actions completed

- Added **desktop readiness + non-parity fallback visibility** in `ServiceStatusPanel` so operators can see acceptance status and per-feature fallback behavior in desktop runtime.
- Kept local-sidecar strategy as the default path: desktop sidecar executes `api/*.js` handlers locally and only uses cloud fallback when handler execution or relay path fails.
- Rebranded all system references from World Monitor to **GeoNexus**.
- Updated hardcoded fallback origins from `geonexus.app` to `geonexus.live`.

## Desktop-ready acceptance criteria

A desktop build is considered **ready** when all checks below are green:

1. **Startup:** app launches and local sidecar health reports enabled.
2. **Map rendering:** map loads with local/static layers even when optional feeds are unavailable.
3. **Core intelligence panels:** LiveNewsPanel, MonitorPanel, StrategicRiskPanel, CyberPanel render without fatal errors.
4. **Summaries:** at least one summary path works (provider-backed or browser fallback).
5. **Market panel:** panel renders and returns data from at least one market provider.
6. **Live tracking:** at least one live mode (AIS or OpenSky) is available.

These checks are now surfaced in the Service Status UI as “Desktop readiness”.
