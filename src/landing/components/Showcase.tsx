import { useState, useEffect } from 'react';
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
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
    };

    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}>

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

                {/* Carousel Main Stage */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Browser Mockup Frame */}
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700/50 shadow-2xl bg-zinc-900/50 backdrop-blur-sm group transition-all duration-300 hover:border-electric-500/30 hover:shadow-electric-500/10 hover:shadow-2xl">
                        {/* Browser Bar */}
                        <div className="h-10 bg-zinc-800/80 border-b border-zinc-700 flex items-center px-4 gap-2 justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-electric-500/20 border border-electric-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="flex-1 max-w-2xl mx-4 h-6 bg-zinc-900/50 rounded text-[10px] flex items-center px-3 text-zinc-500 font-mono justify-center border border-white/5">
                                <span className="text-electric-500 mr-2">🔒 https://</span>
                                app.geonexus.live/dashboard/{SCREENSHOTS[currentIndex]?.title.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                            <div className="w-16 flex justify-end">
                                <Maximize2 size={14} className="text-zinc-600" />
                            </div>
                        </div>

                        {/* Image Area */}
                        <div className="aspect-[16/9] relative bg-zinc-950 overflow-hidden group">
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={currentIndex}
                                    src={SCREENSHOTS[currentIndex]?.src}
                                    alt={SCREENSHOTS[currentIndex]?.title}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full object-contain bg-zinc-950"
                                />
                            </AnimatePresence>

                            {/* Caption Overlay - Always visible on mobile, hover on desktop */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24 text-center md:text-left md:flex md:items-end md:justify-between">
                                <motion.div
                                    key={`text-${currentIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="max-w-3xl"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                                        <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
                                        {SCREENSHOTS[currentIndex]?.title}
                                    </h3>
                                    <p className="text-zinc-300 text-sm md:text-base">{SCREENSHOTS[currentIndex]?.desc}</p>
                                </motion.div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-electric-500 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-electric-400 group/btn"
                            >
                                <ChevronLeft size={24} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-electric-500 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-electric-400 group/btn"
                            >
                                <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails Navigation */}
                    <div className="grid grid-cols-3 gap-4 mt-6 px-2 md:px-0">
                        {SCREENSHOTS.map((shot, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 group ${idx === currentIndex
                                    ? 'border-electric-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10'
                                    : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                                    }`}
                            >
                                <div className="aspect-video bg-zinc-900 relative">
                                    <img
                                        src={shot.src}
                                        alt={shot.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Active Overlay */}
                                    {idx === currentIndex && (
                                        <div className="absolute inset-0 bg-electric-500/10 mix-blend-overlay" />
                                    )}
                                </div>
                                <div className={`px-2 py-1.5 text-[10px] md:text-xs font-mono text-center truncate w-full ${idx === currentIndex ? 'bg-electric-900/80 text-white' : 'bg-zinc-900 text-zinc-500'
                                    }`}>
                                    {shot.title}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
