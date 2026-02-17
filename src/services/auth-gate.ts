import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Waits for Firebase Auth to initialize and returns the current user.
 */
export function waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    // Skip auth check on specific bypass pages
    if (path.includes('/success') || path.includes('/subscribe')) {
        return true;
    }

    const user = await waitForAuth();

    if (!user) {
        console.log('[Auth] No user found - redirecting to landing');
        if (!path.includes('landing.html')) {
            window.location.href = '/landing.html';
            return false;
        }
        return true;
    }

    // If logged in, check subscription
    try {
        const response = await fetch(`/api/check-subscription?uid=${user.uid}`);
        if (!response.ok) {
            console.error('[Auth] Subscription API error:', response.status);
            if (!path.includes('landing.html')) {
                toast.error('AUTHENTICATION SYSTEM ERROR. REDIRECTING...');
                await new Promise(r => setTimeout(r, 2000));
                window.location.href = '/landing.html';
                return false;
            }
            return true;
        }

        const data = await response.json();

        if (!data.active) {
            console.log('[Auth] No active subscription found');
            if (!path.includes('landing.html')) {
                toast.warning('NO ACTIVE SUBSCRIPTION DETECTED. REDIRECTING TO PRICING...');
                // Wait for toast to be visible
                await new Promise(r => setTimeout(r, 2500));
                window.location.href = '/landing.html#pricing';
                return false;
            }
            return true;
        } else {
            console.log('[Auth] Subscription active:', data.status);
            if (path.includes('landing.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('force_landing') !== 'true') {
                    window.location.href = '/';
                    return false;
                }
            }
            return true;
        }
    } catch (error) {
        console.error('[Auth] Subscription check failed:', error);
        // Fail CLOSED for security
        if (!path.includes('landing.html')) {
            toast.error('CONNECTION ERROR. SECURE ACCESS REQUIRED.');
            await new Promise(r => setTimeout(r, 2000));
            window.location.href = '/landing.html';
            return false;
        }
        return true;
    }
}
