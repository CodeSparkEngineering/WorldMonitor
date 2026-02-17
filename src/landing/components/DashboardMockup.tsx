import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function DashboardMockup() {
    return (
        <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl group">
            {/* 1. Main Dashboard Screenshot (The base layer) */}
            <motion.div
                className="absolute inset-0 z-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <img
                    src="/assets/dashboard_real.png"
                    alt="GeoNexus Dashboard"
                    className="w-full h-full object-cover opacity-100"
                    onError={(e) => {
                        console.error("Hero Mockup Image load failed");
                        e.currentTarget.style.display = 'none';
                    }}
                />
                {/* Fallback if image fails or is loading */}
                <div className="absolute inset-0 bg-zinc-950 -z-10" />
            </motion.div>

            {/* 2. Top Bar UI (Z-Index 30) */}
            <div className="absolute top-0 w-full h-8 bg-black/60 backdrop-blur-md border-b border-white/5 flex items-center px-4 justify-between z-30">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                    <div className="w-2 h-2 rounded-full bg-green-500/30" />
                </div>
                <div className="font-mono text-[9px] text-zinc-500 tracking-[0.3em] font-bold">
                    STRATEGIC_COMMAND_LINK_ESTABLISHED
                </div>
                <div className="flex gap-2 items-center">
                    <Activity className="w-3 h-3 text-yellow-200/50 animate-pulse" />
                </div>
            </div>

            {/* 3. HUD Overlays (Z-Index 10) */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {/* HUD Scan Line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-200/[0.03] to-transparent h-[100%] w-full animate-[scan_8s_linear_infinite]" />

                {/* Corner Labels (Animated HUD) */}
                <motion.div
                    className="absolute top-12 left-6 p-2 border-l border-yellow-200/10"
                    whileHover={{ x: 10, y: 10 }}
                >
                    <div className="text-[8px] font-mono text-zinc-500 uppercase">Input_Source</div>
                    <div className="text-[10px] font-mono text-yellow-200/60 font-bold">LIVE_SAT_FEED</div>
                </motion.div>

                {/* Reticle Overlay */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-48 h-48 border border-white/5 rounded-full flex items-center justify-center">
                        <div className="w-32 h-32 border border-yellow-200/10 rounded-full animate-pulse" />
                    </div>
                </motion.div>
            </div>

            {/* 4. CRT Fine Grain Effect (Z-Index 20) */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
}
