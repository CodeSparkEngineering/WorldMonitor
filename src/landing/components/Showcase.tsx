import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const SCREENSHOTS = [
    {
        src: '/screenshots/dashboard-map.png',
        title: 'Global Situation Awareness',
        desc: 'Real-time tracking of conflicts, military assets, and critical infrastructure.'
    },
    {
        src: '/screenshots/intel-feed.png',
        title: 'Live Intelligence Feed',
        desc: 'AI-curated news and alerts from thousands of sources worldwide.'
    },
    {
        src: '/screenshots/intel-modal.png',
        title: 'Deep Analysis',
        desc: 'AI-generated insights and velocity spikes for emerging threats.'
    },
    {
        src: '/screenshots/language-menu.png',
        title: 'Multi-Language Support',
        desc: 'Native support for 15+ languages including Arabic, Chinese, and Russian.'
    }
];

export default function Showcase() {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
    };

    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {t('showcase.title_prefix')} <span className="text-electric-400">{t('showcase.title_suffix')}</span>
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            {t('showcase.description')}
                        </p>
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Browser Mockup Frame */}
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700/50 shadow-2xl bg-zinc-900/50 backdrop-blur-sm group">
                        {/* Browser Bar */}
                        <div className="h-10 bg-zinc-800/80 border-b border-zinc-700 flex items-center px-4 gap-2 justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-electric-500/20 border border-electric-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="flex-1 max-w-2xl mx-4 h-6 bg-zinc-900/50 rounded text-[10px] flex items-center px-3 text-zinc-500 font-mono justify-center">
                                https://app.geonexus.io/dashboard/{SCREENSHOTS[currentIndex].title.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                            <div className="w-16" /> {/* Spacer for balance */}
                        </div>

                        {/* Image Area */}
                        <div className="aspect-[16/9] relative bg-zinc-900 overflow-hidden group">
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={currentIndex}
                                    src={SCREENSHOTS[currentIndex].src}
                                    alt={SCREENSHOTS[currentIndex].title}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full object-contain bg-zinc-900"
                                />
                            </AnimatePresence>

                            {/* Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 pt-24 text-center">
                                <motion.div
                                    key={`text-${currentIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-2">{SCREENSHOTS[currentIndex].title}</h3>
                                    <p className="text-zinc-300">{SCREENSHOTS[currentIndex].desc}</p>
                                </motion.div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-electric-500 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-electric-500 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {SCREENSHOTS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-electric-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
