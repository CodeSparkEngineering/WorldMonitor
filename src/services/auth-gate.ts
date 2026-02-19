import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Waits for Firebase Auth to initialize and returns the current user.
 * Added a timeout to prevent hanging.
 */
export function waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
        // Set a timeout as a safety net (5 seconds)
        const timeout = setTimeout(() => {
            console.warn('[Auth] Auth check timed out. Proceeding as guest.');
            unsubscribe();
            resolve(null);
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            clearTimeout(timeout);
            unsubscribe();
            // DEVELOPER BYPASS: Mock user on localhost if no real user
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (!user && isLocalhost) {
                console.log('[Auth] No user found on localhost. Providing mock operative for testing.');
                resolve({ uid: 'dev-guest', email: 'guest@geonexus.local' } as any);
                return;
            }
            resolve(user);
        });
    });
}

export function isAuthenticated(): boolean {
    return !!auth.currentUser;
}

export async function checkAuthentication(): Promise<boolean> {
    const path = window.location.pathname;
    // Handle Vercel clean URLs and base path
    const isLandingPage = path === '/' || path === '/landing' || path === '/index.html' || path === '/landing.html';

    console.log(`[Auth] Checking path: ${path} (isLanding: ${isLandingPage})`);

    // Skip auth check on specific bypass pages
    if (path.includes('/success') || path.includes('/subscribe')) {
        return true;
    }

    const user = await waitForAuth();

    if (!user) {
        console.log('[Auth] No user found - redirecting to landing if necessary');
        if (!isLandingPage) {
            window.location.href = '/';
            return false;
        }
        return true;
    }

    // If logged in, check subscription
    try {
        // DEVELOPER BYPASS: Allow full access on localhost or if in dev mode
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isDevMode = import.meta.env.DEV;

        if (isLocalhost || isDevMode || user.uid === 'dev-guest') {
            console.log('[Auth] Developer bypass active - skipping subscription check');
            return true;
        }

        const response = await fetch(`/api/check-subscription?uid=${user.uid}`);
        if (!response.ok) {
            console.error('[Auth] Subscription API error:', response.status);
            if (!isLandingPage) {
                toast.error('AUTHENTICATION SYSTEM ERROR. REDIRECTING...');
                await new Promise(r => setTimeout(r, 2000));
                window.location.href = '/';
                return false;
            }
            return true;
        }

        const data = await response.json();

        if (!data.active) {
            console.log('[Auth] No active subscription found');
            if (!isLandingPage) {
                toast.warning('NO ACTIVE SUBSCRIPTION DETECTED. REDIRECTING TO PRICING...');
                // Wait for toast to be visible
                await new Promise(r => setTimeout(r, 2500));
                window.location.href = '/#pricing';
                return false;
            }
            return true;
        } else {
            console.log('[Auth] Subscription active:', data.status);
            // REMOVED AUTO-REDIRECT FROM LANDING: 
            // Users can stay on landing page even if subscribed.
            // They must click "Access Terminal" to enter the app.
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
