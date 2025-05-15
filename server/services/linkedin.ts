import axios from 'axios';

// LinkedIn API configuration
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';
const LINKEDIN_SALES_NAVIGATOR_URL = 'https://api.linkedin.com/v2/salesNavigator';

// Validate LinkedIn API key format
export function isValidLinkedInApiKey(key: string | undefined): boolean {
  return !!key && key.length > 0;
}

// Check if we have a valid API key
const apiKey = process.env.LINKEDIN_API_KEY;
if (!apiKey || !isValidLinkedInApiKey(apiKey)) {
  console.warn("Warning: Missing or invalid LinkedIn API key. Lead generation will not work properly.");
  console.warn("Please set a valid LINKEDIN_API_KEY environment variable.");
}

// LinkedIn API client
const linkedinClient = axios.create({
  baseURL: LINKEDIN_API_URL,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0'
  }
});

export interface LinkedInCompany {
  id: string;
  name: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  founded: string;
  linkedInUrl: string;
  employeeCount: number;
  specialties: string[];
  technologies: string[];
}

export interface LinkedInPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  companyId: string;
  linkedInUrl: string;
  email?: string;
  phone?: string;
  department: string;
  seniority: string;
  location: string;
}

export interface LinkedInSearchParams {
  industry?: string;
  subIndustry?: string;
  minRevenue?: string;
  maxRevenue?: string;
  geography?: string;
  minEmployees?: number;
  maxEmployees?: number;
  titles?: string[];
  departments?: string[];
  keywords?: string[];
}

/**
 * Search for companies using LinkedIn Sales Navigator API
 */
export async function searchCompanies(params: LinkedInSearchParams): Promise<LinkedInCompany[]> {
  try {
    if (!apiKey || !isValidLinkedInApiKey(apiKey)) {
      throw new Error("Invalid or missing LinkedIn API key. Please set a valid API key in your environment variables.");
    }

    const response = await linkedinClient.post(`${LINKEDIN_SALES_NAVIGATOR_URL}/companies/search`, {
      filters: {
        industry: params.industry,
        subIndustry: params.subIndustry,
        revenue: {
          min: params.minRevenue,
          max: params.maxRevenue
        },
        employeeCount: {
          min: params.minEmployees,
          max: params.maxEmployees
        },
        location: params.geography,
        keywords: params.keywords
      },
      count: 100 // Maximum allowed by LinkedIn API
    });

    return response.data.elements.map((company: any) => ({
      id: company.id,
      name: company.name,
      website: company.website,
      description: company.description,
      industry: company.industry,
      size: company.size,
      revenue: company.revenue,
      location: company.location,
      founded: company.founded,
      linkedInUrl: company.linkedInUrl,
      employeeCount: company.employeeCount,
      specialties: company.specialties,
      technologies: company.technologies
    }));
  } catch (error: any) {
    console.error("Error searching companies with LinkedIn:", error);
    throw new Error(`LinkedIn API request failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Search for people using LinkedIn Sales Navigator API
 */
export async function searchPeople(params: LinkedInSearchParams): Promise<LinkedInPerson[]> {
  try {
    if (!apiKey || !isValidLinkedInApiKey(apiKey)) {
      throw new Error("Invalid or missing LinkedIn API key. Please set a valid API key in your environment variables.");
    }

    const response = await linkedinClient.post(`${LINKEDIN_SALES_NAVIGATOR_URL}/people/search`, {
      filters: {
        industry: params.industry,
        titles: params.titles,
        departments: params.departments,
        location: params.geography,
        keywords: params.keywords
      },
      count: 100 // Maximum allowed by LinkedIn API
    });

    return response.data.elements.map((person: any) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      title: person.title,
      company: person.company,
      companyId: person.companyId,
      linkedInUrl: person.linkedInUrl,
      email: person.email,
      phone: person.phone,
      department: person.department,
      seniority: person.seniority,
      location: person.location
    }));
  } catch (error: any) {
    console.error("Error searching people with LinkedIn:", error);
    throw new Error(`LinkedIn API request failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get detailed company information
 */
export async function getCompanyDetails(companyId: string): Promise<LinkedInCompany> {
  try {
    if (!apiKey || !isValidLinkedInApiKey(apiKey)) {
      throw new Error("Invalid or missing LinkedIn API key. Please set a valid API key in your environment variables.");
    }

    const response = await linkedinClient.get(`${LINKEDIN_SALES_NAVIGATOR_URL}/companies/${companyId}`);
    const company = response.data;

    return {
      id: company.id,
      name: company.name,
      website: company.website,
      description: company.description,
      industry: company.industry,
      size: company.size,
      revenue: company.revenue,
      location: company.location,
      founded: company.founded,
      linkedInUrl: company.linkedInUrl,
      employeeCount: company.employeeCount,
      specialties: company.specialties,
      technologies: company.technologies
    };
  } catch (error: any) {
    console.error("Error getting company details from LinkedIn:", error);
    throw new Error(`LinkedIn API request failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get detailed person information
 */
export async function getPersonDetails(personId: string): Promise<LinkedInPerson> {
  try {
    if (!apiKey || !isValidLinkedInApiKey(apiKey)) {
      throw new Error("Invalid or missing LinkedIn API key. Please set a valid API key in your environment variables.");
    }

    const response = await linkedinClient.get(`${LINKEDIN_SALES_NAVIGATOR_URL}/people/${personId}`);
    const person = response.data;

    return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      title: person.title,
      company: person.company,
      companyId: person.companyId,
      linkedInUrl: person.linkedInUrl,
      email: person.email,
      phone: person.phone,
      department: person.department,
      seniority: person.seniority,
      location: person.location
    };
  } catch (error: any) {
    console.error("Error getting person details from LinkedIn:", error);
    throw new Error(`LinkedIn API request failed: ${error.message || 'Unknown error'}`);
  }
} 