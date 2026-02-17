import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Showcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            OPERATIONAL <span className="text-indigo-400">VISIBILITY</span>
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            Gain a strategic advantage with our real-time global intelligence dashboard.
                            Monitor conflicts, assets, and economic shifts from a single command center.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                    className="relative perspective-1000"
                >
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700/50 shadow-2xl bg-zinc-900/50 backdrop-blur-sm group">
                        {/* Browser Bar Mockup */}
                        <div className="h-8 bg-zinc-800/80 border-b border-zinc-700 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-electric-500/20 border border-electric-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            <div className="ml-4 flex-1 max-w-2xl h-5 bg-zinc-900/50 rounded text-[10px] flex items-center px-3 text-zinc-500 font-mono">
                                https://app.geonexus.io/dashboard/global-view
                            </div>
                        </div>

                        {/* Image Container */}
                        <div className="aspect-[16/9] relative overflow-hidden">
                            {/* Placeholder until screenshot is captured */}
                            <img
                                src="/assets/dashboard_real.png"
                                alt="GeoNexus Dashboard Interface"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                onError={(e) => {
                                    // Fallback if image doesn't exist yet
                                    e.currentTarget.src = "https://placehold.co/1920x1080/1a1a1a/666?text=Dashboard+Loading...";
                                }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-20" />
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500" />
                </motion.div>
            </div>
        </section>
    );
}
