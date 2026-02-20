import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ValueProposition from './components/ValueProposition';
import FAQ from './components/FAQ';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import SourcesMarquee from './components/SourcesMarquee';
import NetworkBackground from './components/NetworkBackground';
import Showcase from './components/Showcase';
import { LanguageProvider } from './i18n/LanguageContext';

export default function LandingPage() {
    return (
        <LanguageProvider>
            <div className="min-h-screen bg-zinc-950 font-sans text-gray-100 selection:bg-electric-500/30">
                <NetworkBackground />
                <Navbar />
                <Hero />
                <SourcesMarquee />
                <Features />
                <ValueProposition />
                <Showcase />
                <Pricing />
                <FAQ />
                <Footer />
                <SpeedInsights />
            </div>
        </LanguageProvider>
    );
}
