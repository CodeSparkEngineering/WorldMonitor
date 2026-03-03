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

    try {
        const { uid, status } = await req.json();

        if (!uid || !status) {
            return new Response(JSON.stringify({ error: 'uid and status required' }), {
                status: 400,
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
