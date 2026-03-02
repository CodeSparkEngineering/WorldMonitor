// Script to create Stripe products for GeoNexus (EUR pricing)
// Run with: STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-stripe-products.js

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY env var is required.');
    console.error('   Usage: STRIPE_SECRET_KEY=sk_live_xxx node scripts/create-stripe-products.js');
    process.exit(1);
}

async function createProduct(name, description) {
    const response = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ name, description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create product: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
}

async function createPrice(productId, amount, currency, interval) {
    const response = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            product: productId,
            unit_amount: amount.toString(),
            currency,
            'recurring[interval]': interval,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create price: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
}

async function main() {
    try {
        console.log('🚀 Creating Stripe products for GeoNexus (EUR)...\n');
        console.log(`Using key: ${STRIPE_SECRET_KEY.substring(0, 12)}...\n`);

        // Create Monthly Product
        console.log('Creating Monthly product...');
        const monthlyProduct = await createProduct(
            'GeoNexus Monthly',
            'Monthly subscription to GeoNexus Intelligence Dashboard - Real-time global intelligence with AI-powered insights'
        );
        console.log('✅ Monthly product created:', monthlyProduct.id);

        // Create Monthly Price (€2.99/month = 299 cents)
        console.log('Creating Monthly price (€2.99/month)...');
        const monthlyPrice = await createPrice(monthlyProduct.id, 299, 'eur', 'month');
        console.log('✅ Monthly price created:', monthlyPrice.id);

        // Create Annual Product
        console.log('\nCreating Annual product...');
        const annualProduct = await createProduct(
            'GeoNexus Annual',
            'Annual subscription to GeoNexus Intelligence Dashboard - Save 36% with annual billing'
        );
        console.log('✅ Annual product created:', annualProduct.id);

        // Create Annual Price (€22.90/year = 2290 cents)
        console.log('Creating Annual price (€22.90/year)...');
        const annualPrice = await createPrice(annualProduct.id, 2290, 'eur', 'year');
        console.log('✅ Annual price created:', annualPrice.id);

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ SUCCESS! Products created successfully');
        console.log('='.repeat(60));
        console.log('\n📋 Add these to your Vercel environment variables:\n');
        console.log(`STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
        console.log(`STRIPE_ANNUAL_PRICE_ID=${annualPrice.id}`);
        console.log(`VITE_STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
        console.log(`VITE_STRIPE_ANNUAL_PRICE_ID=${annualPrice.id}`);
        console.log('\n📊 Pricing Summary:');
        console.log(`  Monthly: €2.99/month (${monthlyPrice.id})`);
        console.log(`  Annual:  €22.90/year (${annualPrice.id})`);
        console.log(`  Annual savings: €12.98/year (~36% off)`);
        console.log('\n🔗 View in Stripe Dashboard:');
        console.log(`  https://dashboard.stripe.com/products/${monthlyProduct.id}`);
        console.log(`  https://dashboard.stripe.com/products/${annualProduct.id}`);
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
