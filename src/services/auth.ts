import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

class AuthService {
    private static instance: AuthService;
    private user: User | null = null;
    private listeners: Set<(user: User | null) => void> = new Set();

    private constructor() {
        onAuthStateChanged(auth, (user) => {
            this.user = user;
            this.notifyListeners();
        });
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.user));
    }

    getUser(): User | null {
        return auth.currentUser;
    }

    isAuthenticated(): boolean {
        return !!auth.currentUser;
    }

    async logout(): Promise<void> {
        try {
            await signOut(auth);
            // Redirect to landing
            window.location.href = '/';
        } catch (error) {
            console.error('[Auth] Logout failed', error);
        }
    }

    subscribe(listener: (user: User | null) => void): () => void {
        this.listeners.add(listener);
        // Immediate callback with current state
        listener(this.user);
        return () => this.listeners.delete(listener);
    }
}

export const authService = AuthService.getInstance();
