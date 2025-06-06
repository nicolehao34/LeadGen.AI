# DuPont Tedlar Lead Generation Platform Documentation

## Overview

The DuPont Tedlar Lead Generation Platform is an AI-powered system designed to automate the process of finding and qualifying potential leads for DuPont Tedlar's Graphics & Signage team. The platform uses industry event data, Ideal Customer Profile (ICP) matching, and AI-driven qualification processes to identify and prioritize potential customers.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Structure](#frontend-structure)
3. [Backend API](#backend-api)
4. [Data Storage](#data-storage)
5. [Data Types & Schema](#data-types--schema)
6. [Lead Generation Process](#lead-generation-process)
7. [External Integrations](#external-integrations)

## System Architecture

The platform uses a modern React-based frontend with a Node.js Express backend. The application follows a workflow-based approach where users:

1. Define their Ideal Customer Profile (ICP)
2. Select target industry events
3. Configure filtering criteria
4. Generate qualified leads through AI analysis
5. Review and refine lead results
6. Export leads to external systems

### Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Node.js with Express
- **Data Storage**: In-memory storage (can be upgraded to PostgreSQL)
- **AI Processing**: OpenAI API integration
- **Data Scraping**: Web scraping for event data with proper citations

## Frontend Structure

The frontend is built as a single-page application with multiple logical steps:

- **WorkflowContext**: Global state management for the lead generation workflow
- **ICPSelection**: Selection and creation of Ideal Customer Profile criteria
- **TargetEventSelector**: Selection of industry events with source citations
- **ConfigureFilters**: Filtering options for lead generation
- **GenerateLeads**: Interface for initiating the lead generation process
- **ReviewLeads**: Review and management of generated leads
- **ExportLeads**: Export leads to CSV/JSON for external use

### UI Framework

The UI is built with shadcn components which provide accessible, customizable interface elements. The design follows a clean dashboard layout with:

- Step-based navigation
- Form-based input handling with validation
- Data tables for lead review
- Modal dialogs for detailed views
- Toast notifications for user feedback

## Backend API

The backend provides REST API endpoints to support all frontend operations:

### Core Endpoints

#### Users
- `GET /api/user` - Get current user
- `GET /api/user/:id` - Get user by ID

#### ICP Profiles
- `GET /api/icp-profiles` - Get all ICP profiles for the current user
- `GET /api/icp-profiles/:id` - Get specific ICP profile
- `POST /api/icp-profiles` - Create a new ICP profile
- `PATCH /api/icp-profiles/:id` - Update an ICP profile
- `DELETE /api/icp-profiles/:id` - Delete an ICP profile

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events/sync` - Sync events from web sources

#### Personas
- `GET /api/personas` - Get all personas for the current user
- `POST /api/personas` - Create a new persona
- `PATCH /api/personas/:id` - Update a persona
- `DELETE /api/personas/:id` - Delete a persona

#### Leads
- `GET /api/leads` - Get all leads for the current user
- `GET /api/leads/:id` - Get specific lead
- `POST /api/leads/generate` - Generate new leads based on criteria
- `POST /api/leads` - Create a new lead manually
- `PATCH /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead


## Data Storage

The application currently uses an in-memory storage solution for development, but is designed to easily transition to a PostgreSQL database:

### Storage Interface

The storage system is abstracted through the `IStorage` interface in `server/storage.ts`, which provides methods for:

- User management
- ICP profile CRUD operations
- Event management including web syncing
- Persona definition and management
- Lead generation, retrieval, and management

### Database Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM with properly typed entities:

- **users**: User accounts and authentication
- **icpProfiles**: Ideal Customer Profile definitions
- **events**: Industry events with source citations
- **personas**: Target stakeholder definitions
- **leads**: Generated and qualified leads

## Data Types & Schema

The application uses TypeScript for robust type safety. Core data types include:

### User
```typescript
interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}
```

### ICP Profile
```typescript
interface ICPProfile {
  id: number;
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
  lastUsed?: Date;
  matchCount?: number;
  createdAt?: Date;
}
```

### Event
```typescript
interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  exhibitorCount?: number;
  lastUpdated?: Date;
  sourceUrl?: string;
}
```

### Persona
```typescript
interface Persona {
  id?: number;
  userId: number;
  type: string;
  titles: string;
  department: string;
}
```

### Lead
```typescript
interface Lead {
  id: number;
  userId: number;
  icpProfileId: number;
  eventId: number;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyIndustry?: string;
  companySize?: string;
  companyRevenue?: string;
  companyLocation?: string;
  companyFounded?: string;
  companyLinkedIn?: string;
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
  createdAt: Date;
  status: string;
}
```

## Lead Generation Process

The lead generation process consists of several steps:

### 1. ICP Definition
Users define their Ideal Customer Profile criteria including:
- Industry and sub-industry focus
- Company size (employee count)
- Revenue range
- Geographic focus
- Additional qualifying criteria

### 2. Event Targeting
The system queries the GPT-o4 model to search the web for the latest events in the previously selected indutry. Then the end-users can select industry events from:
- Pre-synced events from web sources with proper citations
- After clicking on sync web button, the newly updated events scraped from the internet using GPT-04
- Custom uploaded events/companies (csv files)

### 3. Filtering Configuration
Users define additional filters for lead generation:
- Stakeholder personas (titles, departments)
- Company size (number of employees)
- Annual revenue ranges
- Strategic relevance criteria:
  - Industry position (major players, innovators, etc.)
  - Market activity (expansion into relevant areas, new product launches)
  - Industry engagement (participation in trade shows, associations)
- Technology usage
- Funding status
- Growth indicators
- Keywords or specific criteria
- Minimum strategic relevance score threshold

### 4. AI-Powered Lead Generation
The system uses OpenAI to generate leads by:
1. Analyzing the ICP and event attendees
2. Identifying potential matches
3. Qualifying leads based on set criteria
4. Generating match reasons and fit scores
5. Creating personalized outreach messages
6. Enriching leads with additional data (technologies, funding, competitors)

### 5. Decision-Maker Identification
The platform identifies and validates specific decision-makers at target companies:

- Integrates with LinkedIn Sales Navigator and Clay API for real-time stakeholder data
- Focuses on key roles like:
  - VPs of Product Development
  - Directors of Innovation
  - R&D Leaders focused on coatings and protective solutions
- Qualifies decision-makers based on:
  - Relevance to Tedlar applications
  - Authority to make purchasing decisions
  - Professional background and experience
  - Current responsibilities and role
- Enables filtering and selection of the most qualified stakeholders
- Each identified decision-maker includes:
  - Complete contact information (when available)
  - LinkedIn profile URL
  - Qualification rationale
  - Strategic relevance score

### 6. Personalized Outreach Generation
For each qualified decision-maker, the system generates:

- Customized email templates
- LinkedIn connection messages
- All messaging is tailored to:
  - The specific decision-maker's role and responsibilities
  - The company's strategic relevance to DuPont Tedlar
  - The specific product fit and value proposition
  - Current industry trends and challenges

### 7. Lead Review and Refinement
Users can now:
- Review generated leads
- Adjust fit scores
- Edit outreach messages
- Update lead status
- Prioritize leads for outreach

### 8. Lead Export
Users can export leads to:
- CSV for spreadsheet applications
- JSON for system integrations
- Formatted reports for sharing

## External Integrations

The platform is designed to potentially integrate with:

- **LinkedIn Sales Navigator**: For stakeholder information
- **CRM Systems**: For lead management
- **Email Marketing Tools**: For outreach automation
- **Data Enrichment Services**: For additional company insights

### Web Scraping Integration

The platform includes web scraping capabilities to fetch the latest events from sources such as:
- FESPA (Federation of European Screen Printers Associations)
- ISA (International Sign Association)
- SGIA (Specialty Graphic Imaging Association)
- Other relevant industry event sites

All web-scraped data includes source citations to maintain data integrity and authenticity.
