// Mock data for admin dashboard
import { UserTier, UserProfile, mockUsers, getDashboardData } from './mockDashboardData';

export interface AdminUser extends UserProfile {
  lastLogin: string;
  searchesTotal: number;
  savedPropertiesCount: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  mrr: number; // Monthly Recurring Revenue
}

// Generate multiple users for admin view
export const allUsers: AdminUser[] = [
  // The Looker users (Free)
  {
    ...mockUsers.looker,
    lastLogin: '2024-12-11T08:30:00Z',
    searchesTotal: 12,
    savedPropertiesCount: 3,
    status: 'active',
    createdAt: '2024-11-15T10:30:00Z',
    mrr: 0,
  },
  {
    id: 'user-looker-2',
    name: 'Mike Thompson',
    email: 'mike.t@email.com',
    phone: '(302) 555-0234',
    company: 'Thompson Real Estate',
    userType: 'realtor',
    tier: 'looker',
    lastLogin: '2024-12-10T14:20:00Z',
    searchesTotal: 8,
    savedPropertiesCount: 2,
    status: 'active',
    createdAt: '2024-11-20T09:15:00Z',
    mrr: 0,
  },
  {
    id: 'user-looker-3',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(302) 555-0345',
    company: 'First Time Buyer',
    userType: 'investor',
    tier: 'looker',
    lastLogin: '2024-12-09T16:45:00Z',
    searchesTotal: 3,
    savedPropertiesCount: 1,
    status: 'active',
    createdAt: '2024-12-01T11:20:00Z',
    mrr: 0,
  },
  {
    id: 'user-looker-4',
    name: 'Robert Chen',
    email: 'robert.c@email.com',
    phone: '(302) 555-0456',
    company: 'Independent',
    userType: 'investor',
    tier: 'looker',
    lastLogin: '2024-11-28T10:30:00Z',
    searchesTotal: 2,
    savedPropertiesCount: 0,
    status: 'inactive',
    createdAt: '2024-11-10T14:30:00Z',
    mrr: 0,
  },

  // The Pro users ($49/mo)
  {
    ...mockUsers.pro,
    lastLogin: '2024-12-11T09:15:00Z',
    searchesTotal: 186,
    savedPropertiesCount: 12,
    status: 'active',
    createdAt: '2024-10-05T14:20:00Z',
    mrr: 49,
  },
  {
    id: 'user-pro-2',
    name: 'Lisa Anderson',
    email: 'lisa@delawarehomes.com',
    phone: '(302) 555-0567',
    company: 'Delaware Homes Realty',
    userType: 'realtor',
    tier: 'pro',
    lastLogin: '2024-12-11T07:45:00Z',
    searchesTotal: 234,
    savedPropertiesCount: 18,
    status: 'active',
    createdAt: '2024-09-12T08:30:00Z',
    mrr: 49,
  },
  {
    id: 'user-pro-3',
    name: 'David Martinez',
    email: 'david@coastalproperties.com',
    phone: '(302) 555-0678',
    company: 'Coastal Properties LLC',
    userType: 'developer',
    tier: 'pro',
    lastLogin: '2024-12-10T15:30:00Z',
    searchesTotal: 156,
    savedPropertiesCount: 15,
    status: 'active',
    createdAt: '2024-08-20T10:15:00Z',
    mrr: 49,
  },
  {
    id: 'user-pro-4',
    name: 'Amanda White',
    email: 'amanda@keystonerealty.com',
    phone: '(302) 555-0789',
    company: 'Keystone Realty Group',
    userType: 'realtor',
    tier: 'pro',
    lastLogin: '2024-12-11T11:20:00Z',
    searchesTotal: 298,
    savedPropertiesCount: 22,
    status: 'active',
    createdAt: '2024-07-15T09:45:00Z',
    mrr: 49,
  },
  {
    id: 'user-pro-5',
    name: 'James Wilson',
    email: 'james@wilsoninvest.com',
    phone: '(302) 555-0890',
    company: 'Wilson Investment Group',
    userType: 'investor',
    tier: 'pro',
    lastLogin: '2024-12-08T13:10:00Z',
    searchesTotal: 112,
    savedPropertiesCount: 8,
    status: 'active',
    createdAt: '2024-09-28T16:20:00Z',
    mrr: 49,
  },

  // The Whale users ($129/mo)
  {
    ...mockUsers.whale,
    lastLogin: '2024-12-11T10:00:00Z',
    searchesTotal: 412,
    savedPropertiesCount: 15,
    status: 'active',
    createdAt: '2024-09-12T09:15:00Z',
    mrr: 129,
  },
  {
    id: 'user-whale-2',
    name: 'Michael Brown',
    email: 'michael@browndev.com',
    phone: '(302) 555-0901',
    company: 'Brown Development Corp',
    userType: 'developer',
    tier: 'whale',
    lastLogin: '2024-12-11T08:00:00Z',
    searchesTotal: 567,
    savedPropertiesCount: 28,
    status: 'active',
    createdAt: '2024-08-05T11:30:00Z',
    mrr: 129,
  },
  {
    id: 'user-whale-3',
    name: 'Rachel Green',
    email: 'rachel@greenarchitects.com',
    phone: '(302) 555-1012',
    company: 'Green Architects & Planners',
    userType: 'architect',
    tier: 'whale',
    lastLogin: '2024-12-10T16:30:00Z',
    searchesTotal: 389,
    savedPropertiesCount: 19,
    status: 'active',
    createdAt: '2024-07-22T14:45:00Z',
    mrr: 129,
  },
  {
    id: 'user-whale-4',
    name: 'Thomas Lee',
    email: 'thomas@premierdev.com',
    phone: '(302) 555-1123',
    company: 'Premier Development LLC',
    userType: 'developer',
    tier: 'whale',
    lastLogin: '2024-12-11T09:45:00Z',
    searchesTotal: 445,
    savedPropertiesCount: 24,
    status: 'active',
    createdAt: '2024-06-10T10:00:00Z',
    mrr: 129,
  },
];

// Admin stats
export const adminStats = {
  totalUsers: allUsers.length,
  lookerUsers: allUsers.filter(u => u.tier === 'looker').length,
  proUsers: allUsers.filter(u => u.tier === 'pro').length,
  whaleUsers: allUsers.filter(u => u.tier === 'whale').length,
  activeUsers: allUsers.filter(u => u.status === 'active').length,
  totalMRR: allUsers.reduce((sum, user) => sum + user.mrr, 0),
  totalSearches: allUsers.reduce((sum, user) => sum + user.searchesTotal, 0),
};

// Get user dashboard data by user ID
export function getUserDashboardById(userId: string) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return null;
  
  return {
    user,
    dashboardData: getDashboardData(user.tier),
  };
}
