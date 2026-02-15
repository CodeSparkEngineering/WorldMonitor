// Script to create Stripe products for GeoNexus
// Run with: node scripts/create-stripe-products.js

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY_HERE';

async function createProduct(name, description) {
    const response = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            name,
            description,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create product: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
}

async function createPrice(productId, amount, interval) {
    const response = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            product: productId,
            unit_amount: amount.toString(), // Amount in cents
            currency: 'usd',
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
        console.log('🚀 Creating Stripe products for GeoNexus...\n');

        // Create Monthly Product
        console.log('Creating Monthly product...');
        const monthlyProduct = await createProduct(
            'GeoNexus Monthly',
            'Monthly subscription to GeoNexus Intelligence Dashboard - Real-time global intelligence with AI-powered insights'
        );
        console.log('✅ Monthly product created:', monthlyProduct.id);

        // Create Monthly Price ($19.90/month)
        console.log('Creating Monthly price ($19.90/month)...');
        const monthlyPrice = await createPrice(monthlyProduct.id, 1990, 'month');
        console.log('✅ Monthly price created:', monthlyPrice.id);

        // Create Annual Product
        console.log('\nCreating Annual product...');
        const annualProduct = await createProduct(
            'GeoNexus Annual',
            'Annual subscription to GeoNexus Intelligence Dashboard - Save 29% with annual billing'
        );
        console.log('✅ Annual product created:', annualProduct.id);

        // Create Annual Price ($169.99/year)
        console.log('Creating Annual price ($169.99/year)...');
        const annualPrice = await createPrice(annualProduct.id, 16999, 'year');
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
        console.log(`  Monthly: $19.90/month (${monthlyPrice.id})`);
        console.log(`  Annual:  $169.99/year (${annualPrice.id})`);
        console.log(`  Annual savings: $68.81/year (29% off)`);
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
