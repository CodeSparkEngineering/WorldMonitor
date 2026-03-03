// Cancel Subscription API
// Cancels a Stripe subscription at end of billing period
// Uses Firestore only (no Redis)

import { getFirestoreDoc } from './_firestore-auth.js';

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

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { uid } = await req.json();

        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Find subscriptionId from Firestore
        let subscriptionId = null;

        try {
            const customer = await getFirestoreDoc('customers', uid);
            if (customer?.subscriptionId) {
                subscriptionId = customer.subscriptionId;
            }
        } catch (e) {
            console.warn('[Cancel] Firestore lookup failed:', e.message);
        }

        if (!subscriptionId) {
            return new Response(JSON.stringify({ error: 'No active subscription found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Cancel at end of billing period via Stripe API
        const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 'cancel_at_period_end': 'true' }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('[Cancel] Stripe error:', error);
            return new Response(JSON.stringify({ error: error.error?.message || 'Failed to cancel' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const subscription = await response.json();
        console.log(`[Cancel] Subscription ${subscriptionId} set to cancel at period end for UID: ${uid}`);

        return new Response(JSON.stringify({
            success: true,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: subscription.current_period_end,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('[Cancel] Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
