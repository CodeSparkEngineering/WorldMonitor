import 'dotenv/config';

const UPSTASH_REDIS_REST_URL = 'https://internal-slug-38091.upstash.io';
const UPSTASH_REDIS_REST_TOKEN = 'AZTLAAIncDFhMmRmMTYyYjg0YzI0NmRiYTU0OGU3MDIyMDcwMDcyZHAxMzgwOTE';

async function checkRedis() {
    // Check the email code
    const email = 'codespark.dev@proton.me';

    const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/email:${email}`, {
        headers: { 'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const data = await res.json();
    console.log('Lookup by email:', data);

    // If we found a UID, look up the info
    if (data.result) {
        const uid = data.result;
        console.log('Found UID:', uid);

        const subRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/sub:${uid}`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
        });
        console.log('Subscription status:', await subRes.json());

        const custRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/customer:${uid}`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
        });
        console.log('Customer profile:', await custRes.json());
    }
}

checkRedis();
