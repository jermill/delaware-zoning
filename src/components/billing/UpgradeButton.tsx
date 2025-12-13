import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStripe } from '@/lib/stripeClient';
import toast from 'react-hot-toast';
import { FiArrowRight, FiLoader } from 'react-icons/fi';

interface UpgradeButtonProps {
  tier: 'pro' | 'business';
  currentTier?: 'looker' | 'pro' | 'whale';
  className?: string;
  children?: React.ReactNode;
}

// Map tier to Stripe price IDs
const STRIPE_PRICES = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_1SdbN9FCgX2xIDAtxRQw6jx8',
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_WHALE || 'price_1SdbNAFCgX2xIDAtCWnMB4U7',
};

// Map tier to subscription tier names
const TIER_NAMES = {
  pro: 'pro',
  business: 'whale',
};

export default function UpgradeButton({
  tier,
  currentTier,
  className = '',
  children,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { session, user } = useAuth();

  const handleUpgrade = async () => {
    if (!session || !user) {
      toast.error('Please log in to upgrade');
      return;
    }

    setLoading(true);

    try {
      const priceId = STRIPE_PRICES[tier];
      const subscriptionTier = TIER_NAMES[tier];

      // Call API to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
          tier: subscriptionTier,
          returnUrl: window.location.href, // Pass current URL to know where user came from
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout using the URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to start upgrade process');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already on this tier or higher
  const isCurrentTier = 
    (tier === 'pro' && (currentTier === 'pro' || currentTier === 'whale')) ||
    (tier === 'business' && currentTier === 'whale');

  if (isCurrentTier) {
    return (
      <button
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        Current Plan
      </button>
    );
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`${className} ${
        loading ? 'opacity-75 cursor-wait' : ''
      } inline-flex items-center justify-center gap-2 transition-all`}
    >
      {loading ? (
        <>
          <FiLoader className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {children || 'Upgrade Now'}
          <FiArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

