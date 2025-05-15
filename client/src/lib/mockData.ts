import { ICPProfile, Event, Persona, User } from '@/types';

export const mockUser: User = {
  id: 1,
  username: 'johnsmith',
  fullName: 'John Smith',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export const mockICPProfiles: ICPProfile[] = [
  {
    id: 1,
    name: 'Architectural Signage Companies',
    industry: 'Manufacturing',
    subIndustry: 'Architectural Signage',
    minRevenue: '$10M',
    maxRevenue: '$500M',
    geography: 'North America',
    minEmployees: '50',
    maxEmployees: '1,000',
    additionalCriteria: '',
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    matchCount: 142,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  },
  {
    id: 2,
    name: 'Manufacturing Technology Vendors',
    industry: 'Technology',
    subIndustry: 'Manufacturing Software',
    minRevenue: '$5M',
    maxRevenue: '$100M',
    geography: 'Global',
    minEmployees: '10',
    maxEmployees: '500',
    additionalCriteria: '',
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    matchCount: 267,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
  },
  {
    id: 3,
    name: 'Healthcare Software Providers',
    industry: 'Healthcare',
    subIndustry: 'Healthcare Software',
    minRevenue: '$20M',
    maxRevenue: '$1B',
    geography: 'US & Canada',
    minEmployees: '100',
    maxEmployees: '10,000+',
    additionalCriteria: '',
    lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    matchCount: 89,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
  }
];

export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'DigitalSignage Expo 2023',
    date: 'Jun 12-15, 2023',
    location: 'Las Vegas, NV',
    exhibitorCount: 320,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: 2,
    name: 'ManufacturingTech Summit',
    date: 'Jul 8-10, 2023',
    location: 'Chicago, IL',
    exhibitorCount: 175,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  },
  {
    id: 3,
    name: 'Healthcare Innovation Conference',
    date: 'Aug 15-17, 2023',
    location: 'Boston, MA',
    exhibitorCount: 210,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

export const mockPersonas: Persona[] = [
  {
    id: 1,
    type: 'Executive Leadership',
    titles: 'CEO, Founder, President, Owner',
    department: 'Executive'
  },
  {
    id: 2,
    type: 'Department Head',
    titles: 'VP of Marketing, Marketing Director, Head of Marketing',
    department: 'Marketing'
  }
];
