// Temporary migration endpoint - writes subscription data to Firestore
// DELETE THIS FILE after migration is complete

import { setFirestoreDoc } from './_firestore-auth.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Simple security: require a secret key
    const ADMIN_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        const { uid, status, secret } = await req.json();

        if (!uid || !status) {
            return new Response(JSON.stringify({ error: 'uid and status required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (secret !== ADMIN_SECRET) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await setFirestoreDoc('subscriptions', uid, { status });

        return new Response(JSON.stringify({ success: result, uid, status }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
