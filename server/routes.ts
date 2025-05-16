import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertICPProfileSchema, insertPersonaSchema, leadGenerationRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { generateLeads, generateOutreachMessage, getCompanyEnrichment, LeadGenerationRequest, isValidApiKeyFormat } from "./services/openai";
import { ZodError } from "zod";
import * as z from "zod";
import OpenAI from "openai";

// Function to securely manage API keys
async function updateOpenAIAPIKey(apiKey: string): Promise<boolean> {
  try {
    // Check if key format is valid
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      throw new Error('Invalid API key format');
    }

    // Set environment variable
    process.env.OPENAI_API_KEY = apiKey;

    // Write to .env file (in a real-world scenario, you'd use a more secure storage method)
    // Omitting actual file writing here for security

    return true;
  } catch (error) {
    console.error('Error updating OpenAI API key:', error);
    return false;
  }
}

// Function to verify OpenAI API key
async function verifyOpenAIAPIKey(apiKey: string): Promise<boolean> {
  try {
    // Check key format first
    if (!isValidApiKeyFormat(apiKey)) {
      return false;
    }

    // Initialize with the key to check
    const openai = new OpenAI({ apiKey });

    // Make a simple API call to verify key works
    await openai.models.list();

    return true;
  } catch (error) {
    console.error('Error verifying OpenAI API key:', error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // API Key settings validation schema
  const apiKeySchema = z.object({
    apiKey: z.string().min(20).max(100)
  });

  // Get current user
  router.get("/user", async (req, res) => {
    // For simplicity, return the first user in storage
    const users = await Promise.all(
      Array.from({ length: 1 }, (_, i) => storage.getUser(i + 1))
    );
    const user = users.find(Boolean);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Get ICP profiles for a user
  router.get("/icp-profiles", async (req, res) => {
    // Default to user ID 1 for simplicity
    const userId = 1;
    const profiles = await storage.getICPProfiles(userId);
    res.json(profiles);
  });

  // Create new ICP profile
  router.post("/icp-profiles", async (req, res) => {
    try {
      const profileData = insertICPProfileSchema.parse(req.body);
      const newProfile = await storage.createICPProfile(profileData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating ICP profile:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get ICP profile by ID
  router.get("/icp-profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const profile = await storage.getICPProfile(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  });

  // Update ICP profile
  router.patch("/icp-profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    try {
      const profileData = insertICPProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateICPProfile(id, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error updating ICP profile:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Delete ICP profile
  router.delete("/icp-profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const success = await storage.deleteICPProfile(id);
    if (!success) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.status(204).end();
  });

  // Get all events
  router.get("/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });
  
  // Sync events from web sources
  router.post("/events/sync", async (req, res) => {
    try {
      // First try the regular import
      let syncEventsModule;
      try {
        syncEventsModule = await import('./services/eventScraper.js');
      } catch (importError) {
        // Fallback to .ts extension if .js fails
        syncEventsModule = await import('./services/eventScraper.ts');
      }
      
      const { syncEvents } = syncEventsModule;
      const events = await syncEvents();
      res.json(events);
    } catch (error) {
      console.error("Error syncing events:", error);
      res.status(500).json({ 
        message: "Failed to sync events", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get event by ID
  router.get("/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const event = await storage.getEvent(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  });

  // Get personas for a user
  router.get("/personas", async (req, res) => {
    // Default to user ID 1 for simplicity
    const userId = 1;
    const personas = await storage.getPersonas(userId);
    res.json(personas);
  });

  // Create new persona
  router.post("/personas", async (req, res) => {
    try {
      const personaData = insertPersonaSchema.parse(req.body);
      const newPersona = await storage.createPersona(personaData);
      res.status(201).json(newPersona);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating persona:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Update persona
  router.patch("/personas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    try {
      const personaData = insertPersonaSchema.partial().parse(req.body);
      const updatedPersona = await storage.updatePersona(id, personaData);
      
      if (!updatedPersona) {
        return res.status(404).json({ message: "Persona not found" });
      }
      
      res.json(updatedPersona);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error updating persona:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Delete persona
  router.delete("/personas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const success = await storage.deletePersona(id);
    if (!success) {
      return res.status(404).json({ message: "Persona not found" });
    }
    
    res.status(204).end();
  });

  // Get all leads for a user
  router.get("/leads", async (req, res) => {
    // Default to user ID 1 for simplicity
    const userId = 1;
    const leads = await storage.getLeads(userId);
    res.json(leads);
  });

  // Get leads by ICP profile
  router.get("/leads/icp/:icpProfileId", async (req, res) => {
    const userId = 1;
    const icpProfileId = parseInt(req.params.icpProfileId);
    if (isNaN(icpProfileId)) {
      return res.status(400).json({ message: "Invalid ICP profile ID format" });
    }
    
    const leads = await storage.getLeadsByICPProfile(userId, icpProfileId);
    res.json(leads);
  });

  // Get leads by event
  router.get("/leads/event/:eventId", async (req, res) => {
    const userId = 1;
    const eventId = parseInt(req.params.eventId);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }
    
    const leads = await storage.getLeadsByEvent(userId, eventId);
    res.json(leads);
  });

  // Get lead by ID
  router.get("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lead ID format" });
    }
    
    const lead = await storage.getLead(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.json(lead);
  });

  // Update lead
  router.patch("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lead ID format" });
    }
    
    try {
      const updatedLead = await storage.updateLead(id, req.body);
      
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete lead
  router.delete("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lead ID format" });
    }
    
    const success = await storage.deleteLead(id);
    if (!success) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.status(204).end();
  });

  // Generate leads using AI
  router.post("/generate-leads", async (req, res) => {
    try {
      // Validate the request
      const requestData = leadGenerationRequestSchema.parse(req.body);
      const userId = 1; // Default to user ID 1 for simplicity

      // Get ICP profile and event data
      const icpProfile = await storage.getICPProfile(requestData.icpProfileId);
      if (!icpProfile) {
        return res.status(404).json({ message: "ICP profile not found" });
      }

      const event = await storage.getEvent(requestData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Get personas
      const personas = await Promise.all(
        requestData.personaIds.map(id => storage.getPersona(id))
      );
      const validPersonas = personas.filter(Boolean);

      if (validPersonas.length === 0) {
        return res.status(400).json({ message: "No valid personas provided" });
      }

      // Prepare the OpenAI request
      const openAIRequest: LeadGenerationRequest = {
        event: {
          name: event.name,
          date: event.date,
          location: event.location
        },
        icpProfile: {
          industry: icpProfile.industry,
          subIndustry: icpProfile.subIndustry,
          minRevenue: icpProfile.minRevenue,
          maxRevenue: icpProfile.maxRevenue,
          geography: icpProfile.geography,
          minEmployees: icpProfile.minEmployees,
          maxEmployees: icpProfile.maxEmployees,
          additionalCriteria: icpProfile.additionalCriteria
        },
        personas: validPersonas.map(persona => ({
          type: persona.type,
          titles: persona.titles,
          department: persona.department
        })),
        filters: requestData.filters,
        count: requestData.count,
        includeEnrichment: requestData.includeEnrichment,
        generateMessages: requestData.generateMessages
      };

      // Call OpenAI to generate leads
      const generatedLeads = await generateLeads(openAIRequest);

      // Store the generated leads in the database
      const leadsToCreate = generatedLeads.map(lead => ({
        userId,
        icpProfileId: icpProfile.id,
        eventId: event.id,
        companyName: lead.company.name,
        companyWebsite: lead.company.website,
        companyDescription: lead.company.description,
        companyIndustry: lead.company.industry,
        companySize: lead.company.size,
        companyRevenue: lead.company.revenue,
        companyLocation: lead.company.location,
        companyFounded: lead.company.founded,
        companyLinkedIn: lead.company.linkedInUrl,
        stakeholderName: lead.stakeholder.name,
        stakeholderTitle: lead.stakeholder.title,
        stakeholderLinkedIn: lead.stakeholder.linkedInUrl,
        stakeholderEmail: lead.stakeholder.email,
        stakeholderPhone: lead.stakeholder.phone,
        matchReason: lead.matchReason,
        fitScore: lead.fitScore,
        outreachMessage: lead.outreachMessage,
        enrichmentData: lead.enrichmentData,
        status: "new"
      }));

      const createdLeads = await storage.createLeadsBatch(leadsToCreate);

      // Update the ICP profile's last used date and match count
      await storage.updateICPProfile(icpProfile.id, {
        lastUsed: new Date(),
        matchCount: (icpProfile.matchCount || 0) + createdLeads.length
      });

      // Return the created leads
      res.status(201).json(createdLeads);
    } catch (error) {
      console.error("Error generating leads:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Handle OpenAI API specific errors
      if (error.message && error.message.includes("API key provided")) {
        return res.status(500).json({ 
          message: "Failed to generate leads", 
          error: "Invalid OpenAI API key. Please check your API key in the environment variables.",
          code: "invalid_api_key"
        });
      }
      
      // Handle rate limit and quota errors
      if (error.status === 429) {
        // Check for quota exceeded specifically
        if (error.error?.code === "insufficient_quota" || 
            (error.message && error.message.includes("quota exceeded"))) {
          return res.status(429).json({ 
            message: "OpenAI API quota exceeded. Please check your billing details.", 
            error: "You have exceeded your OpenAI API quota. Please check your billing details.",
            code: "quota_exceeded"
          });
        } else {
          // Regular rate limit
          return res.status(429).json({ 
            message: "OpenAI rate limit exceeded. Please try again later.", 
            error: "Too many requests to the OpenAI API. Try again in a few minutes.",
            code: "rate_limit_exceeded"
          });
        }
      }
      
      // General error response
      res.status(500).json({ 
        message: "Failed to generate leads", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Generate a single outreach message
  router.post("/generate-outreach", async (req, res) => {
    try {
      const { leadId } = req.body;

      if (!leadId) {
        return res.status(400).json({ message: "Lead ID is required" });
      }

      const lead = await storage.getLead(parseInt(leadId));
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      const event = await storage.getEvent(lead.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const icpProfile = await storage.getICPProfile(lead.icpProfileId);
      if (!icpProfile) {
        return res.status(404).json({ message: "ICP profile not found" });
      }

      // Create a partial request with relevant data
      const openAIRequest: LeadGenerationRequest = {
        event: {
          name: event.name,
          date: event.date,
          location: event.location
        },
        icpProfile: {
          industry: icpProfile.industry,
          subIndustry: icpProfile.subIndustry,
          minRevenue: icpProfile.minRevenue,
          maxRevenue: icpProfile.maxRevenue,
          geography: icpProfile.geography,
          minEmployees: icpProfile.minEmployees,
          maxEmployees: icpProfile.maxEmployees,
          additionalCriteria: icpProfile.additionalCriteria
        },
        personas: [], // Not needed for outreach generation
        count: 1,
        includeEnrichment: false,
        generateMessages: true
      };

      // Create partial lead object
      const partialLead = {
        company: {
          name: lead.companyName,
          industry: lead.companyIndustry
        },
        stakeholder: {
          name: lead.stakeholderName,
          title: lead.stakeholderTitle
        },
        matchReason: lead.matchReason
      };

      const outreachMessage = await generateOutreachMessage(partialLead, openAIRequest);

      // Update the lead with the new outreach message
      const updatedLead = await storage.updateLead(lead.id, { outreachMessage });

      res.json({ outreachMessage, lead: updatedLead });
    } catch (error) {
      console.error("Error generating outreach message:", error);

      // Handle OpenAI API specific errors
      if (error.message && error.message.includes("API key provided")) {
        return res.status(500).json({ 
          message: "Failed to generate outreach message", 
          error: "Invalid OpenAI API key. Please check your API key in the environment variables.",
          code: "invalid_api_key"
        });
      }

      // Handle rate limit and quota errors
      if (error.status === 429) {
        // Check for quota exceeded specifically
        if (error.error?.code === "insufficient_quota" || 
            (error.message && error.message.includes("quota exceeded"))) {
          return res.status(429).json({ 
            message: "OpenAI API quota exceeded. Please check your billing details.", 
            error: "You have exceeded your OpenAI API quota. Please check your billing details.",
            code: "quota_exceeded"
          });
        } else {
          // Regular rate limit
          return res.status(429).json({ 
            message: "OpenAI rate limit exceeded. Please try again later.", 
            error: "Too many requests to the OpenAI API. Try again in a few minutes.",
            code: "rate_limit_exceeded"
          });
        }
      }

      // General error response
      res.status(500).json({ 
        message: "Failed to generate outreach message", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Settings endpoints for managing OpenAI API key
  router.get("/settings/openai-key-status", async (_req, res) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const hasKey = !!apiKey;
      const isValid = hasKey && isValidApiKeyFormat(apiKey);
      
      res.json({
        hasKey,
        isValid
      });
    } catch (error) {
      console.error('Error checking API key status:', error);
      res.status(500).json({ message: 'Failed to check API key status' });
    }
  });
  
  router.post("/settings/check-openai-key", async (req, res) => {
    try {
      const result = apiKeySchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const { apiKey } = result.data;
      const isValid = await verifyOpenAIAPIKey(apiKey);
      
      res.json({
        isValid,
        message: isValid ? 'API key is valid' : 'API key is invalid or has insufficient permissions'
      });
    } catch (error) {
      console.error('Error verifying API key:', error);
      res.status(500).json({ message: 'Failed to verify API key' });
    }
  });
  
  router.post("/settings/openai-key", async (req, res) => {
    try {
      const result = apiKeySchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const { apiKey } = result.data;
      
      // Verify the key works before saving
      const isValid = await verifyOpenAIAPIKey(apiKey);
      if (!isValid) {
        return res.status(400).json({ 
          message: 'Invalid API key. The key format is correct but it could not be verified with OpenAI.'
        });
      }
      
      // Save the key
      const updated = await updateOpenAIAPIKey(apiKey);
      if (!updated) {
        return res.status(500).json({ message: 'Failed to save API key' });
      }
      
      res.json({ 
        success: true,
        message: 'API key saved successfully' 
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      res.status(500).json({ message: 'Failed to save API key' });
    }
  });

  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}