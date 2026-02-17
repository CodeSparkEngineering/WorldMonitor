"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass-panel border-b border-border-dim"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-signal-yellow animate-pulse" />
            <Link href="/" className="font-mono text-xl tracking-tighter text-white">
              WORLD<span className="text-signal-yellow">MONITOR</span>
              <span className="ml-2 text-[10px] bg-surface-300 px-1 py-0.5 rounded text-gray-300">BETA v2.4</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 font-mono text-sm">
              <Link href="#features" className="text-gray-400 hover:text-signal-yellow transition-colors hover:text-glow">INTEL_FEED</Link>
              <Link href="#features" className="text-gray-400 hover:text-signal-yellow transition-colors hover:text-glow">LIVE_MAP</Link>
              <Link href="#pricing" className="text-gray-400 hover:text-signal-yellow transition-colors hover:text-glow">SUBSCRIPTION</Link>
              <button className="bg-signal-yellow/10 border border-signal-yellow text-signal-yellow px-4 py-2 rounded-sm font-bold hover:bg-signal-yellow hover:text-black transition-all">
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
          className="md:hidden glass-panel border-b border-border-dim"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-mono">
            <Link href="#features" className="block px-3 py-2 text-gray-300 hover:text-signal-yellow">INTEL_FEED</Link>
            <Link href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-signal-yellow">SUBSCRIPTION</Link>
            <button className="w-full text-left px-3 py-2 text-signal-yellow font-bold">
              ACCESS_TERMINAL
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
