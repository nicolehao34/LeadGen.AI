import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { 
  Building, 
  User, 
  MapPin, 
  Globe, 
  DollarSign, 
  Users, 
  BarChart, 
  CircleCheck, 
  ExternalLink,
  Star
} from "lucide-react";
import { Lead } from "../../types";

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ isOpen, onClose, lead }) => {
  if (!lead) return null;

  // Check if lead has matchDetails from the updated API response
  const hasMatchDetails = lead.matchDetails !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary-600" />
            {lead.companyName}
          </DialogTitle>
          <DialogDescription>
            {lead.companyIndustry || 'Industry not specified'} 
            {lead.companyLocation && ` • ${lead.companyLocation}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Match Details</TabsTrigger>
            {lead.outreachMessage && <TabsTrigger value="outreach">Outreach Message</TabsTrigger>}
            {lead.enrichmentData && <TabsTrigger value="enrichment">Enrichment Data</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex">
                    <Globe className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Website</div>
                      {lead.companyWebsite ? (
                        <a href={`https://${lead.companyWebsite.replace(/^https?:\/\//, '')}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline flex items-center"
                        >
                          {lead.companyWebsite.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-neutral-500">Not available</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <MapPin className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-neutral-700">{lead.companyLocation || 'Not specified'}</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <DollarSign className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Revenue</div>
                      <div className="text-neutral-700">{lead.companyRevenue || 'Not specified'}</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Users className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Company Size</div>
                      <div className="text-neutral-700">{lead.companySize || 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stakeholder Info Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Stakeholder Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex">
                    <User className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Name</div>
                      <div className="text-neutral-700">{lead.stakeholderName}</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Building className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">Title</div>
                      <div className="text-neutral-700">{lead.stakeholderTitle}</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <ExternalLink className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <div className="font-medium">LinkedIn</div>
                      {lead.stakeholderLinkedIn ? (
                        <a href={lead.stakeholderLinkedIn} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline flex items-center"
                        >
                          View Profile
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-neutral-500">Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {lead.stakeholderEmail && (
                    <div className="flex">
                      <div className="font-medium">Email:</div>
                      <div className="text-neutral-700 ml-2">{lead.stakeholderEmail}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Match Reason Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Match Reason</CardTitle>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Fit Score:</span>
                  <div className="flex items-center">
                    <span className="mr-1 font-semibold">{lead.fitScore || 0}%</span>
                    <div className="flex">
                      {Array(5).fill(0).map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`h-4 w-4 ${idx < Math.floor((lead.fitScore || 0) / 20) 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-neutral-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700">
                  {lead.matchReason || 'No match reason provided'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            {hasMatchDetails ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Match Details</CardTitle>
                    <CardDescription>
                      Detailed breakdown of how this lead matches your criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Metrics */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Industry Relevance</span>
                            <span className="text-sm font-bold">{lead.matchDetails?.industryRelevance || 0}%</span>
                          </div>
                          <Progress value={lead.matchDetails?.industryRelevance || 0} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Product Fit</span>
                            <span className="text-sm font-bold">{lead.matchDetails?.productFit || 0}%</span>
                          </div>
                          <Progress value={lead.matchDetails?.productFit || 0} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Decision Making Authority</span>
                            <span className="text-sm font-bold">{lead.matchDetails?.decisionMakingAuthority || 0}%</span>
                          </div>
                          <Progress value={lead.matchDetails?.decisionMakingAuthority || 0} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Budget Alignment</span>
                            <span className="text-sm font-bold">{lead.matchDetails?.budgetAlignment || 0}%</span>
                          </div>
                          <Progress value={lead.matchDetails?.budgetAlignment || 0} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Geographic Match</span>
                            <span className="text-sm font-bold">{lead.matchDetails?.geographicMatch || 0}%</span>
                          </div>
                          <Progress value={lead.matchDetails?.geographicMatch || 0} className="h-2" />
                        </div>
                      </div>
                      
                      {/* Company Size & Matching Criteria */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Company Size</h4>
                          <Badge variant="outline" className="text-base py-1 px-3">
                            {lead.matchDetails?.companySize || 'Unknown'}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Matching Criteria</h4>
                          <div className="space-y-2">
                            {lead.matchDetails?.matchingCriteria?.map((criterion: string, idx: number) => (
                              <div key={idx} className="flex items-start">
                                <CircleCheck className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm">{criterion}</span>
                              </div>
                            )) || <span className="text-neutral-500">No matching criteria specified</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Overall Fit Assessment</h4>
                      <div className="flex items-center mb-4">
                        <BarChart className="h-5 w-5 mr-2 text-primary-600" />
                        <span className="font-bold text-lg">{lead.fitScore || 0}% Match</span>
                      </div>
                      <p className="text-neutral-700">
                        {lead.matchReason || 'No match details available'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Match Details</CardTitle>
                  <CardDescription>No detailed match criteria available for this lead</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    This lead was generated with an earlier version of the system which didn't include detailed matching metrics.
                  </p>
                  <p className="text-neutral-600 mt-2">
                    Regenerate the lead to get detailed matching information.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {lead.outreachMessage && (
            <TabsContent value="outreach" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personalized Outreach Message</CardTitle>
                  <CardDescription>
                    AI-generated message based on the lead's profile and the event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                    <p className="whitespace-pre-line">{lead.outreachMessage}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {lead.enrichmentData && (
            <TabsContent value="enrichment" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Enrichment Data</CardTitle>
                  <CardDescription>
                    Additional information about the company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Technologies */}
                  {lead.enrichmentData.technologies && lead.enrichmentData.technologies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {lead.enrichmentData.technologies.map((tech: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Funding Info */}
                  {lead.enrichmentData.fundingInfo && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Funding Information</h4>
                      <p className="text-neutral-700">{lead.enrichmentData.fundingInfo}</p>
                    </div>
                  )}
                  
                  {/* Recent News */}
                  {lead.enrichmentData.recentNews && lead.enrichmentData.recentNews.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent News</h4>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700">
                        {lead.enrichmentData.recentNews.map((news: string, idx: number) => (
                          <li key={idx}>{news}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Competitors */}
                  {lead.enrichmentData.competitors && lead.enrichmentData.competitors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Competitors</h4>
                      <div className="flex flex-wrap gap-2">
                        {lead.enrichmentData.competitors.map((competitor: string, idx: number) => (
                          <Badge key={idx} variant="outline">{competitor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;