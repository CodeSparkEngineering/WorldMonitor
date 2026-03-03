// Check Subscription Status
// Reads subscription status from Firestore only (no Redis)

import { getFirestoreDoc } from './_firestore-auth.js';

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

        let status = 'none';

        try {
            const doc = await getFirestoreDoc('subscriptions', uid);
            if (doc && doc.status) {
                status = doc.status;
                console.log(`[Auth] Firestore: ${uid} -> ${status}`);
            }
        } catch (dbError) {
            console.error('[Auth] Firestore read failed:', dbError);
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
