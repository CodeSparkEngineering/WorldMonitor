// Temporary migration + debug endpoint
// DELETE THIS FILE after migration is complete

import { getFirestoreDoc, setFirestoreDoc } from './_firestore-auth.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { uid, status, debug } = await req.json();

        if (!uid || !status) {
            return new Response(JSON.stringify({ error: 'uid and status required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Debug mode: check if FIREBASE_SERVICE_ACCOUNT is present
        if (debug) {
            const saRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
            const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
            let saInfo = { present: false };
            if (saRaw) {
                try {
                    const sa = JSON.parse(saRaw);
                    saInfo = {
                        present: true,
                        project_id: sa.project_id,
                        client_email: sa.client_email,
                        has_private_key: !!sa.private_key,
                        private_key_length: sa.private_key?.length || 0,
                        private_key_start: sa.private_key?.substring(0, 30) || 'none',
                    };
                } catch (e) {
                    saInfo = { present: true, parseError: e.message, rawLength: saRaw.length, rawStart: saRaw.substring(0, 50) };
                }
            }
            return new Response(JSON.stringify({
                env: {
                    FIREBASE_SERVICE_ACCOUNT: saInfo,
                    FIREBASE_PROJECT_ID: projectId || 'missing',
                },
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Try to write
        const writeResult = await setFirestoreDoc('subscriptions', uid, { status });

        // Verify by reading back
        const readBack = await getFirestoreDoc('subscriptions', uid);

        return new Response(JSON.stringify({
            success: writeResult,
            uid,
            status,
            readBack: readBack || null,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
