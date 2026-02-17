import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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

export async function checkAuthentication(): Promise<void> {
    const path = window.location.pathname;

    // Skip auth check on specific bypass pages
    if (path.includes('/success') || path.includes('/subscribe')) {
        return;
    }

    const user = await waitForAuth();

    if (!user) {
        console.log('[Auth] No user found - redirecting to landing');
        if (!path.includes('landing.html')) {
            window.location.href = '/landing.html';
        }
        return;
    }

    // If logged in, check subscription
    try {
        const response = await fetch(`/api/check-subscription?uid=${user.uid}`);
        if (!response.ok) {
            console.error('[Auth] Subscription API error:', response.status);
            if (!path.includes('landing.html')) {
                window.location.href = '/landing.html';
            }
            return;
        }

        const data = await response.json();

        if (!data.active) {
            console.log('[Auth] No active subscription found');
            if (!path.includes('landing.html')) {
                window.location.href = '/landing.html#pricing';
            }
        } else {
            console.log('[Auth] Subscription active:', data.status);
            if (path.includes('landing.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('force_landing') !== 'true') {
                    window.location.href = '/';
                }
            }
        }
    } catch (error) {
        console.error('[Auth] Subscription check failed:', error);
        // Fail CLOSED for security - if we can't verify, don't allow access
        if (!path.includes('landing.html')) {
            window.location.href = '/landing.html';
        }
    }
}
