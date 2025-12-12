// Pricing Tiers
export type PricingTier = 'free' | 'looker' | 'pro';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

// User Types (for future backend integration)
export interface User {
  id: string;
  email: string;
  name?: string;
  subscription?: PricingTier;
}

// Property Types (for future backend integration)
export interface SavedProperty {
  id: string;
  address: string;
  zoneCode?: string;
  zoneName?: string;
  savedAt: string;
}
