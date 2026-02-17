"use client";

import { Activity, Github, Twitter, Linkedin, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-100 border-t border-border-dim pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-mono text-xl tracking-tighter text-white block mb-6">
              WORLD<span className="text-signal-yellow">MONITOR</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Democratizing high-grade geopolitical intelligence. access the same tools used by defense contractors and hedge funds.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded w-fit border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SYSTEM STATUS: ONLINE
            </div>
          </div>

          <div>
            <h4 className="font-mono text-white font-bold mb-6">INTELLIGENCE</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Live Map</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">OSINT Feeds</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Satellite Imagery</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Conflict Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-white font-bold mb-6">COMPANY</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">About Codespark</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Methodology</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-signal-yellow transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-white font-bold mb-6">CONNECT</h4>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="text-gray-400 hover:text-signal-yellow transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-signal-yellow transition-colors"><Github className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-signal-yellow transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
            <div className="text-xs text-gray-600 font-mono">
              ENCRYPTED CONNECTION<br />
              256-BIT AES GLBA
            </div>
          </div>
        </div>

        <div className="border-t border-border-dim pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} CodeSpark Engineering. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
