// Script to archive (deactivate) old USD Stripe prices
// Run with: STRIPE_SECRET_KEY=sk_live_xxx node scripts/archive-old-prices.js

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY env var is required.');
    console.error('   Usage: STRIPE_SECRET_KEY=sk_live_xxx node scripts/archive-old-prices.js');
    process.exit(1);
}

// All old price IDs to archive (live + test)
const OLD_PRICE_IDS = [
    // Live prices (USD) - from prices.json
    'price_1T1Edl1KwCpxLOqxEgkzcWAy', // $169.99/year
    'price_1T1Edk1KwCpxLOqxhJnReMuY', // $19.90/month
    'price_1T1EdN1KwCpxLOqxOn5xMrfi', // $169.99/year (duplicate product)
    'price_1T1EdM1KwCpxLOqxsfYTjUcC', // $19.90/month (duplicate product)
    // Current .env prices
    'price_1T465W1KwCpxLOqxtjiKbMUT', // current monthly in .env
    'price_1T465W1KwCpxLOqxSOPhuQUQ', // current annual in .env
    // Test prices
    'price_1T1cUO1YpKHTG4qGXo97oH5C', // test monthly
    'price_1T1cUP1YpKHTG4qGCquap6rH', // test annual
];

async function archivePrice(priceId) {
    const response = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ active: 'false' }),
    });

    if (!response.ok) {
        const error = await response.json();
        // Price might not exist in this mode (live vs test) - that's OK
        if (error.error?.code === 'resource_missing') {
            return { skipped: true, id: priceId, reason: 'not found (wrong mode?)' };
        }
        throw new Error(`Failed to archive ${priceId}: ${error.error?.message}`);
    }

    return { skipped: false, id: priceId, data: await response.json() };
}

async function main() {
    console.log('🗑️  Archiving old USD prices...\n');
    console.log(`Using key: ${STRIPE_SECRET_KEY.substring(0, 12)}...`);
    console.log(`Prices to archive: ${OLD_PRICE_IDS.length}\n`);

    let archived = 0;
    let skipped = 0;

    for (const priceId of OLD_PRICE_IDS) {
        try {
            const result = await archivePrice(priceId);
            if (result.skipped) {
                console.log(`⏭️  Skipped ${priceId} (${result.reason})`);
                skipped++;
            } else {
                console.log(`✅ Archived ${priceId}`);
                archived++;
            }
        } catch (error) {
            console.error(`❌ Error archiving ${priceId}:`, error.message);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Done! Archived: ${archived}, Skipped: ${skipped}`);
    console.log('='.repeat(50));
}

main();
