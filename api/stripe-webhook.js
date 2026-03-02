import { getRedis } from './_upstash-cache.js';
import { Resend } from 'resend';
import { dualWriteSubscription, dualWriteProfile } from './_firebase-admin.js';

export const config = {
    runtime: 'nodejs',
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

        const event = JSON.parse(body);
        const redis = await getRedis();

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                let uid = session.client_reference_id;
                const email = session.customer_details?.email;
                const customerName = session.customer_details?.name;
                const stripeCustomerId = session.customer;
                const subscriptionId = session.subscription;

                if (!uid && email && redis) {
                    const emailKey = email.toLowerCase().trim();
                    const foundUid = await redis.get(`email:${emailKey}`);
                    if (foundUid) uid = foundUid;
                }

                if (uid) {
                    console.log(`[Stripe] Granting access to: ${uid}`);

                    const existing = redis ? await redis.get(`customer:${uid}`) : null;
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

                    // Dual Write
                    await Promise.all([
                        dualWriteSubscription(uid, 'active', redis),
                        dualWriteProfile(uid, profile, redis),
                        stripeCustomerId && redis ? redis.set(`stripe:${stripeCustomerId}`, uid, { ex: CUSTOMER_TTL }) : Promise.resolve()
                    ]);

                    if (resend && email) {
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
                                    </div>
                                `
                            });
                        } catch (emailErr) {
                            console.error('[Stripe] Email error:', emailErr.message);
                        }
                    }
                }
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                if (redis && stripeCustomerId) {
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        const status = subscription.status;
                        const isActive = status === 'active' || status === 'trialing';

                        await dualWriteSubscription(uid, isActive ? 'active' : status, redis);

                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.subscriptionStatus = status;
                            existing.subscriptionId = subscription.id;
                            await dualWriteProfile(uid, existing, redis);
                        }
                    }
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                if (redis && stripeCustomerId) {
                    const uid = await redis.get(`stripe:${stripeCustomerId}`);
                    if (uid) {
                        await dualWriteSubscription(uid, 'cancelled', redis);
                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.subscriptionStatus = 'cancelled';
                            existing.cancelledAt = new Date().toISOString();
                            await dualWriteProfile(uid, existing, redis);
                        }
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
                        await dualWriteSubscription(uid, 'active', redis);
                        const existing = await redis.get(`customer:${uid}`);
                        if (existing && typeof existing === 'object') {
                            existing.lastPaymentAt = new Date().toISOString();
                            existing.subscriptionStatus = 'active';
                            await dualWriteProfile(uid, existing, redis);
                        }
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
