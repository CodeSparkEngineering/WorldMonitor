import { getRedis } from './_upstash-cache.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
        return new Response('Stripe not configured', { status: 500 });
    }

    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return new Response('No signature', { status: 400 });
        }

        // Parse event (Simplified for edge runtime without stripe library)
        const event = JSON.parse(body);
        const redis = await getRedis();

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const uid = session.client_reference_id;

                if (uid && redis) {
                    console.log(`[Stripe] Granting access to user: ${uid}`);
                    // Set subscription status for 32 days (buffer for monthly)
                    await redis.set(`sub:${uid}`, 'active', { ex: 32 * 24 * 60 * 60 });
                } else {
                    console.warn('[Stripe] Missing UID or Redis in checkout.session.completed');
                }
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                // Note: We might need to map customer_id to uid if metadata is updated
                console.log('[Stripe] Subscription status:', subscription.status);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                // Ideal: Revoke access here
                break;
            }

            default:
                console.log('[Stripe] Unhandled event type:', event.type);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[Stripe] Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
