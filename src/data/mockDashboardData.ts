// Mock data for dashboard demonstration
// This will be replaced with real data from Supabase once backend is integrated

import type { 
  DimensionalStandards, 
  ParkingRequirements, 
  PermittedUse, 
  FloodZone, 
  RequiredPermit,
  ZoningContact 
} from '@/types';

export type UserTier = 'looker' | 'pro' | 'whale';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  userType: 'realtor' | 'developer' | 'architect' | 'investor';
  avatar?: string;
  tier: UserTier;
  createdAt: string;
}

export interface SavedProperty {
  id: string;
  address: string;
  zoneCode: string;
  zoneName: string;
  county: 'New Castle' | 'Kent' | 'Sussex';
  city: string;
  dateSaved: string;
  starred?: boolean;
  notes?: string;
  tags?: string[];
  // Enhanced zoning data
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

export interface SearchHistoryEntry {
  id: string;
  address: string;
  zoneCode: string;
  zoneName: string;
  county: 'New Castle' | 'Kent' | 'Sussex';
  searchedAt: string;
  success: boolean;
}

export interface SubscriptionInfo {
  tier: UserTier;
  tierName: 'The Looker' | 'The Pro' | 'The Whale';
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'free';
  nextBillingDate?: string;
  paymentMethod?: string;
  status: 'active' | 'trial' | 'cancelled';
}

export interface UsageStats {
  searchesThisMonth: number;
  searchLimit: number | null; // null means unlimited
  savedProperties: number;
  pdfExportsThisMonth: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

// User profiles for each tier
export const mockUsers: Record<UserTier, UserProfile> = {
  looker: {
    id: 'user-looker-1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(302) 555-0123',
    company: 'Independent Realtor',
    userType: 'realtor',
    tier: 'looker',
    createdAt: '2024-11-15T10:30:00Z',
  },
  pro: {
    id: 'user-pro-1',
    name: 'Marcus Rivera',
    email: 'marcus.rivera@devcorp.com',
    phone: '(302) 555-0456',
    company: 'Rivera Development Corp',
    userType: 'developer',
    tier: 'pro',
    createdAt: '2024-10-05T14:20:00Z',
  },
  whale: {
    id: 'user-whale-1',
    name: 'Jennifer Chen',
    email: 'jennifer@chenarchitects.com',
    phone: '(302) 555-0789',
    company: 'Chen Architects LLC',
    userType: 'architect',
    tier: 'whale',
    createdAt: '2024-09-12T09:15:00Z',
  },
};

// Saved properties mock data
export const mockSavedProperties: SavedProperty[] = [
  {
    id: 'prop-1',
    address: '123 Market St, Wilmington, DE 19801',
    zoneCode: 'C-3',
    zoneName: 'General Commercial',
    county: 'New Castle',
    city: 'Wilmington',
    municipality: 'City of Wilmington',
    dateSaved: '2024-12-08T14:30:00Z',
    starred: true,
    tags: ['commercial', 'downtown'],
    dimensionalStandards: {
      frontSetback: 15,
      sideSetback: 10,
      rearSetback: 20,
      maxHeight: 65,
      minLotArea: 7500,
      minLotWidth: 75,
      far: 2.5,
      lotCoverage: 75,
    },
    parkingRequirements: {
      ratio: '1 per 250 sq ft',
      notes: 'Retail: 1 space per 250 sq ft. Office: 1 space per 300 sq ft. Restaurant: 1 space per 100 sq ft. Shared parking arrangements permitted.',
    },
    permittedUses: [
      {
        category: 'Retail',
        description: 'General retail stores, shops, boutiques',
        type: 'allowed',
      },
      {
        category: 'Office',
        description: 'Professional offices, business services',
        type: 'allowed',
      },
      {
        category: 'Restaurant',
        description: 'Restaurants, cafes, bars (with restrictions)',
        type: 'allowed',
        conditions: 'Must meet health department requirements',
      },
      {
        category: 'Mixed-Use Development',
        description: 'Residential units above commercial (up to 4 stories)',
        type: 'conditional',
        conditions: 'Requires site plan approval and design review',
      },
      {
        category: 'Hotel/Lodging',
        description: 'Hotels, motels, extended stay facilities',
        type: 'conditional',
        conditions: 'Requires special use permit and traffic study',
      },
      {
        category: 'Heavy Industrial',
        description: 'Manufacturing, warehousing, distribution',
        type: 'prohibited',
      },
    ],
    floodZone: {
      femaZone: 'X',
      floodRisk: 'Minimal Risk',
      description: 'Area of minimal flood hazard, usually above the 500-year flood level.',
    },
    requiredPermits: [
      {
        type: 'Building Permit',
        description: 'Required for all new construction and major renovations',
        processingTime: '4-6 weeks',
        estimatedCost: '$500-$2,500 (based on project value)',
      },
      {
        type: 'Certificate of Occupancy',
        description: 'Required before occupying any commercial space',
        processingTime: '1-2 weeks after final inspection',
        estimatedCost: '$150',
      },
      {
        type: 'Sign Permit',
        description: 'Required for all exterior signage',
        processingTime: '2-3 weeks',
        estimatedCost: '$75-$250',
      },
    ],
    overlayDistricts: ['Downtown Development District', 'Historic Preservation Overlay'],
    zoningContact: {
      office: 'City of Wilmington Planning Department',
      phone: '(302) 576-2140',
      email: 'planning@wilmingtonde.gov',
      website: 'https://www.wilmingtonde.gov/residents/planning-development',
      address: '800 N French St, Wilmington, DE 19801',
    },
    ordinanceUrl: 'https://www.wilmingtonde.gov/government/city-code',
    lastVerified: '2024-11-15',
  },
  {
    id: 'prop-2',
    address: '456 Main St, Dover, DE 19901',
    zoneCode: 'R-1',
    zoneName: 'Single Family Residential',
    county: 'Kent',
    city: 'Dover',
    dateSaved: '2024-12-07T10:15:00Z',
  },
  {
    id: 'prop-3',
    address: '789 Coastal Hwy, Rehoboth Beach, DE 19971',
    zoneCode: 'C-2',
    zoneName: 'Highway Commercial',
    county: 'Sussex',
    city: 'Rehoboth Beach',
    dateSaved: '2024-12-06T16:45:00Z',
    starred: true,
    tags: ['beach', 'commercial'],
  },
  {
    id: 'prop-4',
    address: '321 Delaware Ave, Newark, DE 19711',
    zoneCode: 'R-2',
    zoneName: 'Medium Density Residential',
    county: 'New Castle',
    city: 'Newark',
    municipality: 'City of Newark',
    dateSaved: '2024-12-05T09:20:00Z',
    dimensionalStandards: {
      frontSetback: 20,
      sideSetback: 5,
      rearSetback: 20,
      maxHeight: 35,
      minLotArea: 5000,
      minLotWidth: 40,
      far: 0.6,
      lotCoverage: 40,
    },
    parkingRequirements: {
      ratio: '1.5 per unit',
      notes: '1.5 spaces per dwelling unit. May use on-street parking to satisfy up to 25% of requirement. Guest parking required for multi-family: 0.25 spaces per unit.',
    },
    permittedUses: [
      {
        category: 'Single-Family Dwelling',
        description: 'Detached single-family homes',
        type: 'allowed',
      },
      {
        category: 'Two-Family Dwelling',
        description: 'Duplex structures',
        type: 'allowed',
      },
      {
        category: 'Townhouse',
        description: 'Attached single-family units (max 6 units per building)',
        type: 'allowed',
      },
      {
        category: 'Home Office',
        description: 'Professional office in dwelling (no employees)',
        type: 'conditional',
        conditions: 'Must be clearly incidental to residential use, no exterior modifications',
      },
      {
        category: 'Accessory Dwelling Unit',
        description: 'Garage apartment or granny flat',
        type: 'conditional',
        conditions: 'Requires special use permit, owner must occupy main dwelling',
      },
    ],
    floodZone: {
      femaZone: 'AE',
      floodRisk: 'High Risk',
      description: 'Area with 1% annual chance of flooding. Flood insurance required for federally backed mortgages. Base Flood Elevation (BFE): 12 feet.',
    },
    requiredPermits: [
      {
        type: 'Building Permit',
        description: 'Required for new construction, additions, and major renovations',
        processingTime: '3-5 weeks',
        estimatedCost: '$350-$1,500',
      },
      {
        type: 'Floodplain Development Permit',
        description: 'Required for all development in AE flood zones',
        processingTime: '4-6 weeks',
        estimatedCost: '$250',
      },
      {
        type: 'Zoning Permit',
        description: 'Required before building permit can be issued',
        processingTime: '1-2 weeks',
        estimatedCost: '$50',
      },
    ],
    overlayDistricts: ['Floodplain Overlay District'],
    zoningContact: {
      office: 'City of Newark Planning & Development',
      phone: '(302) 366-7030',
      email: 'planning@newark.de.us',
      website: 'https://newark.de.us/departments/planning-development',
      address: '220 S Main St, Newark, DE 19711',
    },
    ordinanceUrl: 'https://ecode360.com/NE1639',
    lastVerified: '2024-10-22',
  },
  {
    id: 'prop-5',
    address: '555 Kirkwood Hwy, Wilmington, DE 19808',
    zoneCode: 'I-1',
    zoneName: 'Light Industrial',
    county: 'New Castle',
    city: 'Wilmington',
    municipality: 'New Castle County',
    dateSaved: '2024-12-04T11:30:00Z',
    notes: 'Potential warehouse site',
    dimensionalStandards: {
      frontSetback: 30,
      sideSetback: 20,
      rearSetback: 30,
      maxHeight: 45,
      minLotArea: 20000,
      minLotWidth: 150,
      far: 0.5,
      lotCoverage: 50,
    },
    parkingRequirements: {
      ratio: '1 per 1,000 sq ft',
      notes: '1 space per 1,000 sq ft of building area. Additional loading spaces required based on building size. Warehouse: 1 loading space per 10,000 sq ft. Office component: 1 space per 300 sq ft.',
    },
    permittedUses: [
      {
        category: 'Warehouse/Distribution',
        description: 'Indoor storage and distribution facilities',
        type: 'allowed',
      },
      {
        category: 'Light Manufacturing',
        description: 'Assembly, fabrication of goods (no heavy machinery)',
        type: 'allowed',
      },
      {
        category: 'Research & Development',
        description: 'R&D facilities, laboratories',
        type: 'allowed',
      },
      {
        category: 'Contractor Yards',
        description: 'Storage and dispatch for contractors',
        type: 'conditional',
        conditions: 'Outdoor storage must be screened from adjacent properties',
      },
      {
        category: 'Truck Terminal',
        description: 'Trucking operations, fleet storage',
        type: 'conditional',
        conditions: 'Requires traffic impact study and special use permit',
      },
      {
        category: 'Residential Uses',
        description: 'Any residential occupancy',
        type: 'prohibited',
      },
    ],
    floodZone: {
      femaZone: 'X',
      floodRisk: 'Minimal Risk',
      description: 'Area of minimal flood hazard, usually above the 500-year flood level.',
    },
    requiredPermits: [
      {
        type: 'Building Permit',
        description: 'Required for all construction',
        processingTime: '6-8 weeks',
        estimatedCost: '$750-$5,000 (based on project value)',
      },
      {
        type: 'Land Use Permit',
        description: 'Required before building permit',
        processingTime: '3-4 weeks',
        estimatedCost: '$200',
      },
      {
        type: 'Environmental Review',
        description: 'Phase I Environmental Assessment may be required',
        processingTime: '4-8 weeks',
        estimatedCost: '$1,500-$5,000',
      },
      {
        type: 'Stormwater Management Permit',
        description: 'Required for sites over 5,000 sq ft of disturbance',
        processingTime: '4-6 weeks',
        estimatedCost: '$500',
      },
    ],
    overlayDistricts: ['Route 2 Corridor Overlay', 'Airport Influence Area'],
    zoningContact: {
      office: 'New Castle County Department of Land Use',
      phone: '(302) 395-5400',
      email: 'landuse@newcastlede.gov',
      website: 'https://nccde.org/293/Land-Use',
      address: '87 Reads Way, New Castle, DE 19720',
    },
    ordinanceUrl: 'https://nccde.org/1192/Unified-Development-Code',
    lastVerified: '2024-09-30',
  },
  {
    id: 'prop-6',
    address: '100 S State St, Dover, DE 19901',
    zoneCode: 'C-1',
    zoneName: 'Central Business District',
    county: 'Kent',
    city: 'Dover',
    dateSaved: '2024-12-03T15:10:00Z',
    starred: true,
  },
  {
    id: 'prop-7',
    address: '888 N DuPont Hwy, Milford, DE 19963',
    zoneCode: 'AG',
    zoneName: 'Agricultural',
    county: 'Kent',
    city: 'Milford',
    dateSaved: '2024-12-02T08:45:00Z',
    tags: ['agricultural', 'development'],
  },
  {
    id: 'prop-8',
    address: '234 Savannah Rd, Lewes, DE 19958',
    zoneCode: 'R-1',
    zoneName: 'Single Family Residential',
    county: 'Sussex',
    city: 'Lewes',
    dateSaved: '2024-12-01T14:20:00Z',
  },
  {
    id: 'prop-9',
    address: '777 Concord Pike, Wilmington, DE 19803',
    zoneCode: 'C-4',
    zoneName: 'Office/Professional',
    county: 'New Castle',
    city: 'Wilmington',
    dateSaved: '2024-11-30T10:55:00Z',
  },
  {
    id: 'prop-10',
    address: '999 Bay Rd, Georgetown, DE 19947',
    zoneCode: 'R-3',
    zoneName: 'High Density Residential',
    county: 'Sussex',
    city: 'Georgetown',
    dateSaved: '2024-11-29T13:40:00Z',
  },
  {
    id: 'prop-11',
    address: '147 Possum Park Rd, Newark, DE 19711',
    zoneCode: 'AG',
    zoneName: 'Agricultural',
    county: 'New Castle',
    city: 'Newark',
    dateSaved: '2024-11-28T09:15:00Z',
  },
  {
    id: 'prop-12',
    address: '500 Governors Ave, Dover, DE 19904',
    zoneCode: 'I-2',
    zoneName: 'Heavy Industrial',
    county: 'Kent',
    city: 'Dover',
    dateSaved: '2024-11-27T16:30:00Z',
    notes: 'Industrial park location',
  },
  {
    id: 'prop-13',
    address: '222 Rehoboth Ave, Rehoboth Beach, DE 19971',
    zoneCode: 'C-3',
    zoneName: 'General Commercial',
    county: 'Sussex',
    city: 'Rehoboth Beach',
    dateSaved: '2024-11-26T11:20:00Z',
    starred: true,
    tags: ['beach', 'retail'],
  },
  {
    id: 'prop-14',
    address: '666 Elkton Rd, Newark, DE 19711',
    zoneCode: 'R-2',
    zoneName: 'Medium Density Residential',
    county: 'New Castle',
    city: 'Newark',
    dateSaved: '2024-11-25T14:50:00Z',
  },
  {
    id: 'prop-15',
    address: '888 Old Mill Rd, Seaford, DE 19973',
    zoneCode: 'C-2',
    zoneName: 'Highway Commercial',
    county: 'Sussex',
    city: 'Seaford',
    dateSaved: '2024-11-24T10:10:00Z',
  },
];

// Search history mock data
export const mockSearchHistory: SearchHistoryEntry[] = [
  {
    id: 'search-1',
    address: '400 N Market St, Wilmington, DE 19801',
    zoneCode: 'C-1',
    zoneName: 'Central Business District',
    county: 'New Castle',
    searchedAt: '2024-12-11T09:30:00Z',
    success: true,
  },
  {
    id: 'search-2',
    address: '123 Beach Blvd, Bethany Beach, DE 19930',
    zoneCode: 'R-1',
    zoneName: 'Single Family Residential',
    county: 'Sussex',
    searchedAt: '2024-12-11T08:15:00Z',
    success: true,
  },
  {
    id: 'search-3',
    address: '789 S College Ave, Newark, DE 19711',
    zoneCode: 'C-3',
    zoneName: 'General Commercial',
    county: 'New Castle',
    searchedAt: '2024-12-10T16:45:00Z',
    success: true,
  },
  {
    id: 'search-4',
    address: '555 Forest St, Dover, DE 19904',
    zoneCode: 'R-2',
    zoneName: 'Medium Density Residential',
    county: 'Kent',
    searchedAt: '2024-12-10T14:20:00Z',
    success: true,
  },
  {
    id: 'search-5',
    address: '321 Route 1, Dewey Beach, DE 19971',
    zoneCode: 'C-2',
    zoneName: 'Highway Commercial',
    county: 'Sussex',
    searchedAt: '2024-12-09T11:30:00Z',
    success: true,
  },
  {
    id: 'search-6',
    address: '900 Limestone Rd, Wilmington, DE 19808',
    zoneCode: 'I-1',
    zoneName: 'Light Industrial',
    county: 'New Castle',
    searchedAt: '2024-12-09T09:50:00Z',
    success: true,
  },
  {
    id: 'search-7',
    address: '234 Silver Lake Dr, Dover, DE 19904',
    zoneCode: 'R-1',
    zoneName: 'Single Family Residential',
    county: 'Kent',
    searchedAt: '2024-12-08T15:10:00Z',
    success: true,
  },
  {
    id: 'search-8',
    address: '777 Ocean View Pkwy, Ocean View, DE 19970',
    zoneCode: 'R-3',
    zoneName: 'High Density Residential',
    county: 'Sussex',
    searchedAt: '2024-12-08T13:25:00Z',
    success: true,
  },
  {
    id: 'search-9',
    address: '456 Philadelphia Pike, Wilmington, DE 19809',
    zoneCode: 'C-4',
    zoneName: 'Office/Professional',
    county: 'New Castle',
    searchedAt: '2024-12-07T10:40:00Z',
    success: true,
  },
  {
    id: 'search-10',
    address: '888 Dupont Pkwy, Smyrna, DE 19977',
    zoneCode: 'AG',
    zoneName: 'Agricultural',
    county: 'Kent',
    searchedAt: '2024-12-07T08:55:00Z',
    success: true,
  },
  {
    id: 'search-11',
    address: '111 Main St, Middletown, DE 19709',
    zoneCode: 'C-1',
    zoneName: 'Central Business District',
    county: 'New Castle',
    searchedAt: '2024-12-06T16:20:00Z',
    success: true,
  },
  {
    id: 'search-12',
    address: '333 Savannah Rd, Georgetown, DE 19947',
    zoneCode: 'R-2',
    zoneName: 'Medium Density Residential',
    county: 'Sussex',
    searchedAt: '2024-12-06T14:30:00Z',
    success: true,
  },
  {
    id: 'search-13',
    address: '555 Capitol Trail, Newark, DE 19711',
    zoneCode: 'I-2',
    zoneName: 'Heavy Industrial',
    county: 'New Castle',
    searchedAt: '2024-12-05T11:15:00Z',
    success: true,
  },
  {
    id: 'search-14',
    address: '222 Kings Hwy, Lewes, DE 19958',
    zoneCode: 'C-3',
    zoneName: 'General Commercial',
    county: 'Sussex',
    searchedAt: '2024-12-05T09:45:00Z',
    success: true,
  },
  {
    id: 'search-15',
    address: '999 New Castle Ave, New Castle, DE 19720',
    zoneCode: 'R-1',
    zoneName: 'Single Family Residential',
    county: 'New Castle',
    searchedAt: '2024-12-04T15:50:00Z',
    success: true,
  },
  {
    id: 'search-16',
    address: '444 Bay Rd, Milford, DE 19963',
    zoneCode: 'C-2',
    zoneName: 'Highway Commercial',
    county: 'Kent',
    searchedAt: '2024-12-04T13:30:00Z',
    success: true,
  },
  {
    id: 'search-17',
    address: '777 Shuttle Rd, Selbyville, DE 19975',
    zoneCode: 'AG',
    zoneName: 'Agricultural',
    county: 'Sussex',
    searchedAt: '2024-12-03T10:20:00Z',
    success: true,
  },
  {
    id: 'search-18',
    address: '666 Brandywine Blvd, Wilmington, DE 19809',
    zoneCode: 'R-3',
    zoneName: 'High Density Residential',
    county: 'New Castle',
    searchedAt: '2024-12-03T08:40:00Z',
    success: true,
  },
  {
    id: 'search-19',
    address: '888 Central Ave, Dover, DE 19901',
    zoneCode: 'C-1',
    zoneName: 'Central Business District',
    county: 'Kent',
    searchedAt: '2024-12-02T16:10:00Z',
    success: true,
  },
  {
    id: 'search-20',
    address: '123 Atlantic Ave, Fenwick Island, DE 19944',
    zoneCode: 'R-2',
    zoneName: 'Medium Density Residential',
    county: 'Sussex',
    searchedAt: '2024-12-02T14:25:00Z',
    success: true,
  },
];

// Subscription info for each tier
export const mockSubscriptions: Record<UserTier, SubscriptionInfo> = {
  looker: {
    tier: 'looker',
    tierName: 'The Looker',
    price: 0,
    billingCycle: 'free',
    status: 'active',
  },
  pro: {
    tier: 'pro',
    tierName: 'The Pro',
    price: 49,
    billingCycle: 'monthly',
    nextBillingDate: '2025-01-11T00:00:00Z',
    paymentMethod: 'Visa ending in 4242',
    status: 'active',
  },
  whale: {
    tier: 'whale',
    tierName: 'The Whale',
    price: 129,
    billingCycle: 'monthly',
    nextBillingDate: '2025-01-11T00:00:00Z',
    paymentMethod: 'Mastercard ending in 5555',
    status: 'active',
  },
};

// Usage stats for each tier
export const mockUsageStats: Record<UserTier, UsageStats> = {
  looker: {
    searchesThisMonth: 2,
    searchLimit: 3,
    savedProperties: 3,
    pdfExportsThisMonth: 0,
  },
  pro: {
    searchesThisMonth: 47,
    searchLimit: 50, // 50 searches per month
    savedProperties: 12,
    pdfExportsThisMonth: 0,
  },
  whale: {
    searchesThisMonth: 82,
    searchLimit: null, // unlimited
    savedProperties: 15,
    pdfExportsThisMonth: 23,
  },
};

// Mock invoices for paid tiers
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    date: '2024-12-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
  {
    id: 'inv-002',
    date: '2024-11-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
  {
    id: 'inv-003',
    date: '2024-10-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
  {
    id: 'inv-004',
    date: '2024-09-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
  {
    id: 'inv-005',
    date: '2024-08-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
  {
    id: 'inv-006',
    date: '2024-07-11T00:00:00Z',
    amount: 49.00,
    status: 'paid',
    description: 'The Pro - Monthly Subscription',
  },
];

export const mockWhaleInvoices: Invoice[] = [
  {
    id: 'inv-w-001',
    date: '2024-12-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
  {
    id: 'inv-w-002',
    date: '2024-11-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
  {
    id: 'inv-w-003',
    date: '2024-10-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
  {
    id: 'inv-w-004',
    date: '2024-09-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
  {
    id: 'inv-w-005',
    date: '2024-08-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
  {
    id: 'inv-w-006',
    date: '2024-07-11T00:00:00Z',
    amount: 129.00,
    status: 'paid',
    description: 'The Whale - Monthly Subscription',
  },
];

// Chart data for usage trends (last 30 days)
export const mockUsageChartData = {
  looker: [
    { date: 'Dec 1', searches: 0 },
    { date: 'Dec 5', searches: 0 },
    { date: 'Dec 10', searches: 1 },
    { date: 'Dec 15', searches: 1 },
    { date: 'Dec 20', searches: 1 },
    { date: 'Dec 25', searches: 2 },
    { date: 'Dec 30', searches: 2 },
  ],
  pro: [
    { date: 'Dec 1', searches: 3 },
    { date: 'Dec 5', searches: 8 },
    { date: 'Dec 10', searches: 15 },
    { date: 'Dec 15', searches: 22 },
    { date: 'Dec 20', searches: 31 },
    { date: 'Dec 25', searches: 39 },
    { date: 'Dec 30', searches: 47 },
  ],
  whale: [
    { date: 'Dec 1', searches: 5 },
    { date: 'Dec 5', searches: 18 },
    { date: 'Dec 10', searches: 32 },
    { date: 'Dec 15', searches: 48 },
    { date: 'Dec 20', searches: 61 },
    { date: 'Dec 25', searches: 73 },
    { date: 'Dec 30', searches: 82 },
  ],
};

// Calculate county breakdown from saved properties
export function getCountyBreakdown(properties: SavedProperty[]) {
  const counts = properties.reduce((acc, prop) => {
    acc[prop.county] = (acc[prop.county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// Helper function to get data based on tier
export function getDashboardData(tier: UserTier) {
  const savedProperties = tier === 'looker' ? mockSavedProperties.slice(0, 3) : mockSavedProperties;
  
  return {
    user: mockUsers[tier],
    savedProperties,
    searchHistory: tier === 'looker' 
      ? mockSearchHistory.slice(0, 10) 
      : tier === 'pro' 
      ? mockSearchHistory.slice(0, 20) 
      : mockSearchHistory,
    subscription: mockSubscriptions[tier],
    usage: mockUsageStats[tier],
    invoices: tier === 'whale' ? mockWhaleInvoices : tier === 'pro' ? mockInvoices : [],
    usageChartData: mockUsageChartData[tier],
    countyBreakdown: getCountyBreakdown(savedProperties),
  };
}

