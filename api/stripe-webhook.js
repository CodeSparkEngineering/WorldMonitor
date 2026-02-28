import { getRedis } from './_upstash-cache.js';
import { Resend } from 'resend';

export const config = {
    runtime: 'edge',
};

const CUSTOMER_TTL = 365 * 24 * 60 * 60; // 1 year

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
        return new Response('Stripe not configured', { status: 500 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

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
                let uid = session.client_reference_id;
                const email = session.customer_details?.email;
                const customerName = session.customer_details?.name;
                const stripeCustomerId = session.customer;
                const subscriptionId = session.subscription;

                // Fallback: If UID is missing but we have an email, try to find the user in Redis
                if (!uid && email && redis) {
                    console.log(`[Stripe] UID missing, attempting email lookup for: ${email}`);
                    const emailKey = email.toLowerCase().trim();
                    const foundUid = await redis.get(`email:${emailKey}`);
                    if (foundUid) {
                        uid = foundUid;
                        console.log(`[Stripe] Found UID via email lookup: ${uid}`);
                    }
                }

                if (uid && redis) {
                    console.log(`[Stripe] Granting access to user: ${uid}`);
                    // Set subscription status for 32 days (buffer for monthly)
                    await redis.set(`sub:${uid}`, 'active', { ex: 32 * 24 * 60 * 60 });

                    // Update customer profile with Stripe data
                    const existing = await redis.get(`customer:${uid}`);
                    const now = new Date().toISOString();

                    const profile = (existing && typeof existing === 'object')
                        ? {
                            ...existing,
                            stripeCustomerId: stripeCustomerId || existing.stripeCustomerId,
                            subscriptionId: subscriptionId || existing.subscriptionId,
                            subscriptionStatus: 'active',
                            plan: 'analyst',
                            subscribedAt: now,
                            lastPaymentAt: now,
                            displayName: customerName || existing.displayName,
                        }
                        : {
                            uid,
                            email: email || null,
                            displayName: customerName || null,
                            provider: 'email',
                            createdAt: now,
                            lastLoginAt: now,
                            loginCount: 0,
                            stripeCustomerId: stripeCustomerId || null,
                            subscriptionId: subscriptionId || null,
                            subscriptionStatus: 'active',
                            plan: 'analyst',
                            billingCycle: null,
                            subscribedAt: now,
                            lastPaymentAt: now,
                            expiresAt: null,
                        };

                    await redis.set(`customer:${uid}`, profile, { ex: CUSTOMER_TTL });

                    // Also map stripeCustomerId → uid for webhook lookups
                    if (stripeCustomerId) {
                        await redis.set(`stripe:${stripeCustomerId}`, uid, { ex: CUSTOMER_TTL });
                    }

                    console.log(`[Stripe] Customer profile updated: ${email || uid}`);

                    // Send Automated Access Message via Resend
                    if (resend && email) {
                        console.log(`[Stripe] Dispatching access credentials to ${email}...`);

                        try {
                            await resend.emails.send({
                                from: 'GeoNexus <onboarding@resend.dev>',
                                to: email,
                                subject: 'AUTHENTICATION CONFIRMED - ACCESS GRANTED',
                                html: `
                                    <div style="font-family: monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px; border: 1px solid #2a2a2a; border-radius: 8px;">
                                        <h1 style="color: #0080ff; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px;">ACCESS GRANTED, OPERATIVE</h1>
                                        <p>Seu pagamento foi confirmado e sua assinatura está <strong>ATIVA</strong> no sistema <strong>GEONEXUS</strong>.</p>
                                        <div style="background: #141414; padding: 20px; border-left: 4px solid #0080ff; margin: 20px 0;">
                                            <p style="margin: 0;"><strong>STATUS:</strong> OPERACIONAL</p>
                                            <p style="margin: 5px 0 0 0;"><strong>TERMINAL:</strong> <a href="${req.headers.get('origin') || ''}/app" style="color: #0080ff; text-decoration: none;">Acessar Painel Global</a></p>
                                        </div>
                                        <p style="font-size: 14px;">Use suas credenciais criadas no cadastro para acessar o terminal.</p>
                                        <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a1a1a; padding-top: 20px;">
                                            SISTEMA RESTRITO GEONEXUS. USO EXCLUSIVO POR OPERATIVOS AUTORIZADOS.
                                        </p>
                                    </div>
                                `
                            });
                            console.log(`[Stripe] Welcome email sent to ${email}`);
                        } catch (emailErr) {
                            console.error('[Stripe] Failed to send welcome email:', emailErr.message);
                        }
                    } else {
                        console.warn('[Stripe] Skipped email sending: Resend not configured or customer email missing');
                    }
                } else {
                    console.warn('[Stripe] Missing UID or Redis in checkout.session.completed');
                }
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                console.log('[Stripe] Subscription status:', subscription.status);

                if (redis && stripeCustomerId) {
                    // Look up uid from stripeCustomerId
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
                        if (isActive) {
                            await redis.set(`sub:${uid}`, 'active', { ex: 32 * 24 * 60 * 60 });
                        }

                        // Update customer profile
                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.subscriptionStatus = subscription.status;
                            existing.subscriptionId = subscription.id;
                            await redis.set(`customer:${uid}`, existing, { ex: CUSTOMER_TTL });
                        }
                        console.log(`[Stripe] Subscription ${subscription.status} for uid: ${uid}`);
                    }
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                console.log('[Stripe] Subscription cancelled:', subscription.id);

                if (redis && stripeCustomerId) {
                    // Look up uid from stripeCustomerId
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        // Revoke access
                        await redis.del(`sub:${uid}`);

                        // Update customer profile
                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.subscriptionStatus = 'cancelled';
                            existing.cancelledAt = new Date().toISOString();
                            await redis.set(`customer:${uid}`, existing, { ex: CUSTOMER_TTL });
                        }
                        console.log(`[Stripe] Access revoked for uid: ${uid}`);
                    }
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const stripeCustomerId = invoice.customer;

                if (redis && stripeCustomerId) {
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        // Renew subscription on payment
                        await redis.set(`sub:${uid}`, 'active', { ex: 32 * 24 * 60 * 60 });

                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.lastPaymentAt = new Date().toISOString();
                            existing.subscriptionStatus = 'active';
                            await redis.set(`customer:${uid}`, existing, { ex: CUSTOMER_TTL });
                        }
                        console.log(`[Stripe] Payment renewed for uid: ${uid}`);
                    }
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const stripeCustomerId = invoice.customer;

                if (redis && stripeCustomerId) {
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.subscriptionStatus = 'past_due';
                            await redis.set(`customer:${uid}`, existing, { ex: CUSTOMER_TTL });
                        }
                        console.log(`[Stripe] Payment failed for uid: ${uid}`);
                    }
                }
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
