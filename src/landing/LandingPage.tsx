import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Trust from './components/Trust';
import NetworkBackground from './components/NetworkBackground';
import Showcase from './components/Showcase';

export default function LandingPage() {
    return (
        <div className="bg-zinc-950 text-gray-50 min-h-screen selection:bg-yellow-200 selection:text-black">
            <NetworkBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Hero />
                    <Trust />
                    <Features />
                    <Showcase />
                    <Pricing />
                </main>
                <Footer />
            </div>
        </div>
    );
}
