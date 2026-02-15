// Simple Authentication Service
// Manages user authentication state using localStorage

export interface User {
    email: string;
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    subscriptionId?: string;
    trialEndsAt?: number;
}

class AuthService {
    private static instance: AuthService;
    private user: User | null = null;
    private listeners: Set<(user: User | null) => void> = new Set();

    private constructor() {
        this.loadUser();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private loadUser(): void {
        try {
            const stored = localStorage.getItem('geonexus_user');
            if (stored) {
                this.user = JSON.parse(stored);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('[Auth] Failed to load user:', error);
        }
    }

    private saveUser(): void {
        try {
            if (this.user) {
                localStorage.setItem('geonexus_user', JSON.stringify(this.user));
            } else {
                localStorage.removeItem('geonexus_user');
            }
            this.notifyListeners();
        } catch (error) {
            console.error('[Auth] Failed to save user:', error);
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.user));
    }

    getUser(): User | null {
        return this.user;
    }

    isAuthenticated(): boolean {
        if (!this.user) return false;

        // Check if subscription is active
        if (this.user.subscriptionStatus === 'active') return true;

        // Check if trial is still valid
        if (this.user.subscriptionStatus === 'trial' && this.user.trialEndsAt) {
            return Date.now() < this.user.trialEndsAt;
        }

        return false;
    }

    setUser(user: User): void {
        this.user = user;
        this.saveUser();
    }

    logout(): void {
        this.user = null;
        this.saveUser();
    }

    subscribe(listener: (user: User | null) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // Start a 7-day trial
    startTrial(email: string): void {
        const trialEndsAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        this.setUser({
            email,
            subscriptionStatus: 'trial',
            trialEndsAt,
        });
    }

    // Activate subscription after payment
    activateSubscription(email: string, subscriptionId: string): void {
        this.setUser({
            email,
            subscriptionStatus: 'active',
            subscriptionId,
        });
    }
}

export const authService = AuthService.getInstance();
