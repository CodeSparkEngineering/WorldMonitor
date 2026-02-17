import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDpnCGNijgQdn7cZ6qmOP41_hFX9TYYLE4",
    authDomain: "geonexus-monitor.firebaseapp.com",
    projectId: "geonexus-monitor",
    storageBucket: "geonexus-monitor.firebasestorage.app",
    messagingSenderId: "296898600975",
    appId: "1:296898600975:web:e1a2f7181e182489e7837a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
