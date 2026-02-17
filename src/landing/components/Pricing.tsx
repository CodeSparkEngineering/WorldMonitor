import { motion } from 'framer-motion';
import { Check, Shield, Server, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '../../services/auth';

export default function Pricing() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const tiers = [
        {
            name: "ANALYST_ACCESS",
            price: billingCycle === 'monthly' ? "$19.90" : "$169.99",
            period: billingCycle === 'monthly' ? "/MONTH" : "/YEAR",
            description: "Complete access to the GeoNexus intelligence platform.",
            features: [
                "Real-time 3D Globe Visualization",
                "Live Conflict & Event Alerts",
                "Maritime & Aerial Asset Tracking",
                "AI-Driven Narrative Detection",
                "Satellite Reconnaissance Feeds",
                "Exportable Intelligence Reports"
            ],
            cta: "INITIATE CLEARANCE",
            highlight: true,
            savings: billingCycle === 'annual' ? "SAVE 30%" : null
        },
        {
            name: "SYSTEM_ACQUISITION",
            price: "CUSTOM",
            period: "",
            description: "Purchase the complete source code and infrastructure for your organization.",
            features: [
                "Full Source Code License",
                "On-Premise / Private Cloud Deployment",
                "Custom Data Integrations",
                "White Labeling Options",
                "Dedicated Engineering Support",
                "Lifetime Updates"
            ],
            cta: "CONTACT SALES",
            highlight: false
        }
    ];

    const handleSubscribe = async (plan: string) => {
        if (plan === "CUSTOM") {
            window.location.href = "mailto:codespark.dev@proton.me";
            return;
        }

        setLoadingPlan(plan);

        // Get Price ID from env (exposed via vite.config.ts)
        const priceId = billingCycle === 'monthly'
            ? (import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || (process.env as any).STRIPE_MONTHLY_PRICE_ID)
            : (import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID || (process.env as any).STRIPE_ANNUAL_PRICE_ID);

        if (!priceId) {
            console.error('Price ID missing for plan:', plan, billingCycle);
            toast.error('SUBSCRIPTION CONFIG ERROR. CONTACT SUPPORT.');
            setLoadingPlan(null);
            return;
        }

        try {
            // Get current user UID for fulfillment tracking
            const user = authService.getUser();

            // Call API to create session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    uid: user?.uid,
                    email: user?.email
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No URL returned:', data);
                toast.error('CHECKOUT FAILED. TRY AGAIN.');
                setLoadingPlan(null);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('CONNECTION ERROR. RETRYING...');
            setLoadingPlan(null);
        }
    };

    return (
        <section id="pricing" className="py-24 bg-zinc-900/50 relative">
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="font-mono text-yellow-200 text-sm tracking-widest uppercase mb-2 block">Clearance Levels</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        ACCESS <span className="text-yellow-200">PROTOCOLS</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Choose between monthly intelligence access or full system acquisition for sovereign control.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={clsx("text-sm font-mono font-bold transition-colors", billingCycle === 'monthly' ? "text-white" : "text-gray-500")}>MONTHLY</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                            className="w-14 h-7 bg-zinc-800 rounded-full border border-zinc-700 relative p-1 transition-colors hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-200/50"
                            role="switch"
                            aria-checked={billingCycle === 'annual'}
                        >
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-5 h-5 bg-yellow-200 rounded-full shadow-lg"
                                animate={{ x: billingCycle === 'annual' ? 26 : 0 }}
                            />
                        </button>
                        <span className={clsx("text-sm font-mono font-bold transition-colors", billingCycle === 'annual' ? "text-white" : "text-gray-500")}>
                            ANNUAL <span className="text-yellow-200 text-xs ml-1">(SAVE 30%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={clsx(
                                "relative p-8 rounded-lg border transition-all duration-300 flex flex-col",
                                tier.highlight
                                    ? "bg-zinc-800 border-yellow-200 shadow-[0_0_30px_rgba(254,240,138,0.1)] scale-105 z-10"
                                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200 text-black text-xs font-bold px-3 py-1 rounded-full font-mono">
                                    POPULAR_CHOICE
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                {tier.highlight ? <Shield className="w-5 h-5 text-yellow-200" /> : <Server className="w-5 h-5 text-gray-500" />}
                                <h3 className="font-mono text-lg text-white font-bold tracking-wider">{tier.name}</h3>
                            </div>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-white tracking-tight">{tier.price}</span>
                                <span className="ml-2 text-gray-500 text-sm font-mono">{tier.period}</span>
                            </div>

                            <p className="text-gray-400 text-sm mb-8 border-b border-zinc-800 pb-8 flex-grow">
                                {tier.description}
                            </p>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className={clsx("w-5 h-5 mr-3 flex-shrink-0", tier.highlight ? "text-yellow-200" : "text-gray-600")} />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(tier.price === "CUSTOM" ? "CUSTOM" : tier.name)}
                                disabled={loadingPlan === tier.name}
                                aria-busy={loadingPlan === tier.name}
                                className={clsx(
                                    "w-full py-4 rounded-sm font-bold text-sm tracking-wider transition-all font-mono flex items-center justify-center gap-2",
                                    tier.highlight
                                        ? "bg-yellow-200 text-black hover:bg-yellow-300 disabled:bg-yellow-200/50"
                                        : "bg-zinc-700 text-white hover:bg-zinc-600 hover:text-white disabled:bg-zinc-700/50"
                                )}>
                                {loadingPlan === tier.name ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        PROCESSING...
                                    </>
                                ) : (
                                    tier.cta
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
