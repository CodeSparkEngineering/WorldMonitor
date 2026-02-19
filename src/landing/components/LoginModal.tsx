import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success('IDENTITY CREATED. WELCOME, OPERATIVE.');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('IDENTITY CONFIRMED. ACCESS GRANTED.');
            }

            // Redirect based on intent
            setTimeout(() => {
                // If they just registered, they definitely need a plan.
                // If they logged in, they might also need one. 
                // Redirecting to #pricing is safer and faster than a full app boot + redirect.
                window.location.href = '/#pricing';
            }, 800);

        } catch (error: any) {
            console.error('Auth error:', error);
            let msg = 'AUTHENTICATION FAILED.';
            if (error.code === 'auth/invalid-credential') msg = 'INVALID CREDENTIALS.';
            if (error.code === 'auth/user-not-found') msg = 'OPERATIVE NOT FOUND.';
            if (error.code === 'auth/email-already-in-use') msg = 'IDENTITY ALREADY REGISTERED.';
            if (error.code === 'auth/weak-password') msg = 'PASSWORD SECURITY TOO LOW.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md p-8 rounded-lg shadow-2xl pointer-events-auto relative">
                            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 bg-electric-500/10 rounded-full flex items-center justify-center border border-electric-500/20">
                                    <Lock className="w-6 h-6 text-electric-500" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
                                {isRegistering ? 'NEW OPERATIVE REGISTRATION' : 'TERMINAL ACCESS'}
                            </h2>
                            <p className="text-center text-zinc-500 text-sm mb-8 font-mono">
                                {isRegistering ? 'Enter credentials to create your secure identity.' : 'Enter your credentials to access the dashboard.'}
                            </p>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-400 mb-1 ml-1">OPERATIVE ID / EMAIL</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 pl-10 text-white placeholder-zinc-600 focus:outline-none focus:border-electric-500/50 transition-colors font-mono"
                                            placeholder="operative@geonexus.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-400 mb-1 ml-1">PASSCODE</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 pl-10 text-white placeholder-zinc-600 focus:outline-none focus:border-electric-500/50 transition-colors font-mono"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-electric-500 text-white font-bold py-3 mt-6 rounded flex items-center justify-center gap-2 hover:bg-electric-400 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,128,255,0.3)] hover:shadow-[0_0_30px_rgba(0,128,255,0.5)]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {isRegistering ? 'REGISTERING...' : 'AUTHENTICATING...'}
                                        </>
                                    ) : (
                                        <>
                                            {isRegistering ? 'CREATE IDENTITY' : 'AUTHENTICATE'}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsRegistering(!isRegistering)}
                                    className="text-xs font-mono text-zinc-500 hover:text-electric-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    {isRegistering ? (
                                        <>ALREADY HAVE AN IDENTITY? LOGIN</>
                                    ) : (
                                        <>
                                            <UserPlus className="w-3 h-3" />
                                            NO IDENTITY? REGISTER NEW OPERATIVE
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                                    Restricted System. Unauthorized access is prohibited.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
