import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { Zap, Globe, BrainCircuit } from 'lucide-react';

export default function ValueProposition() {
    const { t } = useLanguage();

    const features = [
        {
            icon: <BrainCircuit className="w-8 h-8 text-electric-500" />,
            titleKey: 'value_prop.predictive.title',
            descKey: 'value_prop.predictive.desc'
        },
        {
            icon: <Globe className="w-8 h-8 text-blue-500" />,
            titleKey: 'value_prop.global.title',
            descKey: 'value_prop.global.desc'
        },
        {
            icon: <Zap className="w-8 h-8 text-amber-500" />,
            titleKey: 'value_prop.speed.title',
            descKey: 'value_prop.speed.desc'
        }
    ];

    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        {t('value_prop.title_prefix')} <span className="text-electric-500">{t('value_prop.title_suffix')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 max-w-2xl mx-auto text-lg"
                    >
                        {t('value_prop.subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-electric-500/50 transition-colors group"
                        >
                            <div className="bg-zinc-950 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-800">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{t(feature.titleKey)}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {t(feature.descKey)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
