"use client";

import { motion } from 'framer-motion';
import { Shield, Radio, Activity, Globe } from 'lucide-react';

export default function DashboardMockup() {
    return (
        <div className="relative w-full aspect-video bg-surface-100 rounded-lg overflow-hidden border border-border-dim shadow-2xl group">
            {/* --- Top Bar --- */}
            <div className="absolute top-0 w-full h-8 bg-surface-200 border-b border-border-dim flex items-center px-3 justify-between z-20">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="font-mono text-[10px] text-gray-500 tracking-widest">
                    SECURE_CONNECTION_ESTABLISHED
                </div>
                <div className="flex gap-2">
                    <Activity className="w-3 h-3 text-signal-yellow animate-pulse" />
                </div>
            </div>

            {/* --- Main Content (Map) --- */}
            <div className="absolute inset-0 pt-8 bg-surface-100 relative">
                {/* Abstract Map SVG Background */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simplified World Map Shape (Placeholder for complex SVG) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Globe className="w-3/4 h-3/4 text-gray-700 stroke-1" />
                </div>

                {/* --- Data Overlays --- */}

                {/* Top Left: Signal Strength */}
                <div className="absolute top-12 left-4 bg-black/40 backdrop-blur-sm p-3 border border-border-dim rounded">
                    <div className="text-[9px] font-mono text-gray-400 mb-1">SIGNAL_STRENGTH</div>
                    <div className="flex gap-1 h-3 items-end">
                        <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 bg-signal-yellow/50" />
                        <motion.div animate={{ height: ["60%", "30%", "60%"] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 bg-signal-yellow/50" />
                        <motion.div animate={{ height: ["80%", "90%", "80%"] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 bg-signal-yellow/50" />
                        <motion.div animate={{ height: ["50%", "70%", "50%"] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1 bg-signal-yellow/50" />
                    </div>
                </div>

                {/* Bottom Right: Coordinates */}
                <div className="absolute bottom-4 right-4 text-right">
                    <div className="text-[10px] font-mono text-signal-yellow">
                        <span className="opacity-50">LAT:</span> 34.0522 N <br />
                        <span className="opacity-50">LNG:</span> 118.2437 W
                    </div>
                </div>

                {/* Center: Scanning Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 border border-signal-yellow/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <div className="w-40 h-40 border border-dotted border-signal-yellow/30 rounded-full" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CrosshairIcon />
                    </div>
                </div>

                {/* Floating Integelligence Nodes */}
                <motion.div
                    className="absolute top-[30%] left-[20%] w-32 bg-black/60 backdrop-blur border-l-2 border-red-500 p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                >
                    <div className="text-[8px] text-red-400 font-bold mb-1">ALERT: CYBER THREAT</div>
                    <div className="w-full h-1 bg-gray-800 rounded overflow-hidden">
                        <div className="h-full bg-red-500 w-[80%]" />
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-[20%] right-[30%] w-32 bg-black/60 backdrop-blur border-l-2 border-signal-yellow p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 1, delay: 2 }}
                >
                    <div className="text-[8px] text-signal-yellow font-bold mb-1">DATA UPLINK</div>
                    <div className="font-mono text-[8px] text-gray-300">PACKETS/SEC: 4,021</div>
                </motion.div>
            </div>

            {/* Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-signal-yellow/5 to-transparent h-[100%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />
        </div>
    );
}

function CrosshairIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-signal-yellow/50">
            <line x1="12" y1="0" x2="12" y2="24" />
            <line x1="0" y1="12" x2="24" y2="12" />
        </svg>
    )
}
