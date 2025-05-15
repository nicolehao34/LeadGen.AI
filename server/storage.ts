import { 
  users, type User, type InsertUser,
  icpProfiles, type ICPProfile, type InsertICPProfile,
  events, type Event, type InsertEvent,
  personas, type Persona, type InsertPersona,
  leads, type Lead, type InsertLead
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // ICP Profiles
  getICPProfiles(userId: number): Promise<ICPProfile[]>;
  getICPProfile(id: number): Promise<ICPProfile | undefined>;
  createICPProfile(profile: InsertICPProfile): Promise<ICPProfile>;
  updateICPProfile(id: number, profile: Partial<InsertICPProfile>): Promise<ICPProfile | undefined>;
  deleteICPProfile(id: number): Promise<boolean>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Personas
  getPersonas(userId: number): Promise<Persona[]>;
  getPersona(id: number): Promise<Persona | undefined>;
  createPersona(persona: InsertPersona): Promise<Persona>;
  updatePersona(id: number, persona: Partial<InsertPersona>): Promise<Persona | undefined>;
  deletePersona(id: number): Promise<boolean>;
  
  // Leads
  getLeads(userId: number): Promise<Lead[]>;
  getLeadsByEvent(userId: number, eventId: number): Promise<Lead[]>;
  getLeadsByICPProfile(userId: number, icpProfileId: number): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  createLeadsBatch(leads: InsertLead[]): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private icpProfiles: Map<number, ICPProfile>;
  private events: Map<number, Event>;
  private personas: Map<number, Persona>;
  private leads: Map<number, Lead>;
  
  private userId: number;
  private profileId: number;
  private eventId: number;
  private personaId: number;
  private leadId: number;

  constructor() {
    this.users = new Map();
    this.icpProfiles = new Map();
    this.events = new Map();
    this.personas = new Map();
    this.leads = new Map();
    
    this.userId = 1;
    this.profileId = 1;
    this.eventId = 1;
    this.personaId = 1;
    this.leadId = 1;
    
    // Seed some sample data
    const user: User = { 
      id: this.userId++, 
      username: 'johnsmith', 
      password: 'password',
      fullName: 'John Smith',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
    this.users.set(user.id, user);
    
    // Sample events
    const events: Event[] = [
      {
        id: this.eventId++,
        name: 'DigitalSignage Expo 2023',
        date: 'Jun 12-15, 2023',
        location: 'Las Vegas, NV',
        exhibitorCount: 320,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        sourceUrl: 'https://www.digitalsignageexpo.net'
      },
      {
        id: this.eventId++,
        name: 'ManufacturingTech Summit',
        date: 'Jul 8-10, 2023',
        location: 'Chicago, IL',
        exhibitorCount: 175,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        sourceUrl: 'https://www.manufacturingtechsummit.com'
      },
      {
        id: this.eventId++,
        name: 'Healthcare Innovation Conference',
        date: 'Aug 15-17, 2023',
        location: 'Boston, MA',
        exhibitorCount: 210,
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        sourceUrl: 'https://www.healthcareinnovationconf.org'
      }
    ];
    
    events.forEach(event => this.events.set(event.id, event));
    
    // Sample ICP profiles
    const profiles: ICPProfile[] = [
      {
        id: this.profileId++,
        userId: user.id,
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
        id: this.profileId++,
        userId: user.id,
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
        id: this.profileId++,
        userId: user.id,
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
    
    profiles.forEach(profile => this.icpProfiles.set(profile.id, profile));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // ICP Profile methods
  async getICPProfiles(userId: number): Promise<ICPProfile[]> {
    return Array.from(this.icpProfiles.values()).filter(
      profile => profile.userId === userId
    );
  }
  
  async getICPProfile(id: number): Promise<ICPProfile | undefined> {
    return this.icpProfiles.get(id);
  }
  
  async createICPProfile(profile: InsertICPProfile): Promise<ICPProfile> {
    const id = this.profileId++;
    const newProfile: ICPProfile = { 
      ...profile, 
      id, 
      lastUsed: new Date(),
      matchCount: 0,
      createdAt: new Date()
    };
    this.icpProfiles.set(id, newProfile);
    return newProfile;
  }
  
  async updateICPProfile(id: number, profile: Partial<InsertICPProfile>): Promise<ICPProfile | undefined> {
    const existingProfile = this.icpProfiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.icpProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async deleteICPProfile(id: number): Promise<boolean> {
    return this.icpProfiles.delete(id);
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = { 
      ...event, 
      id, 
      lastUpdated: new Date(),
      sourceUrl: event.sourceUrl || null,
      exhibitorCount: event.exhibitorCount || null
    };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  // Persona methods
  async getPersonas(userId: number): Promise<Persona[]> {
    return Array.from(this.personas.values()).filter(
      persona => persona.userId === userId
    );
  }
  
  async getPersona(id: number): Promise<Persona | undefined> {
    return this.personas.get(id);
  }
  
  async createPersona(persona: InsertPersona): Promise<Persona> {
    const id = this.personaId++;
    const newPersona: Persona = { ...persona, id };
    this.personas.set(id, newPersona);
    return newPersona;
  }
  
  async updatePersona(id: number, persona: Partial<InsertPersona>): Promise<Persona | undefined> {
    const existingPersona = this.personas.get(id);
    if (!existingPersona) return undefined;
    
    const updatedPersona = { ...existingPersona, ...persona };
    this.personas.set(id, updatedPersona);
    return updatedPersona;
  }
  
  async deletePersona(id: number): Promise<boolean> {
    return this.personas.delete(id);
  }
  
  // Lead methods
  async getLeads(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      lead => lead.userId === userId
    );
  }
  
  async getLeadsByEvent(userId: number, eventId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      lead => lead.userId === userId && lead.eventId === eventId
    );
  }
  
  async getLeadsByICPProfile(userId: number, icpProfileId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      lead => lead.userId === userId && lead.icpProfileId === icpProfileId
    );
  }
  
  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }
  
  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.leadId++;
    const newLead: Lead = { 
      ...lead, 
      id, 
      createdAt: new Date(),
      status: lead.status || "new"
    };
    this.leads.set(id, newLead);
    return newLead;
  }
  
  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const existingLead = this.leads.get(id);
    if (!existingLead) return undefined;
    
    const updatedLead = { ...existingLead, ...lead };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
  
  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }
  
  async createLeadsBatch(leads: InsertLead[]): Promise<Lead[]> {
    const createdLeads: Lead[] = [];
    
    for (const lead of leads) {
      const createdLead = await this.createLead(lead);
      createdLeads.push(createdLead);
    }
    
    return createdLeads;
  }
}

export const storage = new MemStorage();
