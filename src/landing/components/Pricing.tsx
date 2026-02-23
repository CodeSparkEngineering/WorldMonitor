import { motion } from 'framer-motion';
import { Check, Shield, Server, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '../../services/auth';
import { useLanguage } from '../i18n/LanguageContext';

export default function Pricing() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const { t } = useLanguage();

    const tiers = [
        {
            name: t('pricing.tiers.analyst.name'),
            price: billingCycle === 'monthly' ? "$9.99" : "$79.99",
            period: billingCycle === 'monthly' ? t('pricing.tiers.analyst.period_month') : t('pricing.tiers.analyst.period_year'),
            description: t('pricing.tiers.analyst.desc'),
            features: t('pricing.tiers.analyst.features'),
            cta: t('pricing.tiers.analyst.cta'),
            highlight: true,
            savings: billingCycle === 'annual' ? t('pricing.save') : null
        },
        {
            name: t('pricing.tiers.system.name'),
            price: t('pricing.tiers.system.price'),
            period: "",
            description: t('pricing.tiers.system.desc'),
            features: t('pricing.tiers.system.features'),
            cta: t('pricing.tiers.system.cta'),
            highlight: false
        }
    ];

    const handleSubscribe = async (plan: string) => {
        if (plan === "CUSTOM") {
            window.open("https://wa.me/message/D4VY7QSTGWJXO1", "_blank");
            return;
        }

        setLoadingPlan(plan);

        // Get Price ID from env (exposed via vite.config.ts)
        const priceId = billingCycle === 'monthly'
            ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID
            : import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID;

        if (!priceId) {
            console.error('Price ID missing for plan:', plan, billingCycle);
            toast.error('SUBSCRIPTION CONFIG ERROR. CONTACT SUPPORT.');
            setLoadingPlan(null);
            return;
        }

        try {
            // Get current user UID for fulfillment tracking
            const user = authService.getUser();

            // Open new window immediately to avoid popup blockers
            const newWindow = window.open('', '_blank');

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
                if (newWindow) {
                    newWindow.location.href = data.url;
                } else {
                    // Fallback if blocked
                    window.location.href = data.url;
                }
            } else {
                if (newWindow) newWindow.close();
                console.error('No URL returned:', data);
                toast.error(`CHECKOUT FAILED: ${data.error || 'Unknown error'}`);
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
                    <span className="font-mono text-electric-500 text-sm tracking-widest uppercase mb-2 block">{t('pricing.label')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('pricing.title_prefix')} <span className="text-electric-500">{t('pricing.title_suffix')}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        {t('pricing.description')}
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-6 bg-zinc-900/80 p-2 rounded-full border border-zinc-800 inline-flex mx-auto backdrop-blur-sm">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-mono font-bold transition-all duration-300",
                                billingCycle === 'monthly'
                                    ? "bg-zinc-800 text-electric-400 shadow-lg shadow-electric-500/10 border border-zinc-700"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            {t('pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-mono font-bold transition-all duration-300 flex items-center gap-2",
                                billingCycle === 'annual'
                                    ? "bg-electric-600 text-white shadow-lg shadow-electric-500/20 border border-electric-500"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            {t('pricing.annual')}
                            <span className={clsx(
                                "text-[10px] px-1.5 py-0.5 rounded border",
                                billingCycle === 'annual'
                                    ? "bg-white/20 border-white/20 text-white"
                                    : "bg-electric-500/10 border-electric-500/30 text-electric-400"
                            )}>
                                {t('pricing.save')}
                            </span>
                        </button>
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
                                "relative p-8 rounded-xl border transition-all duration-300 flex flex-col group",
                                tier.highlight
                                    ? "bg-zinc-900/80 border-electric-500 shadow-[0_0_40px_rgba(0,128,255,0.15)] scale-105 z-10"
                                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60"
                            )}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full font-mono shadow-[0_0_20px_rgba(0,128,255,0.4)] tracking-wider whitespace-nowrap">
                                    RECOMMENDED
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className={clsx(
                                    "p-3 rounded-lg",
                                    tier.highlight ? "bg-electric-500/10" : "bg-zinc-800"
                                )}>
                                    {tier.highlight ? <Shield className="w-6 h-6 text-electric-400" /> : <Server className="w-6 h-6 text-gray-400 group-hover:text-gray-200 transition-colors" />}
                                </div>
                                <h3 className={clsx(
                                    "font-mono text-xl font-bold tracking-wider",
                                    tier.highlight ? "text-white" : "text-gray-300 group-hover:text-white transition-colors"
                                )}>{tier.name}</h3>
                            </div>

                            <div className="flex items-baseline mb-8">
                                <span className={clsx(
                                    "text-5xl font-bold tracking-tight",
                                    tier.highlight ? "text-white text-shadow-glow" : "text-gray-200"
                                )}>{tier.price}</span>
                                <span className="ml-2 text-gray-500 text-sm font-mono">{tier.period}</span>
                            </div>

                            <p className="text-gray-400 text-sm mb-8 border-b border-zinc-800 pb-8 flex-grow leading-relaxed">
                                {tier.description}
                            </p>

                            <ul className="space-y-4 mb-8">
                                {(tier.features as string[]).map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className={clsx(
                                            "mt-0.5 mr-3 flex-shrink-0 rounded-full p-0.5",
                                            tier.highlight ? "bg-electric-500/20 text-electric-400" : "bg-zinc-800 text-gray-500 group-hover:text-gray-300"
                                        )}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(index === 1 ? "CUSTOM" : tier.name)}
                                disabled={loadingPlan === tier.name}
                                aria-busy={loadingPlan === tier.name}
                                className={clsx(
                                    "w-full py-4 rounded-lg font-bold text-sm tracking-widest transition-all font-mono flex items-center justify-center gap-2 relative overflow-hidden group/btn",
                                    tier.highlight
                                        ? "bg-gradient-to-r from-electric-600 via-electric-500 to-electric-600 text-white shadow-[0_0_20px_rgba(0,128,255,0.4)] hover:shadow-[0_0_35px_rgba(0,128,255,0.6)] border border-electric-400"
                                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white border border-zinc-700 hover:border-zinc-600"
                                )}>
                                {/* Button Shine Effect for Premium Tier */}
                                {tier.highlight && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] w-full h-full" />
                                )}

                                <span className="relative z-10 flex items-center gap-2">
                                    {loadingPlan === tier.name ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {t('pricing.processing')}
                                        </>
                                    ) : (
                                        <>
                                            {tier.cta}
                                            {tier.highlight && <span className="text-xs opacity-70 ml-1">→</span>}
                                        </>
                                    )}
                                </span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
