# LeadsGen.AI

<img width="1434" alt="Screenshot 2025-05-15 at 3 52 41 PM" src="https://github.com/user-attachments/assets/4f1eba4f-8229-4b10-aa14-34f481061173" />

An AI-powered lead generation and outreach platform for DuPont Tedlar's Graphics & Signage team. The system automates finding and qualifying sales leads by researching industry events and trade associations where potential customers might be present.


Built by [Nicole Hao](https://nicolehao34.github.io/) with **scalability** and **generalizability** in mind. 


Ready to be adapted to different product teams at DuPont Tedlar. ✨

## Updates
WELCOME TO THE DEMO BRANCH. 

**May 15, 2025 Update - I have no LinkedIn API Key >:(** 
I REMOVED ALL LINKEDIN SERVICES HERE SO EVEN IF YOU DON'T HAVE A LINKEDIN API KEY, YOU SHOULD BE ABLE TO RUN THE DEMO ITSELF. There's some residue of my attempts at linkedin sales navigator integration in the dev branch. I'll keep working on it!

**May 15, 2025 Update**: I used replit to help with fast deployment. [Check it out!](https://genlead-ai-nicolehao7.replit.app/)

## Table of Contents
- [Features Overview](#features-overview)
- [Getting Started... So, how do I use LeadsGen.AI?](#getting-started-so-how-do-i-use-leadsgennai)
   - [Installation](#installation)
   - [Starting the Application](#starting-the-application)
- [Documentation](#documentation)
- [Demo/Walkthrough](#demowalkthrough)
- [End-User Guide](#end-user-guide)
   - [Step 1: Select or Create an Ideal Customer Profile (ICP)](#step-1-select-or-create-an-ideal-customer-profile-icp)
   - [Step 2: Target Event Selection](#step-2-target-event-selection)
   - [Step 3: Configure Filters](#step-3-configure-filters)
   - [Step 4: Identify Decision Makers](#step-4-identify-decision-makers)
   - [Step 5: Generate Leads](#step-5-generate-leads)
   - [Step 5: Review Leads](#step-5-review-leads)
   - [Step 6: Export Leads](#step-6-export-leads)
   - [Additional Features](#additional-features)
- [Future Work](#future-work)
- [License](#license)

## Features Overview

- 🎯 **ICP Targeting**: Define and select Ideal Customer Profiles (ICPs)
- 🔍 **Event Research**: Explore industry events with source citations (now scraped live from the FESPA website; more sources can be added)
- 📋 **Stakeholder Personas**: Define and target specific roles within organizations
- 🤖 **AI-Powered Lead Generation**: Generate qualified leads with match reasons and fit scores
- 💼 **Data Enrichment**: Enhance leads with extra company and stakeholder information
- ✉️ **Personalized Outreach**: Generate custom outreach messages based on ICP and stakeholder
- 📊 **Lead Management**: Review, filter, and export leads

## Getting Started... So, how do I use LeadsGen.AI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key and LinkedIn Sales Navigator API Key:
   ```
   OPENAI_API_KEY=your_key_here
   ```

   or in your terminal, enter
   ```
   export OPENAI_API_KEY=sk-YOUR-API-KEY-HERE
   ```
   

### Starting the Application

Run the development server:
```
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Documentation

For more detailed information, see:

- [Technical Documentation](DOCUMENTATION.md) - System architecture, tech stack, data storage, data flow, data processing


## Demo/Walkthrough
[https://www.loom.com/share/127c02e726394d038c29dd18419ce4d8?sid=7ff1b0c6-f1e7-4877-93ee-48ea8ae139ca](https://www.loom.com/share/127c02e726394d038c29dd18419ce4d8?sid=7ff1b0c6-f1e7-4877-93ee-48ea8ae139ca)



# End-User Guide
(For the end-users at the sales team of Dupont-Tedlar.)

Assuming that you are an end-user who's working at DuPont Tedlar's sales team named John Smith (I know, great name!), and that you have already logged in using your company email/acount. 
## Step 1: Select or Create an Ideal Customer Profile (ICP)

The first step is to define who your ideal customers are.

### Select an Existing ICP

1. View the list of previously created ICPs
2. Each ICP card shows:
   - Profile name
   - Industry focus
   - Size and revenue range
   - Match count (if previously used)
   - Last used date
3. Click on an ICP card to select it
4. Click "Continue" to proceed to the next step

### Create a New ICP

1. Click the "Create New Profile" button
2. In the modal that appears, fill in:
   - Profile name (e.g., "Architectural Signage Companies")
   - Industry (e.g., "Manufacturing")
   - Sub-industry (optional, e.g., "Architectural Signage")
   - Revenue range (Min and Max)
   - Geographic focus (e.g., "North America")
   - Employee count range (Min and Max)
   - Additional criteria (optional, specific requirements)
3. Click "Save Profile"
4. Your new ICP will appear in the list and be automatically selected
5. Click "Continue" to proceed

## Step 2: Target Event Selection

Next, select the industry event where you want to find potential leads.

### Select from Industry Events

1. Browse the list of industry events (scraped live from FESPA; more sources can be added in the future)
2. Each event card shows:
   - Event name
   - Date and location
   - Exhibitor count (when available)
   - Last updated info
3. Click "View Source" to see the original source of the event information
4. Click on an event card to select it

### Sync Latest Events

1. Click the "Sync Web Events" button
2. Confirm the sync operation in the dialog
3. The platform will fetch the latest events from industry sources
4. New events will appear in the list

### Upload Custom List

Alternatively, you can upload your own list of companies:

1. Click "Upload CSV" in the upload section
2. Select a CSV file with company information
3. OR click "Paste URLs" to manually enter company website URLs

4. Click "Continue" to proceed

## Step 3: Configure Filters

Fine-tune your lead generation with additional filters.

### Stakeholder Personas

1. Define who you want to target within organizations:
   - Select persona types (Decision Maker, Influencer, User) (More could be added upon request)
   - Enter job titles to target (separated by commas)
   - Select departments (Sales, Marketing, Operations, etc.)
2. Add multiple personas by clicking "Add Another Persona"

### Strategic Qualification

1. Company Size Filters:
   - Set minimum and maximum employee counts to target appropriate company sizes
   - Ranges from small businesses to enterprise organizations

2. Revenue Filters:
   - Define minimum and maximum annual revenue thresholds
   - Target companies with appropriate financial resources

3. Strategic Relevance:
   - Identify major players in the signage/graphics industry
   - Focus on companies with material innovation capabilities
   - Target organizations expanding in areas aligned with Tedlar
   - Identify potential strategic partnerships
   - Monitor competitors using alternative solutions

4. Industry Engagement:
   - Companies exhibiting at key trade shows
   - Organizations active in industry associations
   - Businesses presenting at industry conferences
   - Companies participating in industry research
   - Organizations demonstrating industry thought leadership

5. Market Activity:
   - Companies expanding into durable materials
   - Organizations launching weather-resistant products
   - Businesses focusing on sustainability initiatives
   - Companies with recent acquisitions in related areas
   - Organizations with R&D in protective solutions

6. Relevance Score Threshold:
   - Set minimum match percentage required (0-100%)
   - Higher thresholds yield fewer but more relevant leads

### Additional Filters

1. Technology filters:
   - Select technologies your targets might be using
2. Business status filters:
   - Funding status (Bootstrapped, Series A, etc.)
   - Growth stage (Startup, Growth, Mature)
3. Keyword filters:
   - Add specific keywords to look for

### Lead Generation Options

1. Set the number of leads to generate (25-200)
2. Toggle "Include Enrichment Data" to get additional company information
3. Toggle "Generate Personalized Messages" to create outreach templates

4. Click "Continue" to proceed

## Step 4: Identify Decision Makers

Identify and select the most qualified stakeholders at target companies.

1. Select your data source:
   - LinkedIn Sales Navigator: For professional social data (not fully implemented yet for the latest demo.)

2. Define search criteria:
   - Enter target job titles (e.g. "VP of Product Development", "Director of Innovation")
   - Optionally specify target companies (or leave blank to search all event-related companies)
   - Set minimum relevance score threshold (higher = more relevant but fewer results)

3. Click "Find Decision Makers" to initiate the search

4. Review qualified decision makers:
   - Each result includes name, title, company, and contact information
   - View LinkedIn profile links
   - See relevance score and qualification rationale
   - Select decision makers by checking the boxes

5. Confirm your selection to proceed

## Step 5: Generate Leads

Review your selections and generate leads.

1. Verify your selections:
   - Selected ICP
   - Target event
   - Strategic filters and personas
   - Selected decision makers
2. Click "Generate Leads" to start the process
3. The AI will analyze the event data against your ICP and filters
4. Once complete, you'll automatically proceed to the review stage

## Step 5: Review Leads

Evaluate and refine the generated leads.

### Lead Table

1. Browse the table of generated leads with columns for:
   - Company name
   - Stakeholder info
   - Match percentage
   - Status
2. Sort by any column by clicking the column header
3. Filter using the search bar or filter dropdown

### Lead Details

1. Click on a lead row to view detailed information:
   - Company profile (website, industry, size, revenue, location)
   - Stakeholder details (name, title, contact info)
   - Match reasons and fit score
   - Enrichment data (when available):
     - Technologies used
     - Funding information
     - Recent news
     - Competitors
   - Personalized outreach message

### Update Leads

1. Edit any lead information by clicking the edit icon
2. Update the lead status:
   - New
   - Contacted
   - Qualified
   - Disqualified
3. Save your changes
4. Click "Continue" to proceed

## Step 6: Export Leads

Final step: export your qualified leads.

### Export Options

1. Select export format:
   - CSV (for spreadsheets)
   - JSON (for system integrations)
2. Choose what to include:
   - All leads
   - Only qualified leads
   - Custom selection
3. Select fields to export
4. Click "Export" to download the file

### Next Steps

1. Import the leads into your CRM system
2. Begin outreach using the personalized messages
3. Track lead status in your sales pipeline

## Additional Features

### Saving & Resuming Work

- Your progress is automatically saved at each step
- You can exit and come back to continue from where you left off
- Use the step navigation at the top to move between steps

### Managing ICPs

- View and edit your ICPs from the ICP Selection screen
- Delete outdated ICPs using the delete icon
- ICPs are saved for future use


## Future Work
There are so many more features I would like to fully implement if I had more time. Here's a few that I will keep working on:

### Allowing multiple selections on target events page

Right now, you can only select one target event because it's a prototype. In the future, the end-user will be able to select multiple events.

### Adding Lead Genneration Progress Bar/Animation
Need to add either (1) a Progress bar that will show the lead generation status or (2) a generating leads animation after clicking on the generate leads button.

### Exporting leads and uploading them to CRM platforms
As title. The backend for this is not implemented yet. But would help with Dupont Tedlar's workflow integration.

### Displaying Match Details with Sources
Each generated lead should have a tab on its page named match details that shows exactly which previously specified criteria the lead matched with, this can be done using the GPT-o4 model as well. 

Currently, if you click on the tab, it displays the following message:
No detailed match criteria available for this lead
This lead was generated with an earlier version of the system which didn't include detailed matching metrics.

### Enabling Linkedin Sales Navigator API
I have the backend and the frontend setup for this feature but I unfortunately don't have a linkedin API key.... So as a result the linkedin links you see in the demo are all invalid. In the main branch, I still kept most of the backend functionalities for linkedin services. If you are curious.

### Feedback Loop

I didn't get the time to implement this fully, but ideally, after contacting leads, the end-user should be able to update their status to improve future lead generation, to truly create a humna-in-the-loop ai agent experience. For example:

1. User should be able to navigate to the "Review Leads" step
2. Then Update lead statuses based on actual interactions
3. This feedback helps the AI improve future recommendations


## License

Proprietary - All rights reserved.

