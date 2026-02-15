// Stripe Webhook Handler
// Handles subscription events from Stripe

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

        // Verify webhook signature
        const event = await verifyWebhook(body, signature, STRIPE_WEBHOOK_SECRET);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('[Stripe] Checkout completed:', session.id);
                // TODO: Create user account or grant access
                // This is where you'd integrate with Firebase to create/update user
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log('[Stripe] Subscription updated:', subscription.id, subscription.status);
                // TODO: Update user subscription status in database
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log('[Stripe] Subscription cancelled:', subscription.id);
                // TODO: Revoke user access
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                console.log('[Stripe] Payment succeeded:', invoice.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log('[Stripe] Payment failed:', invoice.id);
                // TODO: Notify user of payment failure
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

async function verifyWebhook(payload, signature, secret) {
    // Simple webhook verification
    // In production, use proper signature verification
    const event = JSON.parse(payload);

    // TODO: Implement proper Stripe signature verification
    // For now, just parse the event
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', secret)
    //   .update(payload)
    //   .digest('hex');

    return event;
}
