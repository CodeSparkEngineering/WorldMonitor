import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Waits for Firebase Auth to initialize and returns the current user.
 * Added a timeout to prevent hanging.
 */
export function waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.warn('[Auth] Auth check timed out. Proceeding as guest.');
            resolve(null);
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            clearTimeout(timeout);
            unsubscribe();
            resolve(user);
        });
    });
}

export function isAuthenticated(): boolean {
    return !!auth.currentUser;
}

export async function checkAuthentication(): Promise<boolean> {
    const path = window.location.pathname;
    const hostname = window.location.hostname;

    // Subdomain identification (Detect if user is on app. subdomain)
    const isAppDomain = hostname.startsWith('app.') ||
        (hostname.includes('vercel.app') && !hostname.startsWith('geonexus-monitor.vercel.app')) ||
        (hostname === 'localhost' && path === '/dashboard'); // Local dev helper

    // Handle Vercel clean URLs and base path
    const isLandingPath = path === '/' || path === '/index.html' ||
        path.startsWith('/tech') || path.startsWith('/finance') ||
        path.startsWith('/financial');

    // A page is considered the Landing Page ONLY if it's a landing path AND NOT on the app subdomain
    const isLandingPage = isLandingPath && !isAppDomain;

    console.log(`[Auth] Checking path: ${path} on ${hostname} (isLanding: ${isLandingPage}, isAppDomain: ${isAppDomain})`);

    // Skip auth check on specific bypass pages
    if (path.includes('/success') || path.includes('/subscribe')) {
        return true;
    }

    const user = await waitForAuth();

    if (!user) {
        if (!isLandingPage) {
            console.log('[AuthGate] Not on landing page. Redirecting to /');
            window.location.href = '/';
            return false;
        }
        return true;
    }

    // If logged in, check subscription
    try {
        // ADMIN BYPASS: Bypass subscription check for specific admin emails
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
            console.log('[Auth] Admin bypass triggered for:', user.email);
            return true;
        }

        const response = await fetch(`/api/check-subscription?uid=${user.uid}`);
        if (!response.ok) {
            console.error('[Auth] Subscription API error:', response.status);
            if (isLandingPage) {
                console.log('[AuthGate] API Error on landing page. Blocking auto-redirect.');
                toast.error('SUBSCRIPTION SERVICE UNAVAILABLE. PLEASE TRY AGAIN LATER.');
                return false;
            }
            toast.error('AUTHENTICATION SYSTEM ERROR. REDIRECTING...');
            await new Promise(r => setTimeout(r, 2000));
            window.location.href = '/';
            return false;
        }

        const data = await response.json();

        if (!data.active) {
            console.log('[Auth] No active subscription found');
            if (!isLandingPage) {
                toast.warning('NO ACTIVE SUBSCRIPTION DETECTED. REDIRECTING TO PRICING...');
                // Wait for toast to be visible
                await new Promise(r => setTimeout(r, 2500));
                console.log('[AuthGate] Needs subscription. Redirecting to /#pricing');
                window.location.href = '/#pricing';
                return false;
            }
            return true;
        } else {
            console.log('[Auth] Subscription active:', data.status);
            // If user is on landing and has active subscription, let them stay
            // They can click "Access Terminal" to go to /app
            // The LoginModal handles smart redirect after login
            return true;
        }
    } catch (error) {
        console.error('[Auth] Subscription check failed:', error);
        // Fail CLOSED for security
        if (!isLandingPage) {
            toast.error('CONNECTION ERROR. SECURE ACCESS REQUIRED.');
            await new Promise(r => setTimeout(r, 2000));
            window.location.href = '/';
            return false;
        }
        return true;
    }
}
