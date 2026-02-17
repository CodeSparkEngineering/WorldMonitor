
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not found in .env');
    process.exit(1);
}

console.log('Using Stripe Key:', STRIPE_SECRET_KEY.substring(0, 8) + '...');

async function listPrices() {
    try {
        const response = await fetch('https://api.stripe.com/v1/prices?limit=10&active=true', {
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            }
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('Stripe API Error:', JSON.stringify(err, null, 2));
            return;
        }

        const data = await response.json();
        console.log('Found Prices:');

        const output = [];
        data.data.forEach(price => {
            console.log(`- ID: ${price.id}`);
            console.log(`  Product: ${price.product}`);
            console.log(`  Unit Amount: ${price.unit_amount} ${price.currency}`);
            output.push(price);
        });

        const outputPath = path.resolve(process.cwd(), 'prices.json');
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`Saved ${output.length} prices to ${outputPath}`);

        if (data.data.length === 0) {
            console.log('No active prices found in this Stripe account.');
            console.log('Please ensure you have created Products and Prices in the Stripe Dashboard (Live Mode).');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

listPrices();
