// Authentication Gate
// Checks if user has valid subscription before allowing access

export function checkAuthentication(): void {
    // Skip auth check on subscribe/success pages
    if (window.location.pathname.includes('/subscribe') || window.location.pathname.includes('/success')) {
        return;
    }

    try {
        const stored = localStorage.getItem('geonexus_user');
        if (!stored) {
            // No user data - redirect to subscribe
            console.log('[Auth] No user data found - redirecting to subscribe');
            window.location.href = '/subscribe.html';
            return;
        }

        const user = JSON.parse(stored);

        // Check if subscription is active
        if (user.subscriptionStatus === 'active') {
            console.log('[Auth] User has active subscription');
            return;
        }

        // Check if trial is still valid
        if (user.subscriptionStatus === 'trial' && user.trialEndsAt) {
            if (Date.now() < user.trialEndsAt) {
                const daysLeft = Math.ceil((user.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000));
                console.log(`[Auth] User has ${daysLeft} days left in trial`);
                return;
            } else {
                console.log('[Auth] Trial expired');
            }
        }

        // No valid subscription - redirect
        console.log('[Auth] No valid subscription found - redirecting');
        window.location.href = '/subscribe.html';
    } catch (error) {
        console.error('[Auth] Error checking authentication:', error);
        window.location.href = '/subscribe.html';
    }
}
