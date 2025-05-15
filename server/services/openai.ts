import OpenAI from "openai";
import { searchCompanies, searchPeople, getCompanyDetails, getPersonDetails, LinkedInSearchParams } from './linkedin';

// Validate API key format
export function isValidApiKeyFormat(key: string | undefined): boolean {
  // Only verify that we have a key that starts with sk- with some content
  return !!key && key.length > 10 && key.startsWith('sk-');
}

// Check if we have a valid API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || !isValidApiKeyFormat(apiKey)) {
  console.warn("Warning: Missing or invalid OpenAI API key format. Lead generation will not work properly.");
  console.warn("Please set a valid OPENAI_API_KEY environment variable.");
}

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: apiKey });

export interface CompanyInfo {
  name: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  location?: string;
  founded?: string;
  linkedInUrl?: string;
}

export interface StakeholderInfo {
  name: string;
  title: string;
  company: string;
  linkedInUrl?: string;
  email?: string;
  phone?: string;
}

export interface LeadGenerationRequest {
  event: {
    name: string;
    date: string;
    location: string;
  };
  icpProfile: {
    industry: string;
    subIndustry?: string;
    minRevenue: string;
    maxRevenue: string;
    geography: string;
    minEmployees: string;
    maxEmployees: string;
    additionalCriteria?: string;
  };
  personas: Array<{
    type: string;
    titles: string;
    department: string;
  }>;
  filters?: {
    technologies?: string[];
    fundingStatus?: string;
    growth?: string;
    recentEvents?: string[];
    keywords?: string[];
  };
  count: number;
  includeEnrichment: boolean;
  generateMessages: boolean;
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

export interface GeneratedLead {
  company: CompanyInfo;
  stakeholder: StakeholderInfo;
  matchReason: string;
  fitScore: number;
  matchDetails: MatchDetails;
  outreachMessage?: string;
  enrichmentData?: {
    technologies?: string[];
    fundingInfo?: string;
    recentNews?: string[];
    competitors?: string[];
  };
}

/**
 * Generates leads based on ICP profile, event, and filters
 */
export async function generateLeads(request: LeadGenerationRequest): Promise<GeneratedLead[]> {
  try {
    // Validate API keys
    if (!apiKey || !isValidApiKeyFormat(apiKey)) {
      throw new Error("Invalid or missing OpenAI API key. Please set a valid API key in your environment variables.");
    }

    // First, use ChatGPT to find matching companies
    const prompt = `
Find real companies that match these criteria:
- Industry: ${request.icpProfile.industry}
${request.icpProfile.subIndustry ? `- Sub-Industry: ${request.icpProfile.subIndustry}` : ''}
- Revenue Range: ${request.icpProfile.minRevenue} to ${request.icpProfile.maxRevenue}
- Geography: ${request.icpProfile.geography}
- Employee Count: ${request.icpProfile.minEmployees} to ${request.icpProfile.maxEmployees}
${request.filters?.technologies?.length ? `- Technologies: ${request.filters.technologies.join(', ')}` : ''}
${request.filters?.keywords?.length ? `- Keywords: ${request.filters.keywords.join(', ')}` : ''}

Return a JSON array of companies with this structure:
{
  "companies": [
    {
      "name": "Company Name",
      "website": "company-website.com",
      "description": "Brief company description",
      "industry": "Specific industry",
      "size": "Employee count range",
      "revenue": "Revenue range",
      "location": "Headquarters location",
      "linkedInUrl": "https://linkedin.com/company/companyname"
    }
  ]
}

Only include real, existing companies that would likely attend ${request.event.name} in ${request.event.location}.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that helps find real companies matching specific criteria. You have access to current business data and can identify actual companies that exist." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const parsedData = JSON.parse(content);
    const companies = parsedData.companies.slice(0, request.count);

    // For each company found by ChatGPT, use LinkedIn API to find decision-makers
    const leads: GeneratedLead[] = [];
    
    for (const company of companies) {
      // Search for people at this company using LinkedIn
      const peopleSearchParams: LinkedInSearchParams = {
        industry: request.icpProfile.industry,
        titles: request.personas.flatMap(p => p.titles.split(', ')),
        departments: request.personas.map(p => p.department),
        geography: request.icpProfile.geography,
        keywords: request.filters?.keywords
      };

      const people = await searchPeople(peopleSearchParams);
      
      // Get detailed person information
      const personDetails = await Promise.all(
        people.slice(0, 3).map(person => getPersonDetails(person.id))
      );

      // Create leads for each matching person
      for (const person of personDetails) {
        // Calculate fit score based on various factors
        const fitScore = calculateFitScore(company, person, request);

        // Generate match reason using OpenAI
        const matchReason = await generateMatchReason(company, person, request);

        // Generate outreach message if requested
        let outreachMessage;
        if (request.generateMessages) {
          outreachMessage = await generateOutreachMessage({
            company: {
              name: company.name,
              industry: company.industry
            },
            stakeholder: {
              name: `${person.firstName} ${person.lastName}`,
              title: person.title,
              company: company.name
            },
            matchReason
          }, request);
        }

        // Get enrichment data if requested
        let enrichmentData;
        if (request.includeEnrichment) {
          enrichmentData = {
            technologies: company.technologies,
            fundingInfo: company.revenue,
            recentNews: [], // Would need to integrate with a news API
            competitors: [] // Would need to integrate with a competitor analysis API
          };
        }

        leads.push({
          company: {
            name: company.name,
            website: company.website,
            description: company.description,
            industry: company.industry,
            size: company.size,
            revenue: company.revenue,
            location: company.location,
            linkedInUrl: company.linkedInUrl
          },
          stakeholder: {
            name: `${person.firstName} ${person.lastName}`,
            title: person.title,
            company: company.name,
            linkedInUrl: person.linkedInUrl,
            email: person.email,
            phone: person.phone
          },
          matchReason,
          fitScore,
          matchDetails: {
            industryRelevance: calculateIndustryRelevance(company, request),
            productFit: calculateProductFit(company, request),
            decisionMakingAuthority: calculateDecisionMakingAuthority(person),
            budgetAlignment: calculateBudgetAlignment(company, request),
            geographicMatch: calculateGeographicMatch(company, request),
            companySize: company.size,
            matchingCriteria: generateMatchingCriteria(company, person, request)
          },
          outreachMessage,
          enrichmentData
        });
      }
    }

    return leads;
  } catch (error: any) {
    console.error("Error generating leads:", error);
    
    // Handle and categorize errors more precisely
    if (error.message?.includes('LinkedIn API')) {
      throw new Error("LinkedIn API error: " + error.message);
    } else if (error.status === 429) {
      if (error.error?.code === 'insufficient_quota') {
        throw new Error("OpenAI API quota exceeded. Please check your billing details.");
      } else {
        throw new Error("API rate limit exceeded. Please try again after a few minutes.");
      }
    } else if (error.message?.includes("API key")) {
      throw new Error("Invalid API key. Please check your API keys in the environment variables.");
    }
    
    throw new Error(`Lead generation failed: ${error.message || 'Unknown error'}`);
  }
}

// Helper functions for calculating scores and criteria
function calculateFitScore(company: any, person: any, request: LeadGenerationRequest): number {
  const weights = {
    industryRelevance: 0.3,
    productFit: 0.2,
    decisionMakingAuthority: 0.2,
    budgetAlignment: 0.15,
    geographicMatch: 0.15
  };

  return Math.round(
    calculateIndustryRelevance(company, request) * weights.industryRelevance +
    calculateProductFit(company, request) * weights.productFit +
    calculateDecisionMakingAuthority(person) * weights.decisionMakingAuthority +
    calculateBudgetAlignment(company, request) * weights.budgetAlignment +
    calculateGeographicMatch(company, request) * weights.geographicMatch
  );
}

function calculateIndustryRelevance(company: any, request: LeadGenerationRequest): number {
  // Base score on industry match
  let score = company.industry === request.icpProfile.industry ? 90 : 70;
  
  // Adjust for sub-industry if specified
  if (request.icpProfile.subIndustry && company.specialties?.includes(request.icpProfile.subIndustry)) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function calculateProductFit(company: any, request: LeadGenerationRequest): number {
  // Base score on company size and revenue
  let score = 80;
  
  // Adjust based on technologies and specialties
  if (company.technologies?.some((tech: string) => 
    request.filters?.technologies?.includes(tech))) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function calculateDecisionMakingAuthority(person: any): number {
  // Base score on seniority
  const seniorityScores: { [key: string]: number } = {
    'C-Level': 95,
    'VP': 90,
    'Director': 85,
    'Manager': 75,
    'Senior': 80,
    'Lead': 70
  };
  
  return seniorityScores[person.seniority] || 60;
}

function calculateBudgetAlignment(company: any, request: LeadGenerationRequest): number {
  // Base score on revenue range
  let score = 80;
  
  // Adjust based on company size
  const employeeCount = parseInt(company.employeeCount);
  if (employeeCount >= parseInt(request.icpProfile.minEmployees) && 
      employeeCount <= parseInt(request.icpProfile.maxEmployees)) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function calculateGeographicMatch(company: any, request: LeadGenerationRequest): number {
  return company.location.includes(request.icpProfile.geography) ? 95 : 70;
}

function generateMatchingCriteria(company: any, person: any, request: LeadGenerationRequest): string[] {
  const criteria: string[] = [];
  
  // Industry Fit
  criteria.push(`Industry Fit – ${company.industry} company with ${company.specialties?.join(', ')} expertise`);
  
  // Size & Revenue
  criteria.push(`Size & Revenue – ${company.size} company with ${company.revenue} annual revenue`);
  
  // Strategic Relevance
  criteria.push(`Strategic Relevance – ${company.description}`);
  
  // Industry Engagement
  if (company.specialties?.length) {
    criteria.push(`Industry Engagement – Active in ${company.specialties.join(', ')}`);
  }
  
  // Market Activity
  if (company.technologies?.length) {
    criteria.push(`Technology Usage – Uses ${company.technologies.join(', ')}`);
  }
  
  // Decision Making
  criteria.push(`Decision Making – ${person.seniority} level position in ${person.department}`);
  
  // Budget Alignment
  criteria.push(`Budget Alignment – Revenue and size match target criteria`);
  
  // Geographic Match
  criteria.push(`Geographic Match – Located in ${company.location}`);
  
  return criteria;
}

/**
 * Generate a personalized outreach message for a specific lead
 */
export async function generateOutreachMessage(lead: Partial<GeneratedLead>, request: LeadGenerationRequest): Promise<string> {
  try {
    // Validate API key
    if (!apiKey || !isValidApiKeyFormat(apiKey)) {
      throw new Error("Invalid or missing OpenAI API key. Please set a valid API key in your environment variables.");
    }
    
    const prompt = `
Generate a personalized outreach message for a potential lead with the following details:
- Event: ${request.event.name} on ${request.event.date} in ${request.event.location}
- Company Name: ${lead.company?.name}
- Stakeholder Name: ${lead.stakeholder?.name}
- Stakeholder Title: ${lead.stakeholder?.title}
- Industry: ${lead.company?.industry || request.icpProfile.industry}
- Why this company fits our ICP: ${lead.matchReason || ""}

The message should:
1. Reference the upcoming event
2. Be personalized to the stakeholder's role and industry
3. Highlight how DuPont Tedlar can address the needs of a Graphics & Signage company
4. Include a clear call to action to schedule a meeting at the event
5. Be brief (3-4 sentences), professional, and direct
6. Not sound like generic marketing language
7. Avoid phrases like "I hope this email finds you well"

Message:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that writes personalized, professional, and effective outreach messages for sales teams." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Could not generate outreach message.";
  } catch (error: any) {
    console.error("Error generating outreach message:", error);
    
    // Handle and categorize errors more precisely
    if (error.status === 429) {
      if (error.error?.code === 'insufficient_quota') {
        throw new Error("OpenAI API quota exceeded. Please check your billing details.");
      } else {
        throw new Error("OpenAI rate limit exceeded. Please try again after a few minutes.");
      }
    } else if (error.message && typeof error.message === 'string' && error.message.includes("API key")) {
      throw new Error("Invalid OpenAI API key. Please check your API key in the environment variables.");
    } else if (!apiKey || !isValidApiKeyFormat(apiKey)) {
      throw new Error("Missing or invalid OpenAI API key format. Please set a valid API key.");
    }
    
    // For other unexpected errors, throw a clearer message
    throw new Error(`OpenAI API request failed: ${error.message ? String(error.message) : 'Unknown error'}`);
  }
}

/**
 * Get company enrichment data
 */
export async function getCompanyEnrichment(companyInfo: CompanyInfo): Promise<GeneratedLead['enrichmentData']> {
  try {
    // Validate API key
    if (!apiKey || !isValidApiKeyFormat(apiKey)) {
      throw new Error("Invalid or missing OpenAI API key. Please set a valid API key in your environment variables.");
    }
    
    const prompt = `
Provide enrichment data for the following company:
- Company Name: ${companyInfo.name}
- Industry: ${companyInfo.industry || "Unknown"}
- Description: ${companyInfo.description || ""}

Please return data in this JSON format:
{
  "technologies": ["technology1", "technology2", "technology3"],
  "fundingInfo": "Brief description of recent funding rounds or financial status",
  "recentNews": ["News item 1", "News item 2"],
  "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"]
}

All data should be realistic and contextually appropriate for a company in this industry. If you don't have enough information, make educated guesses based on typical companies in this space.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that provides realistic company enrichment data based on limited information." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error getting company enrichment:", error);
    
    // Handle and categorize errors more precisely
    if (error.status === 429) {
      if (error.error?.code === 'insufficient_quota') {
        throw new Error("OpenAI API quota exceeded. Please check your billing details.");
      } else {
        throw new Error("OpenAI rate limit exceeded. Please try again after a few minutes.");
      }
    } else if (error.message && typeof error.message === 'string' && error.message.includes("API key")) {
      throw new Error("Invalid OpenAI API key. Please check your API key in the environment variables.");
    }
    
    // For other errors, return a default response
    return {
      technologies: ["Could not retrieve technologies"],
      fundingInfo: "Could not retrieve funding information: " + (error.message || "Unknown error"),
      recentNews: ["Could not retrieve recent news"],
      competitors: ["Could not retrieve competitors"]
    };
  }
}

/**
 * Create a detailed prompt for the lead generation
 */
function createLeadGenerationPrompt(request: LeadGenerationRequest): string {
  return `
I need you to generate ${request.count} potential sales leads for the DuPont Tedlar Graphics & Signage team based on the following criteria:

## Event Information
- Event Name: ${request.event.name}
- Event Date: ${request.event.date}
- Event Location: ${request.event.location}

## Ideal Customer Profile
- Industry: ${request.icpProfile.industry}
${request.icpProfile.subIndustry ? `- Sub-Industry: ${request.icpProfile.subIndustry}` : ''}
- Revenue Range: ${request.icpProfile.minRevenue} to ${request.icpProfile.maxRevenue}
- Geography: ${request.icpProfile.geography}
- Employee Count: ${request.icpProfile.minEmployees} to ${request.icpProfile.maxEmployees}
${request.icpProfile.additionalCriteria ? `- Additional Criteria: ${request.icpProfile.additionalCriteria}` : ''}

## Target Personas
${request.personas.map(persona => `- ${persona.type}: ${persona.titles} (${persona.department})`).join('\n')}

${request.filters && Object.keys(request.filters).length > 0 ? `
## Additional Filters
${request.filters.technologies?.length ? `- Technologies: ${request.filters.technologies.join(', ')}` : ''}
${request.filters.fundingStatus ? `- Funding Status: ${request.filters.fundingStatus}` : ''}
${request.filters.growth ? `- Growth Rate: ${request.filters.growth}` : ''}
${request.filters.recentEvents?.length ? `- Recent Events: ${request.filters.recentEvents.join(', ')}` : ''}
${request.filters.keywords?.length ? `- Keywords: ${request.filters.keywords.join(', ')}` : ''}
` : ''}

Please provide the results in the following JSON format:
{
  "leads": [
    {
      "company": {
        "name": "Company Name",
        "website": "company-website.com",
        "description": "Brief company description",
        "industry": "Specific industry",
        "size": "Employee count range",
        "revenue": "Revenue range",
        "location": "Headquarters location",
        "founded": "Year founded",
        "linkedInUrl": "https://linkedin.com/company/companyname"
      },
      "stakeholder": {
        "name": "Full Name",
        "title": "Job Title",
        "company": "Company Name",
        "linkedInUrl": "https://linkedin.com/in/firstname-lastname-123abc",
        "email": "email@domain.com (if available)",
        "phone": "phone number (if available)"
      },
      "matchReason": "1-2 sentence explanation of why this company matches our ICP",
      "fitScore": 85,
      "matchDetails": {
        "industryRelevance": 85,
        "productFit": 90,
        "decisionMakingAuthority": 80,
        "budgetAlignment": 75,
        "geographicMatch": 95,
        "companySize": "Medium",
        "matchingCriteria": [
          "Industry Fit – [Specific details about their industry focus and alignment with Tedlar's applications]",
          "Size & Revenue – [Company size and revenue statistics with specific numbers]",
          "Strategic Relevance – [Details about their market position and strategic importance]",
          "Industry Engagement – [Information about their participation in industry events and associations]",
          "Market Activity – [Recent developments, expansions, or initiatives relevant to Tedlar's products]",
          "Technology Usage – [Specific technologies or materials they use that could benefit from Tedlar]",
          "Growth Potential – [Evidence of growth or expansion in relevant areas]",
          "Decision Making – [Details about the stakeholder's authority and decision-making capabilities]",
          "Budget Alignment – [Information about their budget and investment in premium materials]",
          "Geographic Match – [Details about their location and market presence]"
        ]
      }
      ${request.includeEnrichment ? `,
      "enrichmentData": {
        "technologies": ["Tech 1", "Tech 2", "Tech 3"],
        "fundingInfo": "Recent funding information",
        "recentNews": ["News item 1", "News item 2"],
        "competitors": ["Competitor 1", "Competitor 2"]
      }` : ''}
      ${request.generateMessages ? `,
      "outreachMessage": "Personalized outreach message tailored to this stakeholder"` : ''}
    }
  ]
}

Please ensure:
1. All data is realistic and plausible
2. Companies chosen would likely attend this type of event
3. Stakeholders have appropriate titles based on the requested personas
4. Each lead includes a clear explanation of why they match our ICP
5. Fit scores range from 50-95 based on how well they match our criteria
6. Location info is consistent with the specified geography
7. Company details match the specified industry or sub-industry
8. Company sizes and revenues are within the specified ranges
9. For LinkedIn profiles, create REAL, working LinkedIn URLs with the format: https://linkedin.com/in/firstname-lastname-123abc (where the profile ID looks realistic)
10. Each matchDetails section should contain accurate numerical ratings (1-100) and specific matching criteria
11. The matchingCriteria should be specific and detailed for each prospect, not generic statements
12. Include specific statistics and numbers in the matching criteria where available
13. Research and include real industry events and associations they participate in
14. Provide concrete examples of their products or services that could benefit from Tedlar
15. Include specific details about their market position and recent developments`;
}

async function generateMatchReason(company: any, person: any, request: LeadGenerationRequest): Promise<string> {
  const prompt = `Generate a concise match reason for why ${company.name} (${company.industry}) and ${person.firstName} ${person.lastName} (${person.title}) would be a good fit for our product. Consider:
  - Industry alignment: ${company.industry}
  - Company size: ${company.size}
  - Revenue: ${company.revenue}
  - Location: ${company.location}
  - Person's role: ${person.title}
  - Person's department: ${person.department}
  - Person's seniority: ${person.seniority}
  
  Keep the reason brief and focused on the most relevant match factors.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI assistant that helps generate concise match reasons for sales leads." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || "No match reason generated";
}