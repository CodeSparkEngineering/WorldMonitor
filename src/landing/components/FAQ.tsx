import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const questions = [
        'faq.pricing',
        'faq.sources',
        'faq.accuracy',
        'faq.security',
        'faq.api'
    ];

    return (
        <section className="py-24 bg-zinc-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        {t('faq.title_prefix')} <span className="text-electric-500">{t('faq.title_suffix')}</span>
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-900/50 transition-colors"
                            >
                                <span className="font-semibold text-white/90 text-lg">
                                    {t(`${q}.question`)}
                                </span>
                                {openIndex === idx ? (
                                    <Minus className="w-5 h-5 text-electric-500 flex-shrink-0 ml-4" />
                                ) : (
                                    <Plus className="w-5 h-5 text-zinc-500 flex-shrink-0 ml-4" />
                                )}
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-zinc-400 border-t border-zinc-900/50 pt-4 leading-relaxed">
                                            {t(`${q}.answer`)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
