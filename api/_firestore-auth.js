/**
 * Authenticated Firestore REST API Client
 * Works on both Edge and Node.js runtimes (no firebase-admin dependency).
 *
 * Uses the service account private key (FIREBASE_SERVICE_ACCOUNT env var)
 * to generate a JWT → exchange for OAuth2 access token → call Firestore REST.
 */

// ── Token Cache ──
let cachedToken = null;
let tokenExpiry = 0;

const PROJECT_ID = (() => {
    try {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
        return sa.project_id || process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    } catch {
        return process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    }
})();

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── Base64url helpers (Edge-compatible, no Buffer) ──

function base64urlEncode(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlEncodeBytes(uint8) {
    let binary = '';
    for (const b of uint8) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── PEM parsing ──

function pemToArrayBuffer(pem) {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// ── JWT Signing with Web Crypto (Edge-compatible) ──

async function createSignedJWT(email, privateKeyPem) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: email,
        sub: email,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: exp,
        scope: 'https://www.googleapis.com/auth/datastore',
    };

    const headerB64 = base64urlEncode(JSON.stringify(header));
    const payloadB64 = base64urlEncode(JSON.stringify(payload));
    const unsignedToken = `${headerB64}.${payloadB64}`;

    // Import the private key
    const keyBuffer = pemToArrayBuffer(privateKeyPem);
    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        keyBuffer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Sign
    const encoder = new TextEncoder();
    const signatureBuffer = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        encoder.encode(unsignedToken)
    );

    const signatureB64 = base64urlEncodeBytes(new Uint8Array(signatureBuffer));
    return `${unsignedToken}.${signatureB64}`;
}

// ── OAuth2 Token Exchange ──

async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && tokenExpiry > now + 60_000) {
        return cachedToken;
    }

    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!saJson) {
        console.error('[Firestore] FIREBASE_SERVICE_ACCOUNT env var is missing');
        return null;
    }

    try {
        const sa = JSON.parse(saJson);
        const jwt = await createSignedJWT(sa.client_email, sa.private_key);

        const resp = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        if (!resp.ok) {
            const err = await resp.text();
            console.error('[Firestore] Token exchange failed:', err);
            return null;
        }

        const data = await resp.json();
        cachedToken = data.access_token;
        tokenExpiry = now + (data.expires_in || 3600) * 1000;
        return cachedToken;
    } catch (err) {
        console.error('[Firestore] Token generation error:', err);
        return null;
    }
}

// ── Firestore Value Converters ──

function toFirestoreValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
        return Number.isInteger(value)
            ? { integerValue: String(value) }
            : { doubleValue: value };
    }
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(toFirestoreValue) } };
    }
    if (typeof value === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(value)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
}

function fromFirestoreValue(value) {
    if ('stringValue' in value) return value.stringValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return parseInt(value.integerValue, 10);
    if ('doubleValue' in value) return value.doubleValue;
    if ('nullValue' in value) return null;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) {
        return (value.arrayValue.values || []).map(fromFirestoreValue);
    }
    if ('mapValue' in value) {
        return fromFirestoreFields(value.mapValue.fields);
    }
    return null;
}

function fromFirestoreFields(fields) {
    if (!fields) return {};
    const result = {};
    for (const [key, value] of Object.entries(fields)) {
        result[key] = fromFirestoreValue(value);
    }
    return result;
}

function toFirestoreFields(obj) {
    const fields = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            fields[key] = toFirestoreValue(value);
        }
    }
    return fields;
}

// ── Public API ──

/**
 * Get a document from Firestore.
 * @param {string} collection - e.g. 'subscriptions'
 * @param {string} docId - e.g. the user UID
 * @returns {Promise<object|null>}
 */
export async function getFirestoreDoc(collection, docId) {
    if (!PROJECT_ID) return null;

    const token = await getAccessToken();
    const url = `${FIRESTORE_BASE}/${collection}/${docId}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
        const resp = await fetch(url, { headers });
        if (resp.status === 404) return null;
        if (!resp.ok) {
            console.error('[Firestore] GET error:', resp.status, await resp.text());
            return null;
        }
        const data = await resp.json();
        return fromFirestoreFields(data.fields);
    } catch (err) {
        console.error('[Firestore] GET failed:', err.message);
        return null;
    }
}

/**
 * Create or overwrite a document in Firestore (merge-like via PATCH).
 * @param {string} collection
 * @param {string} docId
 * @param {object} data - plain JS object
 * @returns {Promise<boolean>}
 */
export async function setFirestoreDoc(collection, docId, data) {
    if (!PROJECT_ID) return false;

    const token = await getAccessToken();
    if (!token) {
        console.error('[Firestore] Cannot write: no access token');
        return false;
    }

    // Add server timestamp
    data.updatedAt = new Date().toISOString();

    const fields = toFirestoreFields(data);
    const url = `${FIRESTORE_BASE}/${collection}/${docId}`;

    try {
        const resp = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
        });

        if (!resp.ok) {
            console.error('[Firestore] PATCH error:', resp.status, await resp.text());
            return false;
        }
        return true;
    } catch (err) {
        console.error('[Firestore] PATCH failed:', err.message);
        return false;
    }
}

/**
 * Query documents by a single field.
 * @param {string} collection
 * @param {string} field
 * @param {string} op - 'EQUAL', 'LESS_THAN', etc.
 * @param {*} value
 * @returns {Promise<Array<{id: string, data: object}>>}
 */
export async function queryFirestore(collection, field, op, value) {
    if (!PROJECT_ID) return [];

    const token = await getAccessToken();
    if (!token) return [];

    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

    const structuredQuery = {
        from: [{ collectionId: collection }],
        where: {
            fieldFilter: {
                field: { fieldPath: field },
                op: op,
                value: toFirestoreValue(value),
            },
        },
        limit: 1,
    };

    try {
        const resp = await fetch(queryUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ structuredQuery }),
        });

        if (!resp.ok) {
            console.error('[Firestore] Query error:', resp.status, await resp.text());
            return [];
        }

        const results = await resp.json();
        return results
            .filter(r => r.document)
            .map(r => {
                const name = r.document.name;
                const id = name.split('/').pop();
                return { id, data: fromFirestoreFields(r.document.fields) };
            });
    } catch (err) {
        console.error('[Firestore] Query failed:', err.message);
        return [];
    }
}
