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
        let status = 'none';

        try {
            // New Primary Source: Firestore REST
            const { getFirestoreDoc } = await import('./_firestore.js');
            const doc = await getFirestoreDoc('subscriptions', uid);
            if (doc && doc.status) {
                status = doc.status;
                console.log(`[Auth] Firestore hit: ${uid} -> ${status}`);
            } else if (redis) {
                // Secondary Source: Upstash Redis (Legacy)
                status = await redis.get(`sub:${uid}`);
                console.log(`[Auth] Redis fallback: ${uid} -> ${status}`);
            }
        } catch (dbError) {
            console.error('[Auth] Database read failed:', dbError);
            if (redis) {
                status = await redis.get(`sub:${uid}`);
            }
        }

        return new Response(JSON.stringify({
            active: status === 'active',
            status: status || 'none'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[Auth] Subscription check error:', error);
        return new Response(JSON.stringify({ active: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
