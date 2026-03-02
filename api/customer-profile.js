import { getRedis } from './_upstash-cache.js';
import { dualWriteProfile } from './_firebase-admin.js';

export const config = {
    runtime: 'nodejs',
};

const CUSTOMER_TTL = 365 * 24 * 60 * 60; // 1 year

export default async function handler(req) {
    const redis = await getRedis();

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
            // Priority: Firestore (REST for now, or Admin if we want to change)
            const { getFirestoreDoc } = await import('./_firestore.js');
            const firestoreProfile = await getFirestoreDoc('customers', uid);

            const profile = firestoreProfile || (redis ? await redis.get(`customer:${uid}`) : null);
            const subStatusDoc = await getFirestoreDoc('subscriptions', uid);
            const subStatus = (subStatusDoc && subStatusDoc.status) || (redis ? await redis.get(`sub:${uid}`) : 'none');

            return new Response(JSON.stringify({
                profile: profile || null,
                subscription: {
                    active: subStatus === 'active',
                    status: subStatus || 'none',
                },
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('[Customer] Fetch error:', error);
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

            const existing = redis ? await redis.get(`customer:${uid}`) : null;
            const now = new Date().toISOString();

            let profile;
            if (existing && typeof existing === 'object') {
                profile = {
                    ...existing,
                    email,
                    displayName: displayName || existing.displayName || null,
                    lastLoginAt: now,
                    loginCount: (existing.loginCount || 0) + 1,
                    provider: provider || existing.provider || 'email',
                };
            } else {
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

            // Dual Write to Redis and Firestore
            await Promise.all([
                dualWriteProfile(uid, profile, redis),
                redis ? redis.set(`email:${email}`, uid, { ex: CUSTOMER_TTL }) : Promise.resolve()
            ]);

            console.log(`[Customer] ${action === 'register' ? 'Registered' : 'Updated'}: ${email} (${uid})`);

            return new Response(JSON.stringify({ success: true, profile }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('[Customer] Save error:', error);
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
