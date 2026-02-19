import { defineConfig, type Plugin, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

const isE2E = process.env.VITE_E2E === '1';

const VARIANT_META: Record<string, {
  title: string;
  description: string;
  keywords: string;
  url: string;
  siteName: string;
  shortName: string;
  subject: string;
  classification: string;
  categories: string[];
  features: string[];
}> = {
  full: {
    title: 'World Monitor - Real-Time Global Intelligence Dashboard',
    description: 'Real-time global intelligence dashboard with live news, markets, military tracking, infrastructure monitoring, and geopolitical data. OSINT in one view.',
    keywords: 'global intelligence, geopolitical dashboard, world news, market data, military bases, nuclear facilities, undersea cables, conflict zones, real-time monitoring, situation awareness, OSINT, flight tracking, AIS ships, earthquake monitor, protest tracker, power outages, oil prices, government spending, polymarket predictions',
    url: 'https://geonexus.live/',
    siteName: 'World Monitor',
    shortName: 'WorldMonitor',
    subject: 'Real-Time Global Intelligence and Situation Awareness',
    classification: 'Intelligence Dashboard, OSINT Tool, News Aggregator',
    categories: ['news', 'productivity'],
    features: [
      'Real-time news aggregation',
      'Stock market tracking',
      'Military flight monitoring',
      'Ship AIS tracking',
      'Earthquake alerts',
      'Protest tracking',
      'Power outage monitoring',
      'Oil price analytics',
      'Government spending data',
      'Prediction markets',
      'Infrastructure monitoring',
      'Geopolitical intelligence',
    ],
  },
  tech: {
    title: 'Tech Monitor - Real-Time AI & Tech Industry Dashboard',
    description: 'Real-time AI and tech industry dashboard tracking tech giants, AI labs, startup ecosystems, funding rounds, and tech events worldwide.',
    keywords: 'tech dashboard, AI industry, startup ecosystem, tech companies, AI labs, venture capital, tech events, tech conferences, cloud infrastructure, datacenters, tech layoffs, funding rounds, unicorns, FAANG, tech HQ, accelerators, Y Combinator, tech news',
    url: 'https://tech.worldmonitor.app/',
    siteName: 'Tech Monitor',
    shortName: 'TechMonitor',
    subject: 'AI, Tech Industry, and Startup Ecosystem Intelligence',
    classification: 'Tech Dashboard, AI Tracker, Startup Intelligence',
    categories: ['news', 'business'],
    features: [
      'Tech news aggregation',
      'AI lab tracking',
      'Startup ecosystem mapping',
      'Tech HQ locations',
      'Conference & event calendar',
      'Cloud infrastructure monitoring',
      'Datacenter mapping',
      'Tech layoff tracking',
      'Funding round analytics',
      'Tech stock tracking',
      'Service status monitoring',
    ],
  },
  finance: {
    title: 'Finance Monitor - Real-Time Markets & Trading Dashboard',
    description: 'Real-time finance and trading dashboard tracking global markets, stock exchanges, central banks, commodities, forex, crypto, and economic indicators worldwide.',
    keywords: 'finance dashboard, trading dashboard, stock market, forex, commodities, central banks, crypto, economic indicators, market news, financial centers, stock exchanges, bonds, derivatives, fintech, hedge funds, IPO tracker, market analysis',
    url: 'https://finance.worldmonitor.app/',
    siteName: 'Finance Monitor',
    shortName: 'FinanceMonitor',
    subject: 'Global Markets, Trading, and Financial Intelligence',
    classification: 'Finance Dashboard, Market Tracker, Trading Intelligence',
    categories: ['finance', 'news'],
    features: [
      'Real-time market data',
      'Stock exchange mapping',
      'Central bank monitoring',
      'Commodity price tracking',
      'Forex & currency news',
      'Crypto & digital assets',
      'Economic indicator alerts',
      'IPO & earnings tracking',
      'Financial center mapping',
      'Sector heatmap',
      'Market radar signals',
    ],
  },
};

const activeVariant = process.env.VITE_VARIANT || 'full';
const activeMeta = VARIANT_META[activeVariant] || VARIANT_META.full;

function htmlVariantPlugin(): Plugin {
  return {
    name: 'html-variant',
    transformIndexHtml(html) {
      return html
        .replace(/<title>.*?<\/title>/, `<title>${activeMeta.title}</title>`)
        .replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${activeMeta.title}" />`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${activeMeta.description}" />`)
        .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${activeMeta.keywords}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${activeMeta.url}" />`)
        .replace(/<meta name="application-name" content=".*?" \/>/, `<meta name="application-name" content="${activeMeta.siteName}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${activeMeta.url}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${activeMeta.title}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${activeMeta.description}" />`)
        .replace(/<meta property="og:site_name" content=".*?" \/>/, `<meta property="og:site_name" content="${activeMeta.siteName}" />`)
        .replace(/<meta name="subject" content=".*?" \/>/, `<meta name="subject" content="${activeMeta.subject}" />`)
        .replace(/<meta name="classification" content=".*?" \/>/, `<meta name="classification" content="${activeMeta.classification}" />`)
        .replace(/<meta name="twitter:url" content=".*?" \/>/, `<meta name="twitter:url" content="${activeMeta.url}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${activeMeta.title}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${activeMeta.description}" />`)
        .replace(/"name": "World Monitor"/, `"name": "${activeMeta.siteName}"`)
        .replace(/"alternateName": "WorldMonitor"/, `"alternateName": "${activeMeta.siteName.replace(' ', '')}"`)
        .replace(/"url": "https:\/\/geonexus\.live\/"/, `"url": "${activeMeta.url}"`)
        .replace(/"description": "Real-time global intelligence dashboard with live news, markets, military tracking, infrastructure monitoring, and geopolitical data."/, `"description": "${activeMeta.description}"`)
        .replace(/"featureList": \[[\s\S]*?\]/, `"featureList": ${JSON.stringify(activeMeta.features, null, 8).replace(/\n/g, '\n      ')}`);
    },
  };
}

function youtubeLivePlugin(): Plugin {
  return {
    name: 'youtube-live',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/youtube/live')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const channel = url.searchParams.get('channel');

        if (!channel) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing channel parameter' }));
          return;
        }

        try {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=300');
          res.end(JSON.stringify({ videoId: null, channel }));
        } catch (error) {
          console.error(`[YouTube Live] Error:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to fetch', videoId: null }));
        }
      });
    },
  };
}

function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        if (res.headersSent) return next();

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname.replace(/^\/api\//, '');
        const parts = pathname.split('/').filter(Boolean);

        if (parts.length === 0) return next();

        let mod;
        let finalPath = '';

        const potentialFiles = [
          `/api/${pathname}.js`,
          `/api/${pathname}/index.js`,
        ];

        for (let i = parts.length; i >= 0; i--) {
          const p = parts.slice(0, i).join('/');
          const suffix = p ? `/${p}` : '';
          potentialFiles.push(`/api${suffix}/[[...path]].js`);
        }

        for (const tryPath of potentialFiles) {
          try {
            mod = await server.ssrLoadModule(tryPath);
            if (mod) {
              finalPath = tryPath;
              break;
            }
          } catch (e: any) {
            // Ignore load errors
          }
        }

        if (!mod || !mod.default) return next();

        let body: any = undefined;
        if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          body = Buffer.concat(buffers);
        }

        const webReq = new Request(url.href, {
          method: req.method,
          headers: req.headers as any,
          body: body
        });

        try {
          const webRes: Response = await mod.default(webReq);
          res.statusCode = webRes.status;
          webRes.headers.forEach((v, k) => res.setHeader(k, v));
          const arrayBuffer = await webRes.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (err: any) {
          console.error(`[Local API] Error executing ${pathname} (${finalPath}):`, err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      'process.env.STRIPE_MONTHLY_PRICE_ID': JSON.stringify(process.env.STRIPE_MONTHLY_PRICE_ID || ''),
      'process.env.STRIPE_ANNUAL_PRICE_ID': JSON.stringify(process.env.STRIPE_ANNUAL_PRICE_ID || ''),
      'import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID': JSON.stringify(process.env.STRIPE_MONTHLY_PRICE_ID || ''),
      'import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID': JSON.stringify(process.env.STRIPE_ANNUAL_PRICE_ID || ''),
    },
    plugins: [
      htmlVariantPlugin(),
      react(),
      localApiPlugin(),
      youtubeLivePlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        includeAssets: [
          'favico/favicon.ico',
          'favico/apple-touch-icon.png',
          'favico/favicon-32x32.png',
        ],
        manifest: {
          name: `${activeMeta.siteName} - ${activeMeta.subject}`,
          short_name: activeMeta.shortName,
          description: activeMeta.description,
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#0a0f0a',
          background_color: '#0a0f0a',
          categories: activeMeta.categories,
          icons: [
            { src: '/favico/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/favico/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/favico/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,ico,png,svg,woff2}', 'index.html'],
          globIgnores: ['**/ml-*.js', '**/onnx*.wasm'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/settings/],
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-navigation',
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: /^https?:\/\/.*\/api\/.*/i,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /^https?:\/\/.*\/rss\/.*/i,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /^https:\/\/api\.maptiler\.com\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'map-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/[abc]\.basemaps\.cartocdn\.com\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'carto-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-css',
                expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-woff',
                expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images',
                expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'app.html'),
          settings: resolve(__dirname, 'settings.html'),
          landing: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/@xenova/transformers/') || id.includes('/onnxruntime-web/')) return 'ml';
              if (id.includes('/@deck.gl/') || id.includes('/maplibre-gl/') || id.includes('/h3-js/')) return 'map';
              if (id.includes('/d3/')) return 'd3';
              if (id.includes('/topojson-client/')) return 'topojson';
            }
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3000,
      open: !isE2E,
      hmr: isE2E ? false : undefined,
      watch: {
        ignored: ['**/test-results/**', '**/playwright-report/**', '**/.playwright-mcp/**'],
      },
      proxy: {
        '/api/yahoo': {
          target: 'https://query1.finance.yahoo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        },
        '/api/coingecko': {
          target: 'https://api.coingecko.com',
          changeOrigin: true,
          rewrite: (path) => {
            const idx = path.indexOf('?');
            const qs = idx >= 0 ? path.substring(idx) : '';
            const params = new URLSearchParams(qs);
            if (params.get('endpoint') === 'markets') {
              params.delete('endpoint');
              const vs = params.get('vs_currencies') || 'usd';
              params.delete('vs_currencies');
              params.set('vs_currency', vs);
              params.set('sparkline', 'true');
              params.set('order', 'market_cap_desc');
              return `/api/v3/coins/markets?${params.toString()}`;
            }
            return `/api/v3/simple/price${qs}`;
          },
        },
        '/api/polymarket': {
          target: 'https://worldmonitor.app',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('Polymarket proxy error:', err.message));
          },
        },
        '/api/earthquake': {
          target: 'https://earthquake.usgs.gov',
          changeOrigin: true,
          timeout: 30000,
          rewrite: (path) => path.replace(/^\/api\/earthquake/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('Earthquake proxy error:', err.message));
          },
        },
        '/api/pizzint': {
          target: 'https://www.pizzint.watch',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/pizzint/, '/api'),
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('PizzINT proxy error:', err.message));
          },
        },
        '/api/fred-data': {
          target: 'https://api.stlouisfed.org',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const seriesId = url.searchParams.get('series_id');
            const apiKey = process.env.FRED_API_KEY || '';
            const start = url.searchParams.get('observation_start');
            const end = url.searchParams.get('observation_end');
            return `/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=10${start ? `&observation_start=${start}` : ''}${end ? `&observation_end=${end}` : ''}`;
          },
        },
        '/rss/bbc': { target: 'https://feeds.bbci.co.uk', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/bbc/, '') },
        '/rss/guardian': { target: 'https://www.theguardian.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/guardian/, '') },
        '/rss/npr': { target: 'https://feeds.npr.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/npr/, '') },
        '/rss/apnews': { target: 'https://rsshub.app/apnews', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/apnews/, '') },
        '/rss/aljazeera': { target: 'https://www.aljazeera.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/aljazeera/, '') },
        '/rss/cnn': { target: 'http://rss.cnn.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/cnn/, '') },
        '/rss/hn': { target: 'https://hnrss.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/hn/, '') },
        '/rss/arstechnica': { target: 'https://feeds.arstechnica.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/arstechnica/, '') },
        '/rss/verge': { target: 'https://www.theverge.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/verge/, '') },
        '/rss/cnbc': { target: 'https://www.cnbc.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/cnbc/, '') },
        '/rss/marketwatch': { target: 'https://feeds.marketwatch.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/marketwatch/, '') },
        '/rss/defenseone': { target: 'https://www.defenseone.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/defenseone/, '') },
        '/rss/warontherocks': { target: 'https://warontherocks.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/warontherocks/, '') },
        '/rss/breakingdefense': { target: 'https://breakingdefense.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/breakingdefense/, '') },
        '/rss/bellingcat': { target: 'https://www.bellingcat.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/bellingcat/, '') },
        '/rss/googlenews': { target: 'https://news.google.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/googlenews/, '') },
        '/rss/openai': { target: 'https://openai.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/openai/, '') },
        '/rss/anthropic': { target: 'https://www.anthropic.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/anthropic/, '') },
        '/rss/googleai': { target: 'https://blog.google', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/googleai/, '') },
        '/rss/deepmind': { target: 'https://deepmind.google', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/deepmind/, '') },
        '/rss/huggingface': { target: 'https://huggingface.co', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/huggingface/, '') },
        '/rss/techreview': { target: 'https://www.technologyreview.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/techreview/, '') },
        '/rss/arxiv': { target: 'https://rss.arxiv.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/arxiv/, '') },
        '/rss/whitehouse': { target: 'https://www.whitehouse.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/whitehouse/, '') },
        '/rss/statedept': { target: 'https://www.state.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/statedept/, '') },
        '/rss/defense': { target: 'https://www.defense.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/defense/, '') },
        '/rss/justice': { target: 'https://www.justice.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/justice/, '') },
        '/rss/cdc': { target: 'https://tools.cdc.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/cdc/, '') },
        '/rss/fema': { target: 'https://www.fema.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/fema/, '') },
        '/rss/dhs': { target: 'https://www.dhs.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/dhs/, '') },
        '/rss/fedreserve': { target: 'https://www.federalreserve.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/fedreserve/, '') },
        '/rss/sec': { target: 'https://www.sec.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/sec/, '') },
        '/rss/treasury': { target: 'https://home.treasury.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/treasury/, '') },
        '/rss/cisa': { target: 'https://www.cisa.gov', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/cisa/, '') },
        '/rss/brookings': { target: 'https://www.brookings.edu', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/brookings/, '') },
        '/rss/cfr': { target: 'https://www.cfr.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/cfr/, '') },
        '/rss/csis': { target: 'https://www.csis.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/csis/, '') },
        '/rss/warzone': { target: 'https://www.thedrive.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/warzone/, '') },
        '/rss/krebs': { target: 'https://krebsonsecurity.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/krebs/, '') },
        '/rss/yahoonews': { target: 'https://finance.yahoo.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/yahoonews/, '') },
        '/rss/diplomat': { target: 'https://thediplomat.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/diplomat/, '') },
        '/rss/venturebeat': { target: 'https://venturebeat.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/venturebeat/, '') },
        '/rss/foreignpolicy': { target: 'https://foreignpolicy.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/foreignpolicy/, '') },
        '/rss/ft': { target: 'https://www.ft.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/ft/, '') },
        '/rss/reuters': { target: 'https://www.reutersagency.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/rss\/reuters/, '') },
        '/api/cloudflare-radar': { target: 'https://api.cloudflare.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/cloudflare-radar/, '') },
        '/api/nga-msi': { target: 'https://msi.nga.mil', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/nga-msi/, '') },
        '/api/acled': { target: 'https://acleddata.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/acled/, '') },
        '/api/gdelt-geo': { target: 'https://api.gdeltproject.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/gdelt-geo/, '/api/v2/geo/geo') },
        '/api/gdelt': { target: 'https://api.gdeltproject.org', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/gdelt/, '') },
        '/ws/aisstream': { target: 'wss://stream.aisstream.io', changeOrigin: true, ws: true, rewrite: (path) => path.replace(/^\/ws\/aisstream/, '') },
        '/api/faa': {
          target: 'https://nasstatus.faa.gov',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/faa/, ''),
          configure: (proxy) => proxy.on('error', (err) => console.log('FAA NASSTATUS proxy error:', err.message)),
        },
        '/api/opensky': {
          target: 'https://opensky-network.org/api',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/opensky/, ''),
          configure: (proxy) => proxy.on('error', (err) => console.log('OpenSky proxy error:', err.message)),
        },
        '/api/adsb-exchange': {
          target: 'https://adsbexchange.com/api',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/adsb-exchange/, ''),
          configure: (proxy) => proxy.on('error', (err) => console.log('ADS-B Exchange proxy error:', err.message)),
        },
      },
    },
  };
});
