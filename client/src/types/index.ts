export type Step = 'icp' | 'event' | 'filters' | 'generate' | 'review' | 'export';

export interface ICPProfile {
  id: number;
  name: string;
  industry: string;
  subIndustry?: string;
  minRevenue: string;
  maxRevenue: string;
  geography: string;
  minEmployees: string;
  maxEmployees: string;
  additionalCriteria?: string;
  lastUsed?: Date;
  matchCount?: number;
  createdAt?: Date;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  exhibitorCount?: number;
  lastUpdated?: Date;
  sourceUrl?: string;
}

export interface Persona {
  id?: number;
  userId?: number;
  type: string;
  titles: string;
  department: string;
}

export interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}

export interface MatchDetails {
  industryRelevance: number;
  productFit: number;
  decisionMakingAuthority: number;
  budgetAlignment: number;
  geographicMatch: number;
  companySize: string;
  matchingCriteria: string[];
}

export interface Lead {
  id: number;
  userId: number;
  icpProfileId: number;
  eventId: number;
  status: string;
  createdAt?: Date;
  companyName: string;
  companyWebsite?: string;
  companyIndustry?: string;
  companySize?: string;
  companyRevenue?: string;
  companyLocation?: string;
  stakeholderName: string;
  stakeholderTitle: string;
  stakeholderLinkedIn?: string;
  stakeholderEmail?: string;
  stakeholderPhone?: string;
  matchReason?: string;
  fitScore?: number;
  outreachMessage?: string;
  enrichmentData?: {
    technologies?: string[];
    fundingInfo?: string;
    recentNews?: string[];
    competitors?: string[];
  };
  matchDetails?: MatchDetails;
}

export interface NewICPProfile {
  userId: number;
  name: string;
  industry: string;
  subIndustry?: string;
  minRevenue: string;
  maxRevenue: string;
  geography: string;
  minEmployees: string;
  maxEmployees: string;
  additionalCriteria?: string;
}