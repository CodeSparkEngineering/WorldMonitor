import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
try {
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        throw new Error('VITE_FIREBASE_API_KEY is missing. Check your environment variables.');
    }
    app = initializeApp(firebaseConfig);
} catch (error) {
    console.error('Firebase initialization failed:', error);
    // Create a dummy app to prevent export errors, though functionality will be broken
    app = { delete: () => Promise.resolve() } as any;
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
