import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ArrowRight, Loader2, UserPlus, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { auth, googleProvider } from '../../lib/firebase';
import { useLanguage } from '../i18n/LanguageContext';
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

async function checkSubscriptionAndRedirect(uid: string, email: string, isNewUser: boolean, t: (path: string) => string) {
    try {
        console.log(`[AuthDebug] Starting check for ${email} (UID: ${uid})`);

        // ADMIN BYPASS: Bypass subscription check for specific admin emails
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());

        if (email && adminEmails.includes(email.toLowerCase())) {
            console.log('[AuthDebug] Admin login bypass triggered.');
            toast.success(t('auth.toasts.adminAccess'));
            setTimeout(() => { window.location.href = '/app'; }, 800);
            return;
        }

        const response = await fetch(`/api/check-subscription?uid=${uid}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log(`[AuthDebug] Subscription Status:`, data);

        if (data.active) {
            console.log('[AuthDebug] Active user. Redirecting to /app');
            toast.success(t('auth.toasts.accessGranted'));
            setTimeout(() => { window.location.href = '/app'; }, 800);
        } else {
            console.log('[AuthDebug] Inactive user. Redirecting to checkout...');
            if (isNewUser) {
                toast.success(t('auth.toasts.identityCreatedCheckout'));
            } else {
                toast.info(t('auth.toasts.noSubCheckout'));
            }

            try {
                const pendingPlan = sessionStorage.getItem('pendingPlan');
                const priceId = pendingPlan === 'annual'
                    ? import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID
                    : import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID;

                console.log(`[AuthDebug] Initiating Checkout Session for ${priceId}`);

                const res = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceId, uid: uid, email: email })
                });
                const checkoutData = await res.json();

                if (checkoutData.url) {
                    console.log('[AuthDebug] Redirecting to Stripe:', checkoutData.url);
                    setTimeout(() => { window.location.href = checkoutData.url; }, 800);
                } else {
                    throw new Error(checkoutData.error || 'Failed to generate checkout URL');
                }
            } catch (e) {
                console.error('[AuthDebug] Checkout session creation failed:', e);
                toast.error('Payment system error. Redirecting to pricing.');
                setTimeout(() => {
                    window.location.href = '/#pricing';
                }, 1500);
            }
        }
    } catch (err) {
        console.error('[AuthDebug] Critical check error:', err);
        toast.error('Identity verified. Please select a plan to continue.');
        setTimeout(() => {
            window.location.href = '/#pricing';
        }, 1500);
    }
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { t, language } = useLanguage();
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
                await checkSubscriptionAndRedirect(cred.user.uid, email, true, t);
            } else {
                const cred = await signInWithEmailAndPassword(auth, email, password);
                await saveCustomerProfile(cred.user.uid, email, cred.user.displayName, 'email', 'login');
                await checkSubscriptionAndRedirect(cred.user.uid, email, false, t);
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            let msg = t('auth.toasts.authFailed');
            if (error.code === 'auth/invalid-credential') msg = t('auth.toasts.invalidCreds');
            if (error.code === 'auth/user-not-found') msg = t('auth.toasts.userNotFound');
            if (error.code === 'auth/email-already-in-use') msg = t('auth.toasts.emailInUse');
            if (error.code === 'auth/weak-password') msg = t('auth.toasts.weakPassword');
            if (error.code === 'auth/too-many-requests') msg = t('auth.toasts.tooManyRequests');
            if (error.code === 'auth/invalid-email') msg = t('auth.toasts.invalidEmail');
            toast.error(msg);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            auth.languageCode = language || 'en';
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const isNew = user.metadata.creationTime === user.metadata.lastSignInTime;

            await saveCustomerProfile(user.uid, user.email!, user.displayName, 'google', isNew ? 'register' : 'login');

            if (isNew) {
                toast.success(t('auth.toasts.googleCreated'));
            } else {
                toast.success(t('auth.toasts.googleConfirmed'));
            }

            await checkSubscriptionAndRedirect(user.uid, user.email!, isNew, t);
        } catch (error: any) {
            console.error('Google auth error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error(t('auth.toasts.googleFailed'));
            }
            setGoogleLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            toast.error(t('auth.toasts.enterEmailFirst'));
            return;
        }
        setLoading(true);
        try {
            auth.languageCode = language || 'en';
            await sendPasswordResetEmail(auth, email);
            toast.success(t('auth.toasts.resetLinkSent'));
            setIsResetting(false);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                toast.error(t('auth.toasts.noOperativeEmail'));
            } else {
                toast.error(t('auth.toasts.resetFailed'));
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
                                {isResetting ? t('auth.resetTitle') : isRegistering ? t('auth.registerTitle') : t('auth.loginTitle')}
                            </h2>
                            <p className="text-center text-zinc-500 text-sm mb-6 font-mono">
                                {isResetting
                                    ? t('auth.resetSubtitle')
                                    : isRegistering
                                        ? t('auth.registerSubtitle')
                                        : t('auth.loginSubtitle')}
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
                                            {t('auth.authenticating')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            {t('auth.continueGoogle')}
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Divider */}
                            {!isResetting && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-zinc-800" />
                                    <span className="text-xs text-zinc-600 font-mono">{t('auth.or')}</span>
                                    <div className="flex-1 h-px bg-zinc-800" />
                                </div>
                            )}

                            <form onSubmit={isResetting ? (e) => { e.preventDefault(); handlePasswordReset(); } : handleAuth} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-1 ml-1">
                                        {isResetting ? t('auth.emailLabelReset') : t('auth.emailLabel')}
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
                                            placeholder={t('auth.emailPlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>

                                {!isResetting && (
                                    <div>
                                        <label htmlFor="password" className="block text-xs font-mono text-zinc-400 mb-1 ml-1">{t('auth.passwordLabel')}</label>
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
                                            {t('auth.forgotPassword')}
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
                                            {isResetting ? t('auth.btnSending') : isRegistering ? t('auth.btnRegistering') : t('auth.authenticating')}
                                        </>
                                    ) : (
                                        <>
                                            {isResetting ? t('auth.btnReset') : isRegistering ? t('auth.btnRegister') : t('auth.btnLogin')}
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
                                        {t('auth.backToLogin')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsRegistering(!isRegistering)}
                                        className="text-xs font-mono text-zinc-500 hover:text-electric-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        {isRegistering ? (
                                            <>{t('auth.alreadyHaveIdentity')}</>
                                        ) : (
                                            <>
                                                <UserPlus className="w-3 h-3" />
                                                {t('auth.noIdentity')}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                                    {t('auth.restricted')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
