import { getRedis } from './_upstash-cache.js';

export const config = {
    runtime: 'edge',
};

const CUSTOMER_TTL = 365 * 24 * 60 * 60; // 1 year

export default async function handler(req) {
    const redis = await getRedis();
    if (!redis) {
        return new Response(JSON.stringify({ error: 'Database unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // GET: Retrieve customer profile
    if (req.method === 'GET') {
        const url = new URL(req.url);
        const uid = url.searchParams.get('uid');

        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const profile = await redis.get(`customer:${uid}`);
            const subStatus = await redis.get(`sub:${uid}`);

            return new Response(JSON.stringify({
                profile: profile || null,
                subscription: {
                    active: subStatus === 'active',
                    status: subStatus || 'none',
                },
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'private, max-age=30',
                },
            });
        } catch (error) {
            console.error('[Customer] Profile fetch error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    // POST: Create or update customer profile
    if (req.method === 'POST') {
        try {
            const body = await req.json();
            const { uid, email, displayName, provider, action } = body;

            if (!uid || !email) {
                return new Response(JSON.stringify({ error: 'UID and email required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Fetch existing profile
            const existing = await redis.get(`customer:${uid}`);
            const now = new Date().toISOString();

            let profile;
            if (existing && typeof existing === 'object') {
                // Update existing profile
                profile = {
                    ...existing,
                    email,
                    displayName: displayName || existing.displayName || null,
                    lastLoginAt: now,
                    loginCount: (existing.loginCount || 0) + 1,
                    provider: provider || existing.provider || 'email',
                };
            } else {
                // Create new profile
                profile = {
                    uid,
                    email,
                    displayName: displayName || null,
                    provider: provider || 'email',
                    createdAt: now,
                    lastLoginAt: now,
                    loginCount: 1,
                    stripeCustomerId: null,
                    subscriptionId: null,
                    subscriptionStatus: 'none',
                    plan: null,
                    billingCycle: null,
                    expiresAt: null,
                };
            }

            await redis.set(`customer:${uid}`, profile, { ex: CUSTOMER_TTL });

            // Also maintain an email→uid index for lookups
            await redis.set(`email:${email}`, uid, { ex: CUSTOMER_TTL });

            console.log(`[Customer] ${action === 'register' ? 'Registered' : 'Updated'}: ${email} (${uid})`);

            return new Response(JSON.stringify({ success: true, profile }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('[Customer] Profile save error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
    });
}
