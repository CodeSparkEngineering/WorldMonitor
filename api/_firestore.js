/**
 * Firestore REST API Utility for Vercel Edge Runtime
 * Since firebase-admin is too heavy for Edge, we use the REST API.
 */

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

/**
 * Gets a document from Firestore using the REST API.
 * @param {string} collection - Collection name (e.g., 'users')
 * @param {string} docId - Document ID (e.g., uid)
 * @returns {Promise<object|null>} The document data or null if not found
 */
export async function getFirestoreDoc(collection, docId) {
    if (!PROJECT_ID) {
        console.error('[Firestore] Project ID missing');
        return null;
    }

    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

    try {
        const response = await fetch(url);
        if (response.status === 404) return null;
        if (!response.ok) {
            const error = await response.json();
            console.error('[Firestore] Fetch error:', error);
            return null;
        }

        const data = await response.json();
        return parseFirestoreFields(data.fields);
    } catch (error) {
        console.error('[Firestore] Connection error:', error);
        return null;
    }
}

/**
 * Updates or Creates a document in Firestore using the REST API.
 * NOTE: This requires a Service Account token for write operations.
 * For now, this is a skeleton for when the token logic is added.
 */
export async function setFirestoreDoc(collection, docId, data) {
    // TODO: Implement authenticated write if needed.
    // Most users stay with Redis for writes if they don't want to manage Service Account tokens in Edge.
    console.warn('[Firestore] Write not implemented yet. Still using Redis for writes.');
    return false;
}

/**
 * Helper to parse Firestore's complex "fields" object into a simple JS object.
 */
function parseFirestoreFields(fields) {
    if (!fields) return {};
    const result = {};
    for (const [key, value] of Object.entries(fields)) {
        if ('stringValue' in value) result[key] = value.stringValue;
        else if ('booleanValue' in value) result[key] = value.booleanValue;
        else if ('integerValue' in value) result[key] = parseInt(value.integerValue);
        else if ('doubleValue' in value) result[key] = value.doubleValue;
        else if ('timestampValue' in value) result[key] = value.timestampValue;
        else if ('mapValue' in value) result[key] = parseFirestoreFields(value.mapValue.fields);
        // Add more types as needed
    }
    return result;
}
