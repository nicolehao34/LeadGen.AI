import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  avatar: text("avatar"),
});

export const icpProfiles = pgTable("icp_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  subIndustry: text("sub_industry"),
  minRevenue: text("min_revenue").notNull(),
  maxRevenue: text("max_revenue").notNull(),
  geography: text("geography").notNull(),
  minEmployees: text("min_employees").notNull(),
  maxEmployees: text("max_employees").notNull(),
  additionalCriteria: text("additional_criteria"),
  lastUsed: timestamp("last_used"),
  matchCount: integer("match_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  exhibitorCount: integer("exhibitor_count"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  sourceUrl: text("source_url"),
});

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  titles: text("titles").notNull(),
  department: text("department").notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  icpProfileId: integer("icp_profile_id").notNull(),
  eventId: integer("event_id").notNull(),
  companyName: text("company_name").notNull(),
  companyWebsite: text("company_website"),
  companyDescription: text("company_description"),
  companyIndustry: text("company_industry"),
  companySize: text("company_size"),
  companyRevenue: text("company_revenue"),
  companyLocation: text("company_location"),
  companyFounded: text("company_founded"),
  companyLinkedIn: text("company_linkedin"),
  stakeholderName: text("stakeholder_name").notNull(),
  stakeholderTitle: text("stakeholder_title").notNull(),
  stakeholderLinkedIn: text("stakeholder_linkedin"),
  stakeholderEmail: text("stakeholder_email"),
  stakeholderPhone: text("stakeholder_phone"),
  matchReason: text("match_reason"),
  fitScore: integer("fit_score"),
  outreachMessage: text("outreach_message"),
  enrichmentData: jsonb("enrichment_data"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("new"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  avatar: true,
});

export const insertICPProfileSchema = createInsertSchema(icpProfiles).omit({
  id: true,
  lastUsed: true,
  matchCount: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  lastUpdated: true,
});

export const insertPersonaSchema = createInsertSchema(personas).omit({
  id: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

// Define a schema for lead generation requests
export const leadGenerationRequestSchema = z.object({
  icpProfileId: z.number(),
  eventId: z.number(),
  personaIds: z.array(z.number()),
  count: z.number().min(1).max(200).default(25),
  includeEnrichment: z.boolean().default(true),
  generateMessages: z.boolean().default(true),
  filters: z.object({
    technologies: z.array(z.string()).optional(),
    fundingStatus: z.string().optional(),
    growth: z.string().optional(),
    recentEvents: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertICPProfile = z.infer<typeof insertICPProfileSchema>;
export type ICPProfile = typeof icpProfiles.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertPersona = z.infer<typeof insertPersonaSchema>;
export type Persona = typeof personas.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type LeadGenerationRequest = z.infer<typeof leadGenerationRequestSchema>;
