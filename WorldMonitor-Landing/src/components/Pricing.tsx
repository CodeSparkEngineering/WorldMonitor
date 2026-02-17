"use client";

import { motion } from 'framer-motion';
import { Check, Shield, Server } from 'lucide-react';
import clsx from 'clsx';

export default function Pricing() {
  const tiers = [
    {
      name: "ANALYST_ACCESS",
      price: "$19.90",
      period: "/MONTH",
      description: "Complete access to the WorldMonitor intelligence platform.",
      features: [
        "Real-time 3D Globe Visualization",
        "Live Conflict & Event Alerts",
        "Maritime & Aerial Asset Tracking",
        "AI-Driven Narrative Detection",
        "Satellite Reconnaissance Feeds",
        "Exportable Intelligence Reports"
      ],
      cta: "INITIATE CLEARANCE",
      highlight: true
    },
    {
      name: "SYSTEM_ACQUISITION",
      price: "CUSTOM",
      period: "",
      description: "Purchase the complete source code and infrastructure for your organization.",
      features: [
        "Full Source Code License",
        "On-Premise / Private Cloud Deployment",
        "Custom Data Integrations",
        "White Labeling Options",
        "Dedicated Engineering Support",
        "Lifetime Updates"
      ],
      cta: "CONTACT SALES",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-surface-100/50 relative">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-border-highlight to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-signal-yellow text-sm tracking-widest uppercase mb-2 block">Clearance Levels</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ACCESS <span className="text-signal-yellow">PROTOCOLS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose between monthly intelligence access or full system acquisition for sovereign control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                "relative p-8 rounded-lg border transition-all duration-300 flex flex-col",
                tier.highlight
                  ? "bg-surface-200 border-signal-yellow shadow-[0_0_30px_rgba(254,240,138,0.1)] scale-105 z-10"
                  : "bg-surface-100 border-border-dim hover:border-border-highlight"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal-yellow text-black text-xs font-bold px-3 py-1 rounded-full font-mono">
                  POPULAR_CHOICE
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                {tier.highlight ? <Shield className="w-5 h-5 text-signal-yellow" /> : <Server className="w-5 h-5 text-gray-500" />}
                <h3 className="font-mono text-lg text-white font-bold tracking-wider">{tier.name}</h3>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white tracking-tight">{tier.price}</span>
                <span className="ml-2 text-gray-500 text-sm font-mono">{tier.period}</span>
              </div>

              <p className="text-gray-400 text-sm mb-8 border-b border-border-dim pb-8 flex-grow">
                {tier.description}
              </p>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className={clsx("w-5 h-5 mr-3 flex-shrink-0", tier.highlight ? "text-signal-yellow" : "text-gray-600")} />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={clsx(
                "w-full py-4 rounded-sm font-bold text-sm tracking-wider transition-all font-mono",
                tier.highlight
                  ? "bg-signal-yellow text-black hover:bg-yellow-300"
                  : "bg-surface-300 text-white hover:bg-surface-400 hover:text-white"
              )}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
