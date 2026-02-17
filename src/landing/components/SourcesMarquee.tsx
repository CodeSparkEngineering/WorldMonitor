import { motion } from 'framer-motion';

const SOURCES = [
    { name: "NASA", type: "satellite", color: "text-blue-500" },
    { name: "CLOUDFLARE", type: "internet", color: "text-orange-500" },
    { name: "ACLED", type: "conflict", color: "text-red-500" },
    { name: "GDELT", type: "intelligence", color: "text-purple-400" },
    { name: "OpenSky", type: "aviation", color: "text-sky-300" },
    { name: "MarineTraffic", type: "maritime", color: "text-blue-300" },
    { name: "USGS", type: "seismic", color: "text-emerald-400" },
    { name: "NOAA", type: "weather", color: "text-cyan-400" },
    { name: "Polymarket", type: "prediction", color: "text-blue-500" },
    { name: "ReliefWeb", type: "humanitarian", color: "text-pink-400" },
    { name: "NetBlocks", type: "internet", color: "text-yellow-400" },
    { name: "Chainalysis", type: "crypto", color: "text-indigo-400" },
    { name: "IMF", type: "economic", color: "text-green-400" },
];

import { useLanguage } from '../i18n/LanguageContext';

export default function SourcesMarquee() {
    const { t } = useLanguage();

    return (
        <section className="py-12 bg-electric-950 border-b border-white/5 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <p className="text-sm font-mono text-electric-400 uppercase tracking-widest font-semibold glow-text">
                    {t('marquee.powered_by')}
                </p>
            </div>

            <div className="flex relative items-center">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-electric-950 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-electric-950 to-transparent z-10"></div>

                {/* Marquee Track */}
                <div className="flex overflow-hidden w-full select-none">
                    <motion.div
                        className="flex gap-16 items-center whitespace-nowrap py-4"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 40,
                        }}
                    >
                        {[...SOURCES, ...SOURCES, ...SOURCES].map((source, i) => (
                            <div key={i} className="flex items-center gap-3 group cursor-default">
                                <span className={`text-2xl font-bold font-mono ${source.color} filter drop-shadow-md transition-all duration-300`}>
                                    {source.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded border border-white/10 group-hover:border-electric-400/50 group-hover:text-electric-400 transition-all duration-300">
                                    {t(`marquee.types.${source.type.toLowerCase()}`)}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
