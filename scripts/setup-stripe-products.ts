/**
 * Setup Stripe Products and Prices
 * 
 * This script creates the subscription products and prices in Stripe.
 * Run once to set up your Stripe account with the correct products.
 * 
 * Usage:
 *   npx ts-node scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

async function setupProducts() {
  console.log('🚀 Setting up Stripe products for Delaware Zoning...\n');

  try {
    // Create The Pro product
    console.log('Creating "The Pro" product...');
    const proProduct = await stripe.products.create({
      name: 'Delaware Zoning - The Pro',
      description: '50 searches per month, unlimited saves and exports. Perfect for active professionals.',
      metadata: {
        tier: 'pro',
        search_limit: '50',
        save_limit: 'unlimited',
        export_limit: 'unlimited',
      },
    });

    console.log(`✅ Created product: ${proProduct.id}`);

    // Create The Pro price
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2999, // $29.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
      },
    });

    console.log(`✅ Created price: ${proPrice.id} ($29.99/month)\n`);

    // Create The Whale (Business) product
    console.log('Creating "The Whale" (Business) product...');
    const businessProduct = await stripe.products.create({
      name: 'Delaware Zoning - The Whale',
      description: 'Unlimited searches, saves, and exports. For power users and businesses.',
      metadata: {
        tier: 'business',
        search_limit: 'unlimited',
        save_limit: 'unlimited',
        export_limit: 'unlimited',
      },
    });

    console.log(`✅ Created product: ${businessProduct.id}`);

    // Create The Whale price
    const businessPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 9999, // $99.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'business',
      },
    });

    console.log(`✅ Created price: ${businessPrice.id} ($99.99/month)\n`);

    // Generate environment variable snippet
    const envSnippet = `
# Add these to your .env.local file:
STRIPE_PRICE_PRO=${proPrice.id}
STRIPE_PRICE_BUSINESS=${businessPrice.id}
`;

    console.log('📝 Environment Variables:');
    console.log(envSnippet);

    // Save to a file for reference
    const outputPath = path.join(__dirname, 'stripe-product-ids.txt');
    const output = `Delaware Zoning - Stripe Product Setup
========================================

Created: ${new Date().toISOString()}

The Pro
-------
Product ID: ${proProduct.id}
Price ID: ${proPrice.id}
Amount: $29.99/month

The Whale (Business)
--------------------
Product ID: ${businessProduct.id}
Price ID: ${businessPrice.id}
Amount: $99.99/month

Environment Variables
---------------------
${envSnippet}

Next Steps:
1. Add the STRIPE_PRICE_* variables to your .env.local file
2. Proceed to Phase 3 of the implementation plan
`;

    fs.writeFileSync(outputPath, output);
    console.log(`\n💾 Product IDs saved to: ${outputPath}`);
    console.log('\n✨ Setup complete! Products created in Stripe.');
    console.log('👉 Next: Add the price IDs to your .env.local file and proceed to Phase 3');

  } catch (error) {
    console.error('\n❌ Error setting up products:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the setup
setupProducts();
