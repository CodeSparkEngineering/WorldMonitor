import { getRedis } from './_upstash-cache.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const url = new URL(req.url);
        const uid = url.searchParams.get('uid');

        if (!uid) {
            return new Response(JSON.stringify({ active: false, error: 'UID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const redis = await getRedis();
        if (!redis) {
            // If Redis is down, we might want to fail open or closed depending on policy
            // Failing closed for security
            return new Response(JSON.stringify({ active: false, error: 'Cache unavailable' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const status = await redis.get(`sub:${uid}`);

        return new Response(JSON.stringify({
            active: status === 'active',
            status: status || 'none'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'private, max-age=60' // Cache for 1 min
            },
        });
    } catch (error) {
        console.error('[Auth] Subscription check error:', error);
        return new Response(JSON.stringify({ active: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
