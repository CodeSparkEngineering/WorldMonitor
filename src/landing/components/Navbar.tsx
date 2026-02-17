import { motion } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

import LoginModal from './LoginModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 w-full z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-electric-500 animate-pulse" />
                            <a href="/" className="font-mono text-xl tracking-tighter text-white no-underline">
                                GEO<span className="text-electric-500">NEXUS</span>
                                <span className="ml-2 text-xs bg-zinc-700 px-1 py-0.5 rounded text-gray-300">BETA v2.4</span>
                            </a>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8 font-mono text-sm">
                                <a href="#features" className="text-gray-400 hover:text-electric-500 transition-colors hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] no-underline">INTEL_FEED</a>
                                <a href="#features" className="text-gray-400 hover:text-electric-500 transition-colors hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] no-underline">LIVE_MAP</a>
                                <a href="#pricing" className="text-gray-400 hover:text-electric-500 transition-colors hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] no-underline">SUBSCRIPTION</a>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="bg-electric-500/10 border border-electric-500 text-electric-500 px-4 py-2 rounded-sm font-bold hover:bg-electric-500 hover:text-white transition-all no-underline cursor-pointer shadow-[0_0_20px_rgba(0,128,255,0.2)] hover:shadow-[0_0_30px_rgba(0,128,255,0.4)]"
                                >
                                    ACCESS_TERMINAL
                                </button>
                            </div>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
                                {isOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden bg-zinc-900/90 backdrop-blur border-b border-zinc-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-mono">
                            <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-electric-500 no-underline" onClick={() => setIsOpen(false)}>INTEL_FEED</a>
                            <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-electric-500 no-underline" onClick={() => setIsOpen(false)}>SUBSCRIPTION</a>
                            <button
                                className="block w-full text-left px-3 py-2 text-electric-500 font-bold no-underline"
                                onClick={() => { setIsOpen(false); setIsLoginOpen(true); }}
                            >
                                ACCESS_TERMINAL
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
