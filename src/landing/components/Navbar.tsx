import { motion } from 'framer-motion';
import { Activity, Menu, X, Globe, LogOut, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

import LoginModal from './LoginModal';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { authService } from '../../services/auth';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const { t, language, setLanguage } = useLanguage();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const languages: { code: Language; label: string }[] = [
        { code: 'en', label: 'EN' },
        { code: 'pt', label: 'PT' },
        { code: 'es', label: 'ES' }
    ];

    const handleLogout = async () => {
        await authService.logout();
    };

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
                            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-mono text-xl tracking-tighter text-white no-underline">
                                GEO<span className="text-electric-500">NEXUS</span>
                                <span className="ml-2 text-xs bg-zinc-700 px-1 py-0.5 rounded text-gray-300">{t('navbar.beta_tag')}</span>
                            </a>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8 font-mono text-sm">
                                <a href="#features" className="text-gray-400 hover:text-electric-500 transition-colors hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] no-underline">{t('navbar.intel_feed')}</a>

                                <a href="#pricing" className="text-gray-400 hover:text-electric-500 transition-colors hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] no-underline">{t('navbar.subscription')}</a>

                                <div className="flex items-center gap-2 border-l border-zinc-700 pl-6">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className={`text-xs font-bold transition-colors ${language === lang.code ? 'text-electric-500' : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>

                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => window.location.href = 'https://app.geonexus.live/'}
                                            className="bg-electric-500 text-white px-4 py-2 rounded-sm font-bold hover:bg-electric-400 transition-all no-underline cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,128,255,0.3)]"
                                        >
                                            <Terminal className="w-4 h-4" />
                                            DASHBOARD
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                            title="Sign Out"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        className="bg-electric-500/10 border border-electric-500 text-electric-500 px-4 py-2 rounded-sm font-bold hover:bg-electric-500 hover:text-white transition-all no-underline cursor-pointer shadow-[0_0_20px_rgba(0,128,255,0.2)] hover:shadow-[0_0_30px_rgba(0,128,255,0.4)]"
                                    >
                                        {t('navbar.access_terminal')}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="md:hidden flex items-center gap-4">
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
                        <div className="px-4 pt-2 pb-6 space-y-4 font-mono">
                            <div className="space-y-1">
                                <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-electric-500 no-underline" onClick={() => setIsOpen(false)}>{t('navbar.intel_feed')}</a>
                                <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-electric-500 no-underline" onClick={() => setIsOpen(false)}>{t('navbar.subscription')}</a>
                            </div>

                            {/* Mobile Language Selector */}
                            <div className="px-3 py-2 border-t border-zinc-800 pt-4">
                                <div className="flex items-center gap-4">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <div className="flex gap-6">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code)}
                                                className={`text-sm font-bold transition-colors ${language === lang.code ? 'text-electric-500' : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-3 pt-2 space-y-3">
                                {user ? (
                                    <>
                                        <button
                                            className="block w-full text-center px-4 py-3 bg-electric-500 text-white font-bold no-underline rounded-sm flex items-center justify-center gap-2"
                                            onClick={() => window.location.href = 'https://app.geonexus.live/'}
                                        >
                                            <Terminal className="w-4 h-4" />
                                            DASHBOARD
                                        </button>
                                        <button
                                            className="block w-full text-center px-4 py-3 bg-zinc-800 text-gray-400 font-bold no-underline rounded-sm flex items-center justify-center gap-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleLogout();
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            SIGN OUT
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="block w-full text-center px-4 py-3 bg-electric-500/10 border border-electric-500 text-electric-500 font-bold no-underline rounded-sm"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsLoginOpen(true);
                                        }}
                                    >
                                        {t('navbar.access_terminal')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}

