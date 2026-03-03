// Customer Profile API
// Reads and writes customer profiles to Firestore only (no Redis)

import { getFirestoreDoc, setFirestoreDoc } from './_firestore-auth.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
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
            const [profile, subDoc] = await Promise.all([
                getFirestoreDoc('customers', uid),
                getFirestoreDoc('subscriptions', uid),
            ]);

            const subStatus = (subDoc && subDoc.status) || 'none';

            return new Response(JSON.stringify({
                profile: profile || null,
                subscription: {
                    active: subStatus === 'active',
                    status: subStatus,
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

            const existing = await getFirestoreDoc('customers', uid);
            const now = new Date().toISOString();

            let profile;
            if (existing && typeof existing === 'object' && existing.uid) {
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

            await setFirestoreDoc('customers', uid, profile);

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
