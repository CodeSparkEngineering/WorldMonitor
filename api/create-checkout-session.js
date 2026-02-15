// Stripe Checkout Session Creation
// Creates a payment session for GeoNexus subscription

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
        const { priceId, email } = await req.json();

        if (!priceId) {
            return new Response(JSON.stringify({ error: 'Price ID required' }), {
                status: 400,
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

        // Create Stripe checkout session
        const session = await createCheckoutSession(STRIPE_SECRET_KEY, {
            priceId,
            email,
            successUrl: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${req.headers.get('origin')}/subscribe`,
        });

        return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[Stripe] Checkout error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function createCheckoutSession(apiKey, { priceId, email, successUrl, cancelUrl }) {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'mode': 'subscription',
            'line_items[0][price]': priceId,
            'line_items[0][quantity]': '1',
            'success_url': successUrl,
            'cancel_url': cancelUrl,
            ...(email && { 'customer_email': email }),
            'allow_promotion_codes': 'true',
            'billing_address_collection': 'required',
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create checkout session');
    }

    return await response.json();
}
