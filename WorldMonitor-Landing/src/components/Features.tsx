"use client";

import { motion } from 'framer-motion';
import { Globe, Ship, Cpu, ShieldAlert, Satellite, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Global 3D Visualization",
      description: "Interactive WebGL globe visualizing real-time geopolitical events, borders, and conflict zones.",
      icon: <Globe className="w-8 h-8 text-signal-yellow" />,
      stat: "LATENCY < 50ms"
    },
    {
      title: "Maritime Asset Tracking",
      description: "Advanced AIS tracking for naval fleets and commercial shipping in high-risk zones.",
      icon: <Ship className="w-8 h-8 text-signal-yellow" />,
      stat: "24/7 MONITORING"
    },
    {
      title: "AI Narrative Detection",
      description: "NLP algorithms analyzing millions of sources to detect emerging propaganda and psyops.",
      icon: <Cpu className="w-8 h-8 text-signal-yellow" />,
      stat: "1M+ SOURCES"
    },
    {
      title: "Conflict Heatmaps",
      description: "Thermal overlays showing intensity of improved explosive events and troop movements.",
      icon: <ShieldAlert className="w-8 h-8 text-signal-yellow" />,
      stat: "LIVE UPDATES"
    },
    {
      title: "Satellite Imagery Analysis",
      description: "Automated change detection in high-resolution satellite feeds for infrastructure monitoring.",
      icon: <Satellite className="w-8 h-8 text-signal-yellow" />,
      stat: "0.5m RESOLUTION"
    },
    {
      title: "Strategic Alerts",
      description: "Instant push notifications for critical events affecting your defined assets or regions.",
      icon: <Zap className="w-8 h-8 text-signal-yellow" />,
      stat: "INSTANT PUSH"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background border-t border-border-dim relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-signal-yellow text-sm tracking-widest uppercase mb-2 block">System Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            INTELLIGENCE <span className="text-signal-yellow">MODULES</span>
          </h2>
          <div className="h-1 w-24 bg-signal-yellow mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 glass-panel rounded-lg hover:border-signal-yellow/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-[10px] text-gray-500 border border-gray-700 px-2 py-1 rounded">
                  {feature.stat}
                </span>
              </div>

              <div className="mb-6 p-4 bg-surface-200 rounded-lg w-fit group-hover:bg-signal-yellow/10 transition-colors">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-signal-yellow transition-colors font-mono">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Corner Accents */}
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-600 group-hover:border-signal-yellow transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-600 group-hover:border-signal-yellow transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
