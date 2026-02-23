import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ArrowRight, Loader2, UserPlus, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { auth, googleProvider } from '../../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

async function saveCustomerProfile(uid: string, email: string, displayName: string | null, provider: string, action: string) {
    try {
        await fetch('/api/customer-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, email, displayName, provider, action }),
        });
    } catch (e) {
        console.warn('[Auth] Failed to save customer profile:', e);
    }
}

async function checkSubscriptionAndRedirect(uid: string, isNewUser: boolean) {
    try {
        // ADMIN BYPASS: Bypass subscription check for specific admin emails
        const user = auth.currentUser;
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());

        if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
            console.log('[Auth] Admin login bypass triggered for:', user.email);
            toast.success('ADMINISTRATIVE ACCESS GRANTED.');
            setTimeout(() => { window.location.href = 'https://app.geonexus.live/'; }, 800);
            return;
        }

        const response = await fetch(`/api/check-subscription?uid=${uid}`);
        const data = await response.json();

        if (data.active) {
            toast.success('ACCESS GRANTED. ENTERING TERMINAL...');
            setTimeout(() => { window.location.href = 'https://app.geonexus.live/'; }, 800);
        } else {
            if (isNewUser) {
                toast.success('IDENTITY CREATED. SELECT YOUR ACCESS LEVEL.');
            } else {
                toast.info('NO ACTIVE SUBSCRIPTION. REDIRECTING TO PRICING...');
            }
            setTimeout(() => { window.location.href = '/#pricing'; }, 800);
        }
    } catch {
        // If check fails, default to pricing
        setTimeout(() => { window.location.href = '/#pricing'; }, 800);
    }
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await saveCustomerProfile(cred.user.uid, email, null, 'email', 'register');
                await checkSubscriptionAndRedirect(cred.user.uid, true);
            } else {
                const cred = await signInWithEmailAndPassword(auth, email, password);
                await saveCustomerProfile(cred.user.uid, email, cred.user.displayName, 'email', 'login');
                await checkSubscriptionAndRedirect(cred.user.uid, false);
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            let msg = 'AUTHENTICATION FAILED.';
            if (error.code === 'auth/invalid-credential') msg = 'INVALID CREDENTIALS.';
            if (error.code === 'auth/user-not-found') msg = 'OPERATIVE NOT FOUND.';
            if (error.code === 'auth/email-already-in-use') msg = 'IDENTITY ALREADY REGISTERED.';
            if (error.code === 'auth/weak-password') msg = 'PASSWORD SECURITY TOO LOW. MINIMUM 6 CHARACTERS.';
            if (error.code === 'auth/too-many-requests') msg = 'TOO MANY ATTEMPTS. WAIT BEFORE RETRYING.';
            if (error.code === 'auth/invalid-email') msg = 'INVALID EMAIL FORMAT.';
            toast.error(msg);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const isNew = user.metadata.creationTime === user.metadata.lastSignInTime;

            await saveCustomerProfile(user.uid, user.email!, user.displayName, 'google', isNew ? 'register' : 'login');

            if (isNew) {
                toast.success('IDENTITY CREATED VIA GOOGLE. WELCOME, OPERATIVE.');
            } else {
                toast.success('GOOGLE IDENTITY CONFIRMED. ACCESS GRANTED.');
            }

            await checkSubscriptionAndRedirect(user.uid, isNew);
        } catch (error: any) {
            console.error('Google auth error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error('GOOGLE AUTHENTICATION FAILED.');
            }
            setGoogleLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            toast.error('ENTER YOUR EMAIL FIRST.');
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('RESET LINK DISPATCHED. CHECK YOUR EMAIL.');
            setIsResetting(false);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                toast.error('NO OPERATIVE FOUND WITH THAT EMAIL.');
            } else {
                toast.error('FAILED TO SEND RESET LINK.');
            }
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
                                {isResetting ? 'RESET PASSCODE' : isRegistering ? 'GEONEXUS REGISTRATION' : 'GEONEXUS ACCESS'}
                            </h2>
                            <p className="text-center text-zinc-500 text-sm mb-6 font-mono">
                                {isResetting
                                    ? 'Enter your email to receive a reset link.'
                                    : isRegistering
                                        ? 'Create your secure identity for GeoNexus intelligence.'
                                        : 'Enter your credentials to access the GeoNexus terminal.'}
                            </p>

                            {/* Google Sign-In Button */}
                            {!isResetting && (
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading}
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white font-bold py-3 mb-4 rounded flex items-center justify-center gap-3 hover:bg-zinc-700 hover:border-zinc-600 transition-all disabled:opacity-50"
                                >
                                    {googleLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            AUTHENTICATING...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            CONTINUE WITH GOOGLE
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Divider */}
                            {!isResetting && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-zinc-800" />
                                    <span className="text-xs text-zinc-600 font-mono">OR</span>
                                    <div className="flex-1 h-px bg-zinc-800" />
                                </div>
                            )}

                            <form onSubmit={isResetting ? (e) => { e.preventDefault(); handlePasswordReset(); } : handleAuth} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-1 ml-1">
                                        {isResetting ? 'EMAIL' : 'OPERATIVE ID / EMAIL'}
                                    </label>
                                    <div className="relative">
                                        {isResetting
                                            ? <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            : <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        }
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 pl-10 text-white placeholder-zinc-600 focus:outline-none focus:border-electric-500/50 transition-colors font-mono"
                                            placeholder="operative@geonexus.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {!isResetting && (
                                    <div>
                                        <label htmlFor="password" className="block text-xs font-mono text-zinc-400 mb-1 ml-1">PASSCODE</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 pl-10 text-white placeholder-zinc-600 focus:outline-none focus:border-electric-500/50 transition-colors font-mono"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Forgot Password link (only on login view) */}
                                {!isRegistering && !isResetting && (
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => setIsResetting(true)}
                                            className="text-xs font-mono text-zinc-500 hover:text-electric-500 transition-colors"
                                        >
                                            FORGOT PASSCODE?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-electric-500 text-white font-bold py-3 mt-4 rounded flex items-center justify-center gap-2 hover:bg-electric-400 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,128,255,0.3)] hover:shadow-[0_0_30px_rgba(0,128,255,0.5)]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {isResetting ? 'SENDING...' : isRegistering ? 'REGISTERING...' : 'AUTHENTICATING...'}
                                        </>
                                    ) : (
                                        <>
                                            {isResetting ? 'SEND RESET LINK' : isRegistering ? 'CREATE IDENTITY' : 'AUTHENTICATE'}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                {isResetting ? (
                                    <button
                                        onClick={() => setIsResetting(false)}
                                        className="text-xs font-mono text-zinc-500 hover:text-electric-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        ← BACK TO LOGIN
                                    </button>
                                ) : (
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
                                )}
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
