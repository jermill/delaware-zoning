/**
 * Setup Stripe Products and Prices for Delaware Zoning
 * 
 * Creates 3 subscription tiers:
 * - The Looker (Free): $0/month
 * - The Pro: $49/month  
 * - The Whale: $129/month
 * 
 * Usage:
 *   npm run setup-stripe
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Initialize Stripe with your secret key
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  console.error('   Make sure your .env.local file has STRIPE_SECRET_KEY set');
  process.exit(1);
}

const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2025-11-17.clover',
});

async function setupProducts() {
  console.log('🚀 Setting up Stripe products for Delaware Zoning...\n');
  console.log(`📍 Using Stripe key: ${(stripeKey as string).substring(0, 20)}...\n`);

  try {
    // Create The Looker (Free) product
    console.log('Creating "The Looker" (Free Tier) product...');
    const lookerProduct = await stripe.products.create({
      name: 'Delaware Zoning - The Looker',
      description: 'Free tier with 5 searches per month. Perfect for occasional property lookups.',
      metadata: {
        tier: 'free',
        search_limit: '5',
        save_limit: '10',
        export_limit: '0',
      },
    });

    console.log(`✅ Created product: ${lookerProduct.id}`);

    // Create The Looker price (Free)
    const lookerPrice = await stripe.prices.create({
      product: lookerProduct.id,
      unit_amount: 0, // $0.00 - FREE
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'free',
      },
    });

    console.log(`✅ Created price: ${lookerPrice.id} (FREE)\n`);

    // Create The Pro product
    console.log('Creating "The Pro" product...');
    const proProduct = await stripe.products.create({
      name: 'Delaware Zoning - The Pro',
      description: 'Unlimited searches + PDF exports + dimensional data. For active professionals.',
      metadata: {
        tier: 'pro',
        search_limit: 'unlimited',
        save_limit: 'unlimited',
        export_limit: 'unlimited',
      },
    });

    console.log(`✅ Created product: ${proProduct.id}`);

    // Create The Pro price
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 4900, // $49.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
      },
    });

    console.log(`✅ Created price: ${proPrice.id} ($49.00/month)\n`);

    // Create The Whale (Enterprise) product
    console.log('Creating "The Whale" (Enterprise) product...');
    const whaleProduct = await stripe.products.create({
      name: 'Delaware Zoning - The Whale',
      description: 'Enterprise access with priority support, API access, and team features.',
      metadata: {
        tier: 'business',
        search_limit: 'unlimited',
        save_limit: 'unlimited',
        export_limit: 'unlimited',
        api_access: 'true',
        priority_support: 'true',
      },
    });

    console.log(`✅ Created product: ${whaleProduct.id}`);

    // Create The Whale price
    const whalePrice = await stripe.prices.create({
      product: whaleProduct.id,
      unit_amount: 12900, // $129.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'business',
      },
    });

    console.log(`✅ Created price: ${whalePrice.id} ($129.00/month)\n`);

    // Generate environment variable snippet
    const envSnippet = `
# ============================================================================
# STRIPE PRODUCT PRICE IDs (Add these to your .env.local)
# ============================================================================
STRIPE_PRICE_LOOKER=${lookerPrice.id}
STRIPE_PRICE_PRO=${proPrice.id}
STRIPE_PRICE_WHALE=${whalePrice.id}
`;

    console.log('=' .repeat(70));
    console.log('📝 COPY THESE TO YOUR .env.local FILE:');
    console.log('=' .repeat(70));
    console.log(envSnippet);
    console.log('=' .repeat(70));

    // Save to a file for reference
    const outputPath = path.join(__dirname, 'stripe-product-ids.txt');
    const output = `Delaware Zoning - Stripe Product Setup
========================================

Created: ${new Date().toISOString()}
Stripe Mode: ${(stripeKey as string).startsWith('sk_live_') ? 'LIVE' : 'TEST'}

The Looker (Free Tier)
-----------------------
Product ID: ${lookerProduct.id}
Price ID: ${lookerPrice.id}
Amount: FREE ($0.00/month)

The Pro
-------
Product ID: ${proProduct.id}
Price ID: ${proPrice.id}
Amount: $49.00/month

The Whale (Enterprise)
-----------------------
Product ID: ${whaleProduct.id}
Price ID: ${whalePrice.id}
Amount: $129.00/month

Environment Variables to Add
-----------------------------
${envSnippet}

Next Steps:
-----------
1. ✅ Copy the STRIPE_PRICE_* variables above
2. ✅ Add them to your .env.local file
3. ✅ Set up Stripe webhook (see below)
4. ✅ Test build: npm run build
5. ✅ Deploy to Netlify

Stripe Webhook Setup:
---------------------
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: https://yourdomain.com/api/stripe/webhook
3. Select these events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. Copy webhook signing secret (whsec_...)
5. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...

View Your Products:
-------------------
https://dashboard.stripe.com/products
`;

    fs.writeFileSync(outputPath, output);
    console.log(`\n💾 Product details saved to: ${outputPath}`);
    console.log('\n✨ Stripe setup complete!');
    console.log('\n👉 Next: Copy the Price IDs above and add them to .env.local');

  } catch (error) {
    console.error('\n❌ Error setting up products:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    console.error('\nTroubleshooting:');
    console.error('1. Check that your STRIPE_SECRET_KEY is correct in .env.local');
    console.error('2. Make sure you have internet connection');
    console.error('3. Verify your Stripe account is active');
    
    process.exit(1);
  }
}

// Run the setup
setupProducts();

