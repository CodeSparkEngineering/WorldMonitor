"use client";

import { motion } from 'framer-motion';
import { Radio, Crosshair, ChevronRight } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-signal-yellow/5 rounded-full blur-[100px] animate-pulse" />
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-yellow"></span>
            </span>
            <span className="font-mono text-signal-yellow text-sm tracking-widest uppercase">System Status: Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-yellow to-yellow-600">SITUATIONAL</span> AWARENESS
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg border-l-2 border-signal-yellow/30 pl-6">
            Advanced geopolitical intelligence dashboard for real-time conflict tracking, market analysis, and strategic forecasting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-signal-yellow text-surface-100 px-8 py-4 rounded-sm font-bold text-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2">
              <Crosshair className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              INITIATE_MONITORING
            </button>
            <button className="border border-surface-300 text-gray-300 px-8 py-4 rounded-sm font-bold text-lg hover:border-signal-yellow hover:text-signal-yellow transition-all flex items-center justify-center gap-2 glass-panel">
              VIEW_DEMO_DATA
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Visual/UI Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main "Screen" Container */}
          <div className="relative z-10 glass-panel rounded-lg border border-border-dim p-2 shadow-2xl">
            <DashboardMockup />
          </div>

          {/* Decorative Elements behind screen */}
          <div className="absolute -top-10 -right-10 w-24 h-24 border-t-2 border-r-2 border-signal-yellow/30" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 border-b-2 border-l-2 border-signal-yellow/30" />
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs tracking-widest">SCROLL_FOR_INTEL</span>
        <Radio className="w-4 h-4 text-signal-yellow" />
      </motion.div>
    </section>
  );
}
