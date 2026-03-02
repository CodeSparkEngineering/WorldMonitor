import admin from 'firebase-admin';

/**
 * Initializes and returns the Firebase Admin SDK.
 * Uses a singleton pattern to prevent multiple initializations.
 */
export function getFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin;
    }

    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountVar) {
        console.error('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT is missing!');
        return null;
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('[Firebase Admin] Initialized successfully.');
        return admin;
    } catch (error) {
        console.error('[Firebase Admin] Initialization failed:', error);
        return null;
    }
}

/**
 * Helper to update both Redis and Firestore for subscription status.
 */
export async function dualWriteSubscription(uid, status, redis) {
    const db = getFirebaseAdmin()?.firestore();

    const promises = [];

    // 1. Redis Write (Legacy/Edge)
    if (redis) {
        promises.push(redis.set(`sub:${uid}`, status, { ex: 32 * 24 * 60 * 60 }));
    }

    // 2. Firestore Write (New)
    if (db) {
        promises.push(db.collection('subscriptions').doc(uid).set({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true }));
    }

    await Promise.all(promises);
}

/**
 * Helper to update both Redis and Firestore for customer profile.
 */
export async function dualWriteProfile(uid, profile, redis) {
    const db = getFirebaseAdmin()?.firestore();
    const CUSTOMER_TTL = 365 * 24 * 60 * 60; // 1 year

    const promises = [];

    // 1. Redis Write
    if (redis) {
        promises.push(redis.set(`customer:${uid}`, profile, { ex: CUSTOMER_TTL }));
    }

    // 2. Firestore Write
    if (db) {
        promises.push(db.collection('customers').doc(uid).set({
            ...profile,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true }));
    }

    await Promise.all(promises);
}
