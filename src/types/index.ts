// Pricing Tiers
export type PricingTier = 'free' | 'looker' | 'pro' | 'whale';

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

// Dimensional Standards
export interface DimensionalStandards {
  frontSetback: number;
  sideSetback: number;
  rearSetback: number;
  maxHeight: number;
  minLotArea: number;
  minLotWidth: number;
  far: number; // Floor Area Ratio
  lotCoverage?: number;
}

// Parking Requirements
export interface ParkingRequirements {
  ratio: number | string;
  notes: string;
}

// Permitted Use
export interface PermittedUse {
  category: string;
  description: string;
  type: 'allowed' | 'conditional' | 'prohibited';
  conditions?: string;
}

// Flood Zone Information
export interface FloodZone {
  femaZone: string;
  floodRisk: 'High Risk' | 'Moderate Risk' | 'Low Risk' | 'Minimal Risk';
  description: string;
}

// Required Permits
export interface RequiredPermit {
  type: string;
  description: string;
  processingTime?: string;
  estimatedCost?: string;
}

// Zoning Contact Information
export interface ZoningContact {
  office: string;
  phone: string;
  email: string;
  website?: string;
  address?: string;
}

// Property Types (for future backend integration)
export interface SavedProperty {
  id: string;
  address: string;
  zoneCode?: string;
  zoneName?: string;
  savedAt: string;
  // Enhanced zoning data (available based on tier)
  county?: string;
  city?: string;
  municipality?: string;
  dimensionalStandards?: DimensionalStandards;
  parkingRequirements?: ParkingRequirements;
  permittedUses?: PermittedUse[];
  floodZone?: FloodZone;
  requiredPermits?: RequiredPermit[];
  overlayDistricts?: string[];
  zoningContact?: ZoningContact;
  ordinanceUrl?: string;
  lastVerified?: string;
}

