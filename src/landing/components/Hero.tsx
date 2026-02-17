import { motion } from 'framer-motion';
import { Radio, Crosshair, ChevronRight } from 'lucide-react';
import DashboardMockup from './DashboardMockup';
import TacticalGlobe from './TacticalGlobe';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 pt-16">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            {/* Dynamic Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-200/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-200"></span>
                        </span>
                        <span className="font-mono text-yellow-200 text-xs tracking-[0.3em] uppercase">System_Linked // Secure_Node</span>
                    </div>

                    <div className="relative group">
                        {/* Brackets */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-200/20 group-hover:border-yellow-200/50 transition-colors" />
                        <div className="absolute -top-4 -right-4 w-2 h-8 border-t-2 border-r-2 border-yellow-200/10" />

                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                            GEO<span className="text-yellow-200">NEXUS</span><br />
                            <span className="text-4xl md:text-6xl font-light text-gray-500 tracking-normal">STRATEGIC_OSINT</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg border-l-2 border-yellow-200/30 pl-6 italic">
                            The ultimate command center for real-time geopolitical intelligence and strategic situational awareness.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="#pricing" className="group bg-yellow-200 text-zinc-900 px-10 py-5 rounded-sm font-black text-sm tracking-widest hover:bg-yellow-100 transition-all flex items-center justify-center gap-3 no-underline uppercase">
                            <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            Initialize_Feed
                        </a>
                        <a href="#features" className="group border border-zinc-700 text-gray-400 px-10 py-5 rounded-sm font-black text-sm tracking-widest hover:border-yellow-200/50 hover:text-white transition-all flex items-center justify-center gap-3 backdrop-blur no-underline uppercase">
                            View_Tech_Spec
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>

                {/* Right Column: Visual/UI Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    {/* Tactical Globe Background - Moved to background with lower opacity */}
                    <div className="absolute -top-20 -right-20 w-[500px] h-[500px] z-0 opacity-20 hidden lg:block pointer-events-none">
                        <TacticalGlobe />
                    </div>

                    {/* Main "Screen" Container (The Window) */}
                    <motion.div
                        whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                        style={{ perspective: 1000 }}
                        className="relative z-10 bg-zinc-900/40 backdrop-blur-xl rounded-lg border border-zinc-800 p-2 shadow-2xl overflow-hidden"
                    >
                        <DashboardMockup />
                    </motion.div>

                    {/* Decorative Elements (Restored) */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 border-t-2 border-r-2 border-yellow-200/30 z-0" />
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 border-b-2 border-l-2 border-yellow-200/30 z-0" />

                    {/* Scanning Text Overlay */}
                    <div className="absolute -bottom-6 right-0 font-mono text-[10px] text-yellow-200/40 tracking-widest hidden lg:block">
                        STRATEGIC_SURVEILLANCE_INITIALIZED_001
                    </div>
                </motion.div>
            </div>

            {/* Bottom Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2"
            >
                <span className="font-mono text-xs tracking-widest">SCROLL_FOR_INTEL</span>
                <Radio className="w-4 h-4 text-yellow-200" />
            </motion.div>
        </section >
    );
}
